"use client";

import { useState } from "react";
import { AnalysisResponse } from "@/lib/types";

export default function SpecialOffer({ data }: { data: AnalysisResponse }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Only show if the site is missing llms.txt
  if (data.hasLlmsTxt) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      // Send directly to Web3Forms (client-side, free tier)
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "8a27b57d-65d6-4e09-a95c-a23c40d9ab72",
          subject: `New Lead: ${email.trim()} — llms.txt request`,
          from_name: "AgentVitals",
          email: email.trim(),
          "Website Analyzed": data.url,
          "Overall Grade": `${data.overallGrade} (${data.overallScore}/100)`,
          message: `${email.trim()} wants a custom llms.txt file for ${data.url}. Their site scored ${data.overallGrade} (${data.overallScore}/100).`,
        }),
      });

      const result = await res.json();
      if (!result.success) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 animate-fade-in-up-delay-3">
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200/60 p-10">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z" />
            </svg>
            Free Resource
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-center">
          Your site is missing an{" "}
          <span className="text-amber-600">llms.txt</span> file
        </h3>

        <p className="mt-4 text-slate-600 text-sm leading-relaxed max-w-xl mx-auto text-center">
          <strong>llms.txt</strong> is an emerging web standard — a Markdown file placed in
          your site&apos;s root directory that gives AI models a curated map of your
          most important content. Think of it as a{" "}
          <strong>sitemap built specifically for AI</strong>.
        </p>

        <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-xl mx-auto text-center">
          Without it, AI assistants like ChatGPT, Claude, and Perplexity are guessing
          which of your pages matter most. With it, you control how AI surfaces your
          services, locations, providers, and conditions to the millions of patients
          already using AI to find care.
        </p>

        {!submitted ? (
          <>
            <div className="mt-8 bg-white/70 backdrop-blur rounded-2xl p-6 max-w-lg mx-auto">
              <p className="text-sm font-semibold text-slate-800 text-center mb-1">
                We&apos;ll create one for you — free.
              </p>
              <p className="text-xs text-slate-500 text-center mb-5">
                Enter your email and we&apos;ll send you a custom llms.txt file
                tailored to your hospital website, ready to upload.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourhospital.org"
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm
                    text-slate-900 placeholder:text-slate-400
                    focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400
                    transition-all"
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting || !email.trim()}
                  className="px-6 py-3 rounded-xl bg-amber-500 text-white font-medium text-sm
                    hover:bg-amber-600 active:scale-[0.98]
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all shadow-sm whitespace-nowrap"
                >
                  {submitting ? "Sending..." : "Send My Free File"}
                </button>
              </form>

              {error && (
                <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
              )}
            </div>

            <p className="mt-4 text-[11px] text-slate-400 text-center">
              No spam, ever. We&apos;ll only email you the llms.txt file and a brief
              explanation of how to install it.
            </p>
          </>
        ) : (
          <div className="mt-8 bg-white/70 backdrop-blur rounded-2xl p-8 max-w-lg mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">You&apos;re all set!</p>
            <p className="mt-2 text-sm text-slate-500">
              We&apos;ll create a custom llms.txt file for{" "}
              <strong>{new URL(data.url).hostname}</strong> and send it to{" "}
              <strong>{email}</strong> within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
