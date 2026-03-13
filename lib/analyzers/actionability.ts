import type { CheerioAPI } from "cheerio";
import { Finding, PillarResult } from "../types";
import { scoreToGrade } from "../scoring";

export function analyzeActionability(
  $: CheerioAPI,
  mode: "main" | "doctor-finder"
): PillarResult {
  const findings: Finding[] = [];
  const recommendations: string[] = [];

  // Online booking links/buttons
  const bookingPatterns = /book|schedule|appointment|make an appointment/i;
  const bookingElements = $("a, button").filter((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr("aria-label") || "";
    return bookingPatterns.test(text) || bookingPatterns.test(ariaLabel);
  });
  findings.push({
    label: "Online booking links or buttons",
    found: bookingElements.length > 0,
    detail: bookingElements.length > 0
      ? `Found ${bookingElements.length} booking-related element(s)`
      : "No booking CTAs detected",
    weight: mode === "doctor-finder" ? 30 : 25,
  });
  if (bookingElements.length === 0) {
    recommendations.push(
      "Add clear online booking buttons so AI agents can help patients schedule appointments without phone calls."
    );
  }

  // Booking leads to form (not just phone)
  let formBookingCount = 0;
  let phoneBookingCount = 0;
  bookingElements.each((_, el) => {
    const href = $(el).attr("href") || "";
    if (href.startsWith("tel:")) {
      phoneBookingCount++;
    } else if (href && !href.startsWith("tel:")) {
      formBookingCount++;
    }
  });
  findings.push({
    label: "Booking links lead to digital paths (not phone-only)",
    found: formBookingCount > 0,
    detail:
      formBookingCount > 0
        ? `${formBookingCount} digital path(s), ${phoneBookingCount} phone-only`
        : phoneBookingCount > 0
        ? `All ${phoneBookingCount} booking path(s) are phone-only`
        : "No booking paths detected",
    weight: 20,
  });

  // Phone-only friction (negative signal)
  const allTelLinks = $('a[href^="tel:"]').length;
  const highPhoneFriction = allTelLinks > 3 && formBookingCount === 0;
  findings.push({
    label: "Low phone-call friction",
    found: !highPhoneFriction,
    detail: `${allTelLinks} phone link(s) found${
      highPhoneFriction ? " — heavy reliance on phone calls" : ""
    }`,
    weight: 15,
  });
  if (highPhoneFriction) {
    recommendations.push(
      "Reduce reliance on phone-only booking. AI agents cannot make phone calls — they need web forms or APIs to complete appointments."
    );
  }

  // Portal/login walls
  const portalPatterns = /mychart|patient portal|sign in to book|log in to schedule/i;
  const portalLinks = $("a").filter((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href") || "";
    return portalPatterns.test(text) || portalPatterns.test(href);
  });
  findings.push({
    label: "No login-wall friction for booking",
    found: portalLinks.length === 0,
    detail:
      portalLinks.length > 0
        ? `Found ${portalLinks.length} portal/login-gated booking path(s)`
        : "No login walls detected on booking paths",
    weight: 10,
  });
  if (portalLinks.length > 0) {
    recommendations.push(
      "Offer a booking path that doesn't require portal login. New patients especially benefit from open scheduling that AI agents can navigate."
    );
  }

  // Contact forms
  const forms = $("form").length;
  findings.push({
    label: "Contact or request forms present",
    found: forms > 0,
    detail: `${forms} form(s) detected`,
    weight: 10,
  });

  // Chat widget
  const chatPatterns = /drift|intercom|livechat|podium|birdeye|zendesk|hubspot|tawk/i;
  const scripts = $("script[src]")
    .map((_, el) => $(el).attr("src") || "")
    .get();
  const hasChat = scripts.some((s) => chatPatterns.test(s));
  findings.push({
    label: "Live chat or chatbot widget",
    found: hasChat,
    detail: hasChat ? "Chat widget detected" : "No chat widget found",
    weight: 10,
  });

  // Clear CTA buttons
  const vaguePatterns = /^(click here|learn more|read more|here|go|ok|submit)$/i;
  const allButtons = $("a, button").filter((_, el) => {
    const text = $(el).text().trim();
    return text.length > 2 && text.length < 60;
  });
  const clearCtas = allButtons.filter((_, el) => {
    const text = $(el).text().trim();
    return !vaguePatterns.test(text);
  });
  const ctaRatio = allButtons.length > 0 ? clearCtas.length / allButtons.length : 0;
  findings.push({
    label: "Descriptive CTA button text",
    found: ctaRatio > 0.7,
    detail: `${Math.round(ctaRatio * 100)}% of links/buttons have descriptive text`,
    weight: 10,
  });

  // Calculate score
  const maxScore = findings.reduce((s, f) => s + f.weight, 0);
  const rawScore = findings.reduce((s, f) => s + (f.found ? f.weight : 0), 0);
  const score = Math.round(Math.max(0, (rawScore / maxScore) * 100));

  if (recommendations.length === 0) {
    recommendations.push(
      "Strong actionability! Consider exposing an API-backed booking endpoint so AI agents can schedule appointments programmatically."
    );
  }

  return {
    pillar: "Actionability Surface",
    slug: "actionability",
    grade: scoreToGrade(score),
    score,
    findings,
    recommendations,
  };
}
