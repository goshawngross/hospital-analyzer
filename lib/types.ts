export interface Finding {
  label: string;
  found: boolean;
  detail?: string;
  weight: number;
}

export interface PillarResult {
  pillar: string;
  slug: string;
  grade: Grade;
  score: number;
  findings: Finding[];
  recommendations: string[];
}

export interface AnalysisResponse {
  url: string;
  fetchedAt: string;
  overallGrade: Grade;
  overallScore: number;
  mode: "main" | "doctor-finder";
  pillars: PillarResult[];
  hasLlmsTxt: boolean;
  error?: string;
}

export type Grade = "A" | "B" | "C" | "D";
