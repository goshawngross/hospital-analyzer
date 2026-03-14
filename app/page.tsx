"use client";

import { useState } from "react";
import Header from "./components/Header";
import AnalyzerForm from "./components/AnalyzerForm";
import ProgressIndicator from "./components/ProgressIndicator";
import Scorecard from "./components/Scorecard";
import InsightBridge from "./components/InsightBridge";
import CtaSection from "./components/CtaSection";
import SpecialOffer from "./components/SpecialOffer";
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
            <InsightBridge data={results} />
            <CtaSection data={results} />
            <SpecialOffer data={results} />
          </div>
        )}

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-20 pt-8 border-t border-slate-200/60 text-center">
          <p className="text-xs text-slate-400">
            This analysis evaluates the publicly accessible HTML of your website.
            It does not access authenticated areas or store any data.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            This lightweight web app was designed and developed to generate leads
            for smart healthcare tech brands and agencies. Need one of your own?{" "}
            <a
              href="https://hospitalwebsites.com/contact/"
              target="_blank"
              rel="noopener"
              className="text-slate-700 font-medium hover:text-slate-900 transition-colors underline underline-offset-2"
            >
              Contact HospitalWebsites.com
            </a>{" "}
            to learn more.
          </p>

          {/* Logos — mobile only (hidden on sm+) */}
          <div className="flex sm:hidden flex-col items-center gap-3 mt-8 pt-6 border-t border-slate-200/60">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
              Brought to you by
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://hospitalwebsites.com"
                target="_blank"
                rel="noopener"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hospitalwebsites-logo.webp"
                  alt="HospitalWebsites.com"
                  className="h-7 w-auto"
                />
              </a>
              <span className="text-slate-300 text-xs">&amp;</span>
              <a
                href="https://www.sparkle.health/"
                target="_blank"
                rel="noopener"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sparkle-logo.png"
                  alt="Sparkle"
                  className="h-7 w-auto"
                />
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
