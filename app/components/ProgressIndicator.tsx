"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { label: "Semantic Richness", desc: "Checking structured data & metadata" },
  { label: "Actionability Surface", desc: "Evaluating booking & conversion paths" },
  { label: "DOM Navigability", desc: "Testing accessibility & agent navigation" },
  { label: "Integration Readiness", desc: "Probing APIs & machine interfaces" },
];

interface ProgressIndicatorProps {
  isComplete: boolean;
}

export default function ProgressIndicator({ isComplete }: ProgressIndicatorProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (isComplete) {
      setActiveStep(4);
      return;
    }
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, [isComplete]);

  return (
    <div className="max-w-md mx-auto mt-16 animate-fade-in-up">
      <div className="space-y-4">
        {STEPS.map((step, i) => {
          const isDone = isComplete || i < activeStep;
          const isActive = !isComplete && i === activeStep;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500
                ${isActive ? "bg-white shadow-md" : isDone ? "bg-white/60" : "bg-transparent"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-500
                  ${isDone ? "bg-green-500 text-white" : isActive ? "bg-blue-500 text-white animate-pulse" : "bg-slate-200 text-slate-400"}`}
              >
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isDone || isActive ? "text-slate-900" : "text-slate-400"}`}>
                  {step.label}
                </p>
                <p className={`text-xs ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
