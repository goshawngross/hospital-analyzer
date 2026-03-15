"use client";

import { AnalysisResponse } from "@/lib/types";

export default function CtaSection({ data }: { data: AnalysisResponse }) {
  // Find weakest pillar for dynamic messaging
  const weakest = [...data.pillars].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="max-w-3xl mx-auto mt-16 animate-fade-in-up-delay-3">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center text-white">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
          Next Steps
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Ready to make your website
          <br />
          agent-ready?
        </h3>
        <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
          Hello Health is purpose-built for hospital websites —
          including a Find-a-Doctor application designed from the ground up for
          agentic AI. Structured data, API-first provider search, bookable
          appointment slots, and FHIR integration — all ready for AI agents
          out of the box.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://www.google.com"
            target="_blank"
            rel="noopener"
            className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-medium text-sm
              hover:bg-slate-100 transition-colors"
          >
            See How Hello Health Fixes This
          </a>
        </div>
      </div>
    </div>
  );
}
