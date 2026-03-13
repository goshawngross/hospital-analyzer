import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { fetchPage, FetchError } from "@/lib/fetcher";
import { computeOverallScore } from "@/lib/scoring";
import { analyzeSemanticRichness } from "@/lib/analyzers/semanticRichness";
import { analyzeActionability } from "@/lib/analyzers/actionability";
import { analyzeDomNavigability } from "@/lib/analyzers/domNavigability";
import { analyzeIntegrationReadiness } from "@/lib/analyzers/integrationReadiness";
import { AnalysisResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

function detectMode(url: string): "main" | "doctor-finder" {
  const path = new URL(url).pathname.toLowerCase();
  const doctorPatterns = [
    "/find-a-doctor",
    "/find-a-provider",
    "/find-provider",
    "/doctors",
    "/physician",
    "/our-doctors",
    "/provider-directory",
    "/find-doctor",
    "/medical-staff",
    "/provider",
    "/find-a-physician",
    "/directory",
  ];
  return doctorPatterns.some((p) => path.includes(p)) ? "doctor-finder" : "main";
}

function getBaseUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    const url = normalizeUrl(rawUrl);
    const mode = detectMode(url);
    const baseUrl = getBaseUrl(url);

    // Fetch the page
    let html: string;
    try {
      const result = await fetchPage(url);
      html = result.html;
    } catch (err) {
      if (err instanceof FetchError) {
        return NextResponse.json({ error: err.message } as AnalysisResponse, {
          status: 422,
        });
      }
      return NextResponse.json(
        { error: "Failed to fetch the website. Please check the URL and try again." } as AnalysisResponse,
        { status: 422 }
      );
    }

    // Parse HTML
    const $ = cheerio.load(html);

    // Run all analyzers
    const [semantic, actionability, domNav, integration] = await Promise.all([
      Promise.resolve(analyzeSemanticRichness($, mode)),
      Promise.resolve(analyzeActionability($, mode)),
      Promise.resolve(analyzeDomNavigability($)),
      analyzeIntegrationReadiness($, baseUrl),
    ]);

    const pillars = [semantic, actionability, domNav, integration];
    const { score: overallScore, grade: overallGrade } = computeOverallScore(pillars);

    const response: AnalysisResponse = {
      url,
      fetchedAt: new Date().toISOString(),
      overallGrade,
      overallScore,
      mode,
      pillars,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
