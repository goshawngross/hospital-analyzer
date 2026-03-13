import type { CheerioAPI } from "cheerio";
import { Finding, PillarResult } from "../types";
import { scoreToGrade } from "../scoring";

export function analyzeDomNavigability($: CheerioAPI): PillarResult {
  const findings: Finding[] = [];
  const recommendations: string[] = [];

  // ARIA labels on interactive elements
  const interactiveEls = $("button, a, input, select, textarea");
  const ariaLabeledEls = $(
    "[aria-label], [aria-labelledby], [role='button'], [role='link'], [role='navigation']"
  );
  const ariaRatio =
    interactiveEls.length > 0
      ? ariaLabeledEls.length / interactiveEls.length
      : 0;
  findings.push({
    label: "ARIA labels on interactive elements",
    found: ariaRatio > 0.15,
    detail: `${ariaLabeledEls.length} ARIA-labeled elements out of ${interactiveEls.length} interactive elements (${Math.round(ariaRatio * 100)}%)`,
    weight: 20,
  });
  if (ariaRatio <= 0.15) {
    recommendations.push(
      "Add aria-label attributes to buttons and links (e.g., aria-label=\"Book appointment with Dr. Smith\"). AI agents rely on these to understand interactive elements."
    );
  }

  // Descriptive button text
  const buttons = $("button");
  let descriptiveCount = 0;
  const vagueTexts = ["ok", "go", "click here", "submit", "x", "close", ""];
  buttons.each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (text.length > 2 && !vagueTexts.includes(text)) descriptiveCount++;
  });
  const btnRatio = buttons.length > 0 ? descriptiveCount / buttons.length : 1;
  findings.push({
    label: "Descriptive button text",
    found: btnRatio > 0.6,
    detail: `${descriptiveCount} of ${buttons.length} buttons have descriptive text`,
    weight: 15,
  });

  // Cookie/consent banner detection
  const consentPatterns = /onetrust|cookiebot|trustarc|quantcast|cookie-consent|gdpr|cookie-banner/i;
  const scripts = $("script[src]")
    .map((_, el) => $(el).attr("src") || "")
    .get();
  const consentDivs = $(
    "#onetrust-banner-sdk, .cookie-banner, #cookie-consent, [class*='cookie'], [id*='cookie-consent']"
  );
  const hasConsentBanner =
    scripts.some((s) => consentPatterns.test(s)) || consentDivs.length > 0;
  findings.push({
    label: "No intrusive cookie/consent banners",
    found: !hasConsentBanner,
    detail: hasConsentBanner
      ? "Cookie consent banner detected — can block AI agent interaction"
      : "No consent banner scripts detected",
    weight: 10,
  });
  if (hasConsentBanner) {
    recommendations.push(
      "Cookie consent banners block AI agents from interacting with your site. Consider server-side consent handling or making critical paths accessible without banner dismissal."
    );
  }

  // CAPTCHA detection
  const captchaPatterns = /recaptcha|hcaptcha|captcha|turnstile/i;
  const hasCaptcha =
    scripts.some((s) => captchaPatterns.test(s)) ||
    $(".g-recaptcha, .h-captcha, [data-sitekey]").length > 0;
  findings.push({
    label: "No CAPTCHA barriers",
    found: !hasCaptcha,
    detail: hasCaptcha
      ? "CAPTCHA detected — blocks AI agents entirely"
      : "No CAPTCHA scripts detected",
    weight: 15,
  });
  if (hasCaptcha) {
    recommendations.push(
      "CAPTCHAs completely block AI agents. Consider rate-limiting or bot detection that allows legitimate automated access while blocking abuse."
    );
  }

  // Server-rendered content
  const textNodes = $("body")
    .find("p, h1, h2, h3, h4, li, td, span, div")
    .filter((_, el) => {
      const text = $(el)
        .contents()
        .filter((_, n) => n.type === "text")
        .text()
        .trim();
      return text.length > 20;
    });
  const hasContent = textNodes.length > 5;
  findings.push({
    label: "Server-rendered content (not JS-only)",
    found: hasContent,
    detail: hasContent
      ? `${textNodes.length} content-rich elements found in initial HTML`
      : "Very little text in initial HTML — likely requires JavaScript to render",
    weight: 20,
  });
  if (!hasContent) {
    recommendations.push(
      "Your content appears to be rendered client-side only. AI agents may see a blank page. Use server-side rendering (SSR) to ensure content is in the initial HTML."
    );
  }

  // Semantic HTML
  const semanticEls = $("nav, main, header, footer, article, section");
  findings.push({
    label: "Semantic HTML elements (nav, main, article, etc.)",
    found: semanticEls.length >= 3,
    detail: `${semanticEls.length} semantic element(s) found`,
    weight: 10,
  });

  // Form labels
  const inputs = $("input:not([type='hidden']), select, textarea");
  const labels = $("label[for]");
  const labelRatio = inputs.length > 0 ? labels.length / inputs.length : 1;
  findings.push({
    label: "Form inputs have associated labels",
    found: labelRatio > 0.5 || inputs.length === 0,
    detail:
      inputs.length > 0
        ? `${labels.length} labels for ${inputs.length} inputs`
        : "No form inputs detected",
    weight: 10,
  });

  // Calculate score
  const maxScore = findings.reduce((s, f) => s + f.weight, 0);
  const rawScore = findings.reduce((s, f) => s + (f.found ? f.weight : 0), 0);
  const score = Math.round(Math.max(0, (rawScore / maxScore) * 100));

  if (recommendations.length === 0) {
    recommendations.push(
      "Excellent DOM navigability! Your site is well-structured for AI agent interaction."
    );
  }

  return {
    pillar: "DOM Navigability",
    slug: "dom-navigability",
    grade: scoreToGrade(score),
    score,
    findings,
    recommendations,
  };
}
