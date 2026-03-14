"use client";

import { AnalysisResponse, Grade } from "@/lib/types";
import PillarCard from "./PillarCard";

function overallGradeLabel(grade: Grade): string {
  switch (grade) {
    case "A":
      return "Agent-Native";
    case "B":
      return "AI-Friendly";
    case "C":
      return "Human-Only";
    case "D":
      return "AI-Opaque";
  }
}

function gradeRing(grade: Grade): string {
  switch (grade) {
    case "A":
      return "ring-green-300 text-green-600";
    case "B":
      return "ring-blue-300 text-blue-600";
    case "C":
      return "ring-yellow-300 text-yellow-600";
    case "D":
      return "ring-red-300 text-red-600";
  }
}

function gradeBg(): string {
  // Branded background — solid red from hospitalwebsites.com palette
  return "from-[#f45e5e] to-[#e04a4a]";
}

export default function Scorecard({ data }: { data: AnalysisResponse }) {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Overall Grade */}
      <div
        className={`text-center px-8 py-12 rounded-3xl bg-gradient-to-br ${gradeBg()} mb-8`}
      >
        <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-4">
          Overall Agentic Readiness
        </p>
        <div
          className={`inline-flex items-center justify-center w-28 h-28 rounded-full ring-4 ${gradeRing(data.overallGrade)} bg-white`}
        >
          <span className="text-5xl font-bold">{data.overallGrade}</span>
        </div>
        <p className="mt-4 text-xl font-semibold text-white">
          {overallGradeLabel(data.overallGrade)}
        </p>
        <p className="mt-1 text-sm text-white/80">
          Score: {data.overallScore}/100
        </p>
        {data.mode === "doctor-finder" && (
          <p className="mt-3 inline-block text-xs bg-white/20 text-white px-3 py-1 rounded-full">
            Analyzed as a Provider Directory page
          </p>
        )}
        <p className="mt-4 text-xs text-white/60">
          {data.url}
        </p>
      </div>

      {/* Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.pillars.map((pillar, i) => (
          <div key={pillar.slug} className={`animate-fade-in-up-delay-${i}`}>
            <PillarCard pillar={pillar} />
          </div>
        ))}
      </div>
    </div>
  );
}
