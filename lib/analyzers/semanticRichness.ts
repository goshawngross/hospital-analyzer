import type { CheerioAPI } from "cheerio";
import { Finding, PillarResult } from "../types";
import { scoreToGrade } from "../scoring";

export function analyzeSemanticRichness(
  $: CheerioAPI,
  mode: "main" | "doctor-finder"
): PillarResult {
  const findings: Finding[] = [];
  const recommendations: string[] = [];

  // JSON-LD blocks
  const jsonLdScripts = $('script[type="application/ld+json"]');
  const jsonLdCount = jsonLdScripts.length;
  findings.push({
    label: "JSON-LD structured data blocks",
    found: jsonLdCount > 0,
    detail: jsonLdCount > 0 ? `Found ${jsonLdCount} JSON-LD block(s)` : "No JSON-LD structured data found",
    weight: 20,
  });
  if (jsonLdCount === 0) {
    recommendations.push(
      "Add JSON-LD structured data to help AI systems understand your content. Start with Organization and WebSite schemas on your homepage."
    );
  }

  // Healthcare-specific schemas
  const healthcareTypes = [
    "Physician",
    "MedicalOrganization",
    "Hospital",
    "MedicalCondition",
    "MedicalClinic",
    "MedicalProcedure",
    "MedicalWebPage",
  ];
  let foundHealthcareSchemas: string[] = [];
  jsonLdScripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      const types = Array.isArray(data) ? data : [data];
      for (const item of types) {
        const type = item["@type"];
        if (type && healthcareTypes.some((ht) => String(type).includes(ht))) {
          foundHealthcareSchemas.push(String(type));
        }
        // Check @graph
        if (item["@graph"]) {
          for (const graphItem of item["@graph"]) {
            const gType = graphItem["@type"];
            if (gType && healthcareTypes.some((ht) => String(gType).includes(ht))) {
              foundHealthcareSchemas.push(String(gType));
            }
          }
        }
      }
    } catch {}
  });
  foundHealthcareSchemas = [...new Set(foundHealthcareSchemas)];
  const hasHealthcare = foundHealthcareSchemas.length > 0;
  findings.push({
    label: "Healthcare-specific Schema.org types",
    found: hasHealthcare,
    detail: hasHealthcare
      ? `Found: ${foundHealthcareSchemas.join(", ")}`
      : "No Physician, Hospital, or MedicalOrganization schemas detected",
    weight: mode === "doctor-finder" ? 30 : 25,
  });
  if (!hasHealthcare) {
    recommendations.push(
      mode === "doctor-finder"
        ? "Add Physician schema markup to each doctor profile. This is critical for AI systems to parse provider information."
        : "Add MedicalOrganization and Hospital schema to your homepage so AI assistants can identify your health system."
    );
  }

  // Generic Schema.org types
  let foundGenericSchemas: string[] = [];
  const genericTypes = ["LocalBusiness", "Organization", "WebSite", "BreadcrumbList", "WebPage"];
  jsonLdScripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const check = (obj: Record<string, unknown>) => {
          const t = String(obj["@type"] || "");
          if (genericTypes.some((gt) => t.includes(gt))) foundGenericSchemas.push(t);
        };
        check(item);
        if (item["@graph"]) item["@graph"].forEach(check);
      }
    } catch {}
  });
  foundGenericSchemas = [...new Set(foundGenericSchemas)];
  findings.push({
    label: "Generic Schema.org types (Organization, WebSite, etc.)",
    found: foundGenericSchemas.length > 0,
    detail: foundGenericSchemas.length > 0
      ? `Found: ${foundGenericSchemas.join(", ")}`
      : "No generic Schema.org types found",
    weight: 10,
  });

  // OpenGraph tags
  const ogTags = $('meta[property^="og:"]');
  const ogCount = ogTags.length;
  findings.push({
    label: "OpenGraph meta tags",
    found: ogCount >= 3,
    detail: `Found ${ogCount} OpenGraph tag(s)`,
    weight: 15,
  });
  if (ogCount < 3) {
    recommendations.push(
      "Add OpenGraph tags (og:title, og:description, og:image, og:type) to improve how AI and social platforms understand your pages."
    );
  }

  // Meta description
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  findings.push({
    label: "Meta description",
    found: metaDesc.length > 10,
    detail: metaDesc.length > 10 ? `${metaDesc.length} characters` : "Missing or too short",
    weight: 10,
  });

  // Title tag
  const title = $("title").text().trim();
  findings.push({
    label: "Meaningful title tag",
    found: title.length > 10,
    detail: title ? `"${title.substring(0, 60)}${title.length > 60 ? "..." : ""}"` : "No title tag found",
    weight: 5,
  });

  // Canonical URL
  const canonical = $('link[rel="canonical"]').attr("href");
  findings.push({
    label: "Canonical URL set",
    found: !!canonical,
    detail: canonical ? `Set to ${canonical}` : "No canonical URL defined",
    weight: 5,
  });

  // Heading hierarchy
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const goodHeadings = h1Count >= 1 && h2Count >= 1;
  findings.push({
    label: "Heading hierarchy (H1 + H2s)",
    found: goodHeadings,
    detail: `${h1Count} H1(s), ${h2Count} H2(s)`,
    weight: 10,
  });

  // Calculate score
  const maxScore = findings.reduce((s, f) => s + f.weight, 0);
  const rawScore = findings.reduce((s, f) => s + (f.found ? f.weight : 0), 0);
  const score = Math.round((rawScore / maxScore) * 100);

  if (recommendations.length === 0) {
    recommendations.push(
      "Great semantic coverage! Consider adding more granular healthcare schemas like MedicalCondition and MedicalProcedure."
    );
  }

  return {
    pillar: "Semantic Richness",
    slug: "semantic-richness",
    grade: scoreToGrade(score),
    score,
    findings,
    recommendations,
  };
}
