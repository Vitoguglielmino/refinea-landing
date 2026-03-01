"use client";

import { useEffect, useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Audit Contextual Gaps",
    badge: "SCANNING",
    action: "Cross-referencing Google rankings with real-time LLM synthesis.",
    output: "Identifies where you are visible on Search but invisible in AI conversations.",
    log: '[STATUS] Analyzing Gemini response for "CTO Persona"... GAP DETECTED',
  },
  {
    n: "02",
    title: "Persona Decision Mapping",
    badge: "MAPPING",
    action: "Simulating decision paths for your specific buyer personas.",
    output: "Reveals why AI agents divert high-value leads to your competitors.",
    log: '[STATUS] Simulating ChatGPT path for "scaling startup"... DIVERSION FOUND',
  },
  {
    n: "03",
    title: "Algorithmic Influence Strategy",
    badge: "OPTIMIZING",
    action: "Positioning your brand inside the precise digital spaces AI engines trust.",
    output: "Closing the loop to ensure your brand is the final AI recommendation.",
    log: '[STATUS] Injecting authority signal for "Persona: CFO, Intent: Purchase"... COMPLETE',
  },
];

const STEP_DURATION = 6500;

// ─── Section ──────────────────────────────────────────────────────────────────

export default function AgentPipelineSection() {
  const [activeStep,  setActiveStep]  = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Auto-cycle (continues in background even while hovering)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % STEPS.length);
    }, STEP_DURATION);
    return () => clearInterval(timer);
  }, []);

  // Hover overrides the auto-cycle visually
  const displayedStep = hoveredStep ?? activeStep;

  return (
    <section className="section-lines py-24 md:py-28 bg-white">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-10 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
              Refinea Agent Workflow
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-[40px] font-bold leading-tight tracking-[-0.02em]">
              Personas built from behavior,
              <br />
              not assumptions.
            </h2>
          </div>
          <p className="text-lg text-black/70 leading-relaxed">
            Our AI agent continuously synthesizes your real user data (GA4,
            Search Console, behavioral clusters) and maps the exact gaps where
            your brand disappears in AI-native search.
          </p>
        </div>

        {/* Pipeline */}
        <div className="max-w-2xl mx-auto relative">

          {/* Vertical connector line */}
          <div className="absolute left-[14px] top-3 bottom-3 w-px bg-black/[0.06]" />

          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const isActive = i === displayedStep;
              const isDone   = i < displayedStep;

              return (
                <div
                  key={step.n}
                  className="relative pl-12 pb-10 last:pb-0 cursor-default"
                  onMouseEnter={() => setHoveredStep(i)}
                  onMouseLeave={() => setHoveredStep(null)}
                >

                  {/* Pulsing dot */}
                  <div className="absolute left-0 top-1 w-[28px] h-[28px] flex items-center justify-center overflow-hidden">
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
                    )}
                    <div
                      className="w-3 h-3 rounded-full transition-all duration-500 relative z-10"
                      style={{
                        background: isActive
                          ? "rgb(108,71,255)"
                          : isDone
                          ? "rgba(108,71,255,0.25)"
                          : "rgba(0,0,0,0.1)",
                        boxShadow: isActive
                          ? "0 0 16px rgba(108,71,255,0.6)"
                          : "none",
                      }}
                    />
                  </div>

                  {/* Row: title + badge */}
                  <div className="flex items-center justify-between gap-4 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-bold text-black/20 tracking-[0.08em] tabular-nums">
                        {step.n}
                      </span>
                      <h3
                        className="text-base font-semibold leading-snug transition-colors duration-500"
                        style={{ color: isActive ? "#000" : "rgba(0,0,0,0.4)" }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {/* Status badge */}
                    <span
                      className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border shrink-0 transition-all duration-500"
                      style={{
                        color: isActive ? "rgb(108,71,255)" : "rgba(0,0,0,0.18)",
                        background: isActive ? "rgba(108,71,255,0.07)" : "transparent",
                        borderColor: isActive
                          ? "rgba(108,71,255,0.28)"
                          : "rgba(0,0,0,0.07)",
                      }}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                      )}
                      {step.badge}
                    </span>
                  </div>

                  {/* Body */}
                  <div
                    className="transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0.3 }}
                  >
                    <p className="text-sm text-black/55 leading-relaxed mb-1">
                      <span className="font-semibold text-black/75">Agent Action:</span>{" "}
                      {step.action}
                    </p>
                    <p className="text-sm text-black/55 leading-relaxed">
                      <span className="font-semibold text-black/75">Output:</span>{" "}
                      {step.output}
                    </p>

                    {/* Terminal log - always in layout, opacity-only to avoid reflow */}
                    <div className="mt-3 rounded-xl bg-[#0d0d0d] transition-opacity duration-500"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      <div className="px-4 pt-3 pb-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                          <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
                          <div className="w-2 h-2 rounded-full bg-[#28c840]" />
                        </div>
                        <p className="text-[11px] font-mono leading-relaxed overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ color: "rgba(108,71,255,0.9)" }}>
                          <span style={{ color: "rgba(255,255,255,0.25)" }}>▶ </span>
                          {step.log}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Loop footer */}
        <div className="mt-20 md:mt-24 flex flex-col items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Rotating dashed ring */}
            <div
              className="absolute inset-0 rounded-full border border-dashed border-accent/25"
              style={{ animation: "spin 9s linear infinite" }}
            />
            {/* Inner orb */}
            <div className="w-9 h-9 rounded-full bg-accent/[0.07] border border-accent/[0.18] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8C3 5.2 5.2 3 8 3C9.6 3 11 3.8 11.9 5"
                  stroke="rgb(108,71,255)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M13 8C13 10.8 10.8 13 8 13C6.4 13 5 12.2 4.1 11"
                  stroke="rgb(108,71,255)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M11.5 3.5L11.9 5L10.5 5.4"
                  stroke="rgb(108,71,255)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.5 12.5L4.1 11L5.5 10.6"
                  stroke="rgb(108,71,255)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium text-black/35 tracking-wide">
            Continuous learning. Zero guesswork.
          </p>
        </div>

      </div>
    </section>
  );
}
