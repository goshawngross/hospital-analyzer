"use client";

import { useState } from "react";
import { PillarResult, Grade } from "@/lib/types";

const PILLAR_ICONS: Record<string, string> = {
  "semantic-readiness": "{ }",
  "semantic-richness": "{ }",
  "actionability-readiness": ">>",
  actionability: ">>",
  "navigation-readiness": "</>",
  "dom-navigability": "</>",
  "integration-readiness": "API",
};

function gradeStyles(grade: Grade) {
  switch (grade) {
    case "A":
      return "bg-green-50 text-green-700 ring-green-200";
    case "B":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "C":
      return "bg-yellow-50 text-yellow-700 ring-yellow-200";
    case "D":
      return "bg-red-50 text-red-700 ring-red-200";
  }
}

export default function PillarCard({ pillar }: { pillar: PillarResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 rounded-lg px-2.5 py-1.5">
            {PILLAR_ICONS[pillar.slug] || "?"}
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">{pillar.pillar}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Score: {pillar.score}/100</p>
          </div>
        </div>
        <span
          className={`text-2xl font-bold px-3 py-1 rounded-xl ring-1 ${gradeStyles(pillar.grade)}`}
        >
          {pillar.grade}
        </span>
      </div>

      {/* Findings */}
      <div className="space-y-2">
        {pillar.findings.slice(0, expanded ? undefined : 3).map((finding, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className={`mt-0.5 text-sm ${finding.found ? "text-green-500" : "text-red-400"}`}>
              {finding.found ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <div>
              <p className="text-xs font-medium text-slate-700">{finding.label}</p>
              {finding.detail && (
                <p className="text-[11px] text-slate-400 mt-0.5">{finding.detail}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {pillar.findings.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
        >
          {expanded ? "Show less" : `Show all ${pillar.findings.length} findings`}
        </button>
      )}

      {/* Recommendations */}
      {pillar.recommendations.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2.5">
            Recommendations
          </p>
          <div className="space-y-2">
            {pillar.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                  </svg>
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
