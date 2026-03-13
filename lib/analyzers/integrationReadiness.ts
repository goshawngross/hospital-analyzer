import type { CheerioAPI } from "cheerio";
import { Finding, PillarResult } from "../types";
import { scoreToGrade } from "../scoring";
import { probeEndpoint } from "../fetcher";

export async function analyzeIntegrationReadiness(
  $: CheerioAPI,
  baseUrl: string
): Promise<PillarResult> {
  const findings: Finding[] = [];
  const recommendations: string[] = [];

  // Probe well-known endpoints in parallel
  const [robotsResult, aiPluginResult, swaggerResult, openApiResult, fhirResult, sitemapResult] =
    await Promise.all([
      probeEndpoint(`${baseUrl}/robots.txt`),
      probeEndpoint(`${baseUrl}/.well-known/ai-plugin.json`),
      probeEndpoint(`${baseUrl}/swagger.json`),
      probeEndpoint(`${baseUrl}/openapi.json`),
      probeEndpoint(`${baseUrl}/fhir/metadata`),
      probeEndpoint(`${baseUrl}/sitemap.xml`),
    ]);

  // robots.txt
  findings.push({
    label: "robots.txt exists and allows crawling",
    found: robotsResult.exists && !robotsResult.body?.includes("Disallow: /\n"),
    detail: robotsResult.exists
      ? robotsResult.body?.includes("Disallow: /\n")
        ? "robots.txt blocks all crawling"
        : "robots.txt exists and allows crawling"
      : "No robots.txt found",
    weight: 10,
  });

  // AI-specific directives in robots.txt
  const aiBotPatterns = /gptbot|chatgpt|anthropic|claude|ccbot|google-extended|ai2bot|bytespider/i;
  const hasAiDirectives = robotsResult.exists && aiBotPatterns.test(robotsResult.body || "");
  findings.push({
    label: "AI-specific directives in robots.txt",
    found: hasAiDirectives,
    detail: hasAiDirectives
      ? "Has directives for AI crawlers (GPTBot, Claude, etc.)"
      : "No AI-specific bot directives found",
    weight: 10,
  });
  if (!hasAiDirectives && robotsResult.exists) {
    recommendations.push(
      "Add AI-specific directives to your robots.txt (e.g., rules for GPTBot, ClaudeBot) to control how AI systems access your content."
    );
  }

  // AI plugin manifest
  findings.push({
    label: "AI plugin manifest (ai-plugin.json)",
    found: aiPluginResult.exists,
    detail: aiPluginResult.exists
      ? "AI plugin manifest found — site is AI-agent discoverable"
      : "No ai-plugin.json manifest",
    weight: 20,
  });
  if (!aiPluginResult.exists) {
    recommendations.push(
      "Create an ai-plugin.json manifest at /.well-known/ai-plugin.json to let AI assistants discover and interact with your site's capabilities."
    );
  }

  // OpenAPI/Swagger
  const hasApiSpec = swaggerResult.exists || openApiResult.exists;
  findings.push({
    label: "OpenAPI / Swagger specification",
    found: hasApiSpec,
    detail: hasApiSpec
      ? "API specification found — agents can understand your endpoints"
      : "No OpenAPI or Swagger spec detected",
    weight: 15,
  });
  if (!hasApiSpec) {
    recommendations.push(
      "Publish an OpenAPI specification so AI agents can programmatically discover and use your booking, search, and directory APIs."
    );
  }

  // FHIR endpoint
  findings.push({
    label: "FHIR API endpoint",
    found: fhirResult.exists,
    detail: fhirResult.exists
      ? "FHIR metadata endpoint found — healthcare interoperability enabled"
      : "No FHIR API endpoint detected",
    weight: 20,
  });
  if (!fhirResult.exists) {
    recommendations.push(
      "Expose a FHIR-compliant API endpoint. This is the healthcare standard for machine-to-machine data exchange and is critical for AI agent interoperability."
    );
  }

  // Developer portal links
  const devPatterns = /developer|api-docs|documentation.*api|swagger/i;
  const devLinks = $("a").filter((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().trim();
    return devPatterns.test(href) || devPatterns.test(text);
  });
  findings.push({
    label: "Developer portal or API documentation link",
    found: devLinks.length > 0,
    detail:
      devLinks.length > 0
        ? `${devLinks.length} developer/API link(s) found`
        : "No developer portal or API documentation links",
    weight: 10,
  });

  // Sitemap
  findings.push({
    label: "XML Sitemap",
    found: sitemapResult.exists,
    detail: sitemapResult.exists
      ? "sitemap.xml found — helps AI systems discover content"
      : "No sitemap.xml found",
    weight: 10,
  });

  // RSS/Atom feeds
  const feeds = $('link[type="application/rss+xml"], link[type="application/atom+xml"]');
  findings.push({
    label: "RSS or Atom feeds",
    found: feeds.length > 0,
    detail: feeds.length > 0 ? `${feeds.length} feed(s) found` : "No RSS/Atom feeds",
    weight: 5,
  });

  // Calculate score
  const maxScore = findings.reduce((s, f) => s + f.weight, 0);
  const rawScore = findings.reduce((s, f) => s + (f.found ? f.weight : 0), 0);
  const score = Math.round(Math.max(0, (rawScore / maxScore) * 100));

  if (recommendations.length === 0) {
    recommendations.push(
      "Outstanding integration readiness! Your site is well-positioned for the agentic AI era."
    );
  }

  return {
    pillar: "Integration Protocol Readiness",
    slug: "integration-readiness",
    grade: scoreToGrade(score),
    score,
    findings,
    recommendations,
  };
}
