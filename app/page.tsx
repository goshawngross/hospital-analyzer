"use client";

import { useState } from "react";
import Header from "./components/Header";
import AnalyzerForm from "./components/AnalyzerForm";
import ProgressIndicator from "./components/ProgressIndicator";
import Scorecard from "./components/Scorecard";
import CtaSection from "./components/CtaSection";
import { AnalysisResponse } from "@/lib/types";

type AppState = "idle" | "loading" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [apiDone, setApiDone] = useState(false);

  const handleAnalyze = async (url: string) => {
    setState("loading");
    setError("");
    setApiDone(false);

    const MIN_DISPLAY_TIME = 15000; // 15 seconds minimum loading experience
    const startTime = Date.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      setResults(data);

      // Wait for the full 15-second animation before revealing results
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        setApiDone(true);
        // Then pause briefly after final checkmarks appear
        setTimeout(() => {
          setState("results");
        }, 1200);
      }, remaining);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setState("error");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="px-6 py-16 sm:py-24">
        {/* Form - always visible at top when idle or error */}
        {(state === "idle" || state === "error") && (
          <AnalyzerForm onSubmit={handleAnalyze} isLoading={false} />
        )}

        {/* Loading state */}
        {state === "loading" && (
          <div className="text-center">
            <AnalyzerForm onSubmit={handleAnalyze} isLoading={true} />
            <ProgressIndicator isComplete={apiDone} />
          </div>
        )}

        {/* Error */}
        {state === "error" && error && (
          <div className="max-w-xl mx-auto mt-8 animate-fade-in-up">
            <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {state === "results" && results && (
          <div className="animate-fade-in-up">
            {/* Re-analyze option */}
            <div className="max-w-4xl mx-auto mb-12">
              <button
                onClick={() => {
                  setState("idle");
                  setResults(null);
                }}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Analyze another site
              </button>
            </div>

            <Scorecard data={results} />
            <CtaSection data={results} />
          </div>
        )}

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-20 pt-8 border-t border-slate-200/60 text-center">
          <p className="text-xs text-slate-400">
            This analysis evaluates the publicly accessible HTML of your website.
            It does not access authenticated areas or store any data.
          </p>
        </footer>
      </main>
    </div>
  );
}
