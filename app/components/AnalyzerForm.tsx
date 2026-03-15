"use client";

import { useState } from "react";

interface AnalyzerFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function AnalyzerForm({ onSubmit, isLoading }: AnalyzerFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
        Is your hospital website
        <br />
        <span className="bg-gradient-to-r from-[#F7931E] to-[#ED1C24] bg-clip-text text-transparent">
          ready for AI agents?
        </span>
      </h2>
      <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg mx-auto">
        Enter your website URL and we&apos;ll evaluate how well AI agents can
        understand, navigate, and book appointments on your site.
      </p>

      <form onSubmit={handleSubmit} className="mt-10">
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="www.yourhospital.org"
            className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 bg-white text-base
              text-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
              transition-all shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-medium text-base
              hover:bg-slate-800 active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all shadow-sm"
          >
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Tip: For faster, more specific results paste your Find-a-Doctor page URL directly.
        </p>
      </form>
    </div>
  );
}
