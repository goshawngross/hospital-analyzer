"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    label: "Semantic Richness",
    substeps: [
      "Scanning for JSON-LD structured data...",
      "Checking Schema.org healthcare types...",
      "Evaluating OpenGraph & meta tags...",
      "Analyzing heading hierarchy...",
    ],
  },
  {
    label: "Actionability Surface",
    substeps: [
      "Identifying booking & scheduling CTAs...",
      "Detecting phone-only friction points...",
      "Checking for patient portal login walls...",
      "Evaluating digital conversion paths...",
    ],
  },
  {
    label: "DOM Navigability",
    substeps: [
      "Testing ARIA labels on interactive elements...",
      "Scanning for CAPTCHA barriers...",
      "Checking server-rendered content...",
      "Evaluating semantic HTML structure...",
    ],
  },
  {
    label: "Integration Readiness",
    substeps: [
      "Probing for AI plugin manifest...",
      "Checking robots.txt for AI directives...",
      "Scanning for FHIR API endpoints...",
      "Looking for OpenAPI specifications...",
    ],
  },
];

interface ProgressIndicatorProps {
  isComplete: boolean;
}

export default function ProgressIndicator({ isComplete }: ProgressIndicatorProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [activeSubstep, setActiveSubstep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    if (allDone) return;

    // Each pillar takes ~3.5 seconds (4 substeps × ~875ms)
    // Total: ~14-15 seconds for all 4 pillars
    const timer = setInterval(() => {
      setActiveSubstep((prevSub) => {
        const maxSub = STEPS[activeStep]?.substeps.length ?? 4;
        if (prevSub < maxSub - 1) {
          return prevSub + 1;
        } else {
          // This substep cycle is done — mark step complete and move on
          setCompletedSteps((prev) => [...prev, activeStep]);
          setActiveStep((prevStep) => {
            if (prevStep < STEPS.length - 1) {
              return prevStep + 1;
            } else {
              setAllDone(true);
              return prevStep;
            }
          });
          return 0;
        }
      });
    }, 875);

    return () => clearInterval(timer);
  }, [activeStep, allDone]);

  // When truly complete (API done + animation done), show all green
  const showAllComplete = isComplete && allDone;

  return (
    <div className="max-w-md mx-auto mt-16 animate-fade-in-up">
      <div className="space-y-4">
        {STEPS.map((step, i) => {
          const isDone = showAllComplete || completedSteps.includes(i);
          const isActive = !showAllComplete && i === activeStep && !allDone;
          const isPending = !isDone && !isActive;

          return (
            <div
              key={step.label}
              className={`px-5 py-4 rounded-2xl transition-all duration-500
                ${isActive ? "bg-white shadow-md" : isDone ? "bg-white/60" : "bg-transparent"}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0
                    transition-all duration-500
                    ${isDone ? "bg-green-500 text-white" : isActive ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-400"}`}
                >
                  {isDone ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isActive ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone || isActive ? "text-slate-900" : "text-slate-400"}`}>
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-blue-500 mt-1 truncate transition-all duration-300">
                      {step.substeps[activeSubstep]}
                    </p>
                  )}
                  {isDone && (
                    <p className="text-xs text-green-600 mt-0.5">Complete</p>
                  )}
                  {isPending && (
                    <p className="text-xs text-slate-400 mt-0.5">Waiting...</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Elapsed time */}
      <ElapsedTimer isRunning={!showAllComplete} />
    </div>
  );
}

function ElapsedTimer({ isRunning }: { isRunning: boolean }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <p className="text-center text-xs text-slate-400 mt-8">
      {isRunning
        ? `Analyzing... ${seconds}s`
        : `Analysis complete in ${seconds}s`}
    </p>
  );
}
