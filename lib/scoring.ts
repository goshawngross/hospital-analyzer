import { Grade, PillarResult } from "./types";

export function scoreToGrade(score: number): Grade {
  if (score >= 75) return "A";
  if (score >= 55) return "B";
  if (score >= 35) return "C";
  return "D";
}

const PILLAR_WEIGHTS: Record<string, number> = {
  "semantic-richness": 0.25,
  actionability: 0.3,
  "dom-navigability": 0.25,
  "integration-readiness": 0.2,
};

export function computeOverallScore(pillars: PillarResult[]): {
  score: number;
  grade: Grade;
} {
  const weightedScore = pillars.reduce(
    (sum, p) => sum + p.score * (PILLAR_WEIGHTS[p.slug] || 0.25),
    0
  );
  const score = Math.round(weightedScore);
  return { score, grade: scoreToGrade(score) };
}

export function gradeColor(grade: Grade): string {
  switch (grade) {
    case "A":
      return "text-grade-a";
    case "B":
      return "text-grade-b";
    case "C":
      return "text-grade-c";
    case "D":
      return "text-grade-d";
  }
}

export function gradeBgColor(grade: Grade): string {
  switch (grade) {
    case "A":
      return "bg-grade-a";
    case "B":
      return "bg-grade-b";
    case "C":
      return "bg-grade-c";
    case "D":
      return "bg-grade-d";
  }
}
