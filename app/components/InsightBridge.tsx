"use client";

import { AnalysisResponse } from "@/lib/types";

export default function InsightBridge({ data }: { data: AnalysisResponse }) {
  const actionabilityPillar = data.pillars.find(
    (p) => p.slug === "actionability"
  );
  const actionGrade = actionabilityPillar?.grade ?? data.overallGrade;

  return (
    <div className="max-w-3xl mx-auto mt-14 animate-fade-in-up-delay-2">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 p-8 sm:p-10">
        {/* Accent bar */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent" />

        <div className="flex gap-4 items-start">
          {/* Icon */}
          <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl bg-red-50 items-center justify-center mt-0.5">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Why this matters right now
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              AI agents are already attempting to search for doctors, check
              availability, and book appointments on hospital websites — without
              a human guiding the process. If your Find-a-Doctor application
              can&apos;t be navigated and transacted with by these agents,
              you&apos;re invisible to a fast-growing channel of patient
              acquisition.
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Your site scored{" "}
              <span className="font-semibold text-slate-900">{actionGrade}</span>{" "}
              on Actionability — the pillar that measures whether an AI agent
              can actually{" "}
              <em>do something</em> on your site, like find a provider and book
              an appointment. That&apos;s the gap that matters most.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
