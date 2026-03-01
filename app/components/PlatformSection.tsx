"use client";

import { useEffect, useRef, useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    n: "01",
    tagline: "Contextual Diagnosis",
    headline: "We sync with your real-world data to find where you are invisible.",
    detail: "Our agent cross-references your Google rankings with live LLM synthesis, producing a precision visibility map across every persona, intent, and geography.",
    logs: [
      'Analysis complete: "Enterprise CTO" persona detected.',
      "Search rank: #2 for target keyword. AI visibility: 12%.",
    ],
  },
  {
    n: "02",
    tagline: "Strategic Mapping",
    headline: "The Agent simulates your buyer personas to map their decision paths.",
    detail: "We identify the exact digital spaces (forums, authority sites, editorial media) that AI engines trust for your personas, then map the authority gap to your brand.",
    logs: [
      "Mapping authority sources for CTO Persona... 5 nodes identified.",
      "High-trust citation path: r/devops → Authority.io → Your Brand.",
    ],
  },
  {
    n: "03",
    tagline: "Algorithmic Influence",
    headline: "Content that isn't just written, but engineered for AI synthesis.",
    detail: "The Persona-Optimized Content Agent deploys precisely crafted briefs, calibrated to the semantic patterns AI engines use to surface recommendations.",
    logs: [
      'Deploying Content Agent for "Enterprise CTO" persona...',
      "GEO brief ready. Recommendation Likelihood: 85%.",
    ],
  },
];

const NAV_HEIGHT = 64;

// ─── Phase 01: The Scan ───────────────────────────────────────────────────────

const SCAN_DURATION = 2400; // ms per full pass

function DiagnosisVisual({ active }: { active: boolean }) {
  const [scanY, setScanY] = useState(-20);

  useEffect(() => {
    if (!active) { queueMicrotask(() => setScanY(-20)); return; }
    let frame: number;
    let startTime: number | null = null;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = ((now - startTime) % SCAN_DURATION) / SCAN_DURATION;
      setScanY(10 + progress * 145);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  // Circles: SEO (gray, larger) cx=115 cy=80 r=58 | AI (violet, smaller) cx=185 cy=80 r=40
  // Intersection y-range ≈ AI circle vertical extent: 40 to 120
  const inIntersection = scanY > 40 && scanY < 120;

  return (
    <div>
      <svg width="100%" height="165" viewBox="0 0 300 165">
        <defs>
          <clipPath id="seo-clip-scan">
            <circle cx="115" cy="80" r="58" />
          </clipPath>
        </defs>

        {/* SEO circle */}
        <circle cx="115" cy="80" r="58"
          fill="rgba(0,0,0,0.025)" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
        <text x="90" y="150" fontSize="9" fill="rgba(0,0,0,0.28)"
          fontFamily="system-ui,sans-serif" fontWeight="600">
          Search
        </text>

        {/* AI circle base */}
        <circle cx="185" cy="80" r="40"
          fill="rgba(108,71,255,0.06)" stroke="rgba(108,71,255,0.22)" strokeWidth="1.5" />
        <text x="172" y="128" fontSize="9" fill="rgba(108,71,255,0.5)"
          fontFamily="system-ui,sans-serif" fontWeight="600">
          AI
        </text>

        {/* Intersection fill - clipped to SEO circle, glows when scanner passes */}
        <circle cx="185" cy="80" r="40"
          clipPath="url(#seo-clip-scan)"
          fill={inIntersection ? "rgba(108,71,255,0.35)" : "rgba(108,71,255,0.09)"}
          style={{ transition: "fill 0.09s ease" }}
        />

        {/* Scanner glow (soft halo) */}
        <line x1="18" y1={scanY} x2="282" y2={scanY}
          stroke="rgba(108,71,255,0.12)" strokeWidth="14" />
        {/* Scanner line */}
        <line x1="18" y1={scanY} x2="282" y2={scanY}
          stroke="rgba(108,71,255,0.8)" strokeWidth="1.5" strokeDasharray="5 3" />

        {/* GAP label - visible only during intersection */}
        <text
          x="150" y="77" textAnchor="middle"
          fontSize="7.5" fontFamily="monospace" fontWeight="700" letterSpacing="2"
          fill="rgba(108,71,255,0.95)"
          style={{ opacity: inIntersection ? 1 : 0, transition: "opacity 0.09s" }}
        >
          GAP
        </text>
      </svg>
    </div>
  );
}

// ─── Phase 02: Knowledge Constellation ───────────────────────────────────────

const NODES = [
  { x: 52,  y: 30,  label: "Reddit",    delay: 0 },
  { x: 245, y: 28,  label: "Forums",    delay: 220 },
  { x: 268, y: 102, label: "Authority", delay: 440 },
  { x: 46,  y: 122, label: "Blogs",     delay: 660 },
  { x: 162, y: 148, label: "Media",     delay: 880 },
];
const CENTER = { x: 150, y: 82 };

function MappingVisual({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!active) { queueMicrotask(() => setVisible(0)); return; }
    const timers = NODES.map((n, i) =>
      setTimeout(() => setVisible(i + 1), n.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <div className="h-[168px]">
      <svg width="100%" height="100%" viewBox="0 0 300 168">

        {/* Rays from center */}
        {NODES.map((n, i) => (
          <line key={i}
            x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y}
            stroke="rgba(108,71,255,0.28)" strokeWidth="1"
            style={{ opacity: i < visible ? 1 : 0, transition: "opacity 0.5s ease" }}
          />
        ))}

        {/* Outer nodes */}
        {NODES.map((n, i) => (
          <g key={i} style={{ opacity: i < visible ? 1 : 0, transition: "opacity 0.45s ease" }}>
            {/* Halo */}
            <circle cx={n.x} cy={n.y} r="16"
              fill="rgba(108,71,255,0.04)" stroke="rgba(108,71,255,0.13)" strokeWidth="1" />
            {/* Core dot */}
            <circle cx={n.x} cy={n.y} r="3.5" fill="rgba(108,71,255,0.55)" />
            <text x={n.x} y={n.y + 14}
              textAnchor="middle" fontSize="7" fontFamily="system-ui,sans-serif"
              fontWeight="600" fill="rgba(0,0,0,0.38)">
              {n.label}
            </text>
          </g>
        ))}

        {/* Center node */}
        {/* Outer dashed ring */}
        <circle cx={CENTER.x} cy={CENTER.y} r="34"
          fill="none" stroke="rgba(108,71,255,0.1)" strokeWidth="1" strokeDasharray="3 4" />
        {/* Main circle */}
        <circle cx={CENTER.x} cy={CENTER.y} r="24"
          fill="rgba(108,71,255,0.09)" stroke="rgba(108,71,255,0.38)" strokeWidth="1.5" />
        <text x={CENTER.x} y={CENTER.y - 4} textAnchor="middle"
          fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="800" fill="rgb(108,71,255)">
          PERSONA
        </text>
        <text x={CENTER.x} y={CENTER.y + 7} textAnchor="middle"
          fontSize="6.5" fontFamily="system-ui,sans-serif" fontWeight="600"
          fill="rgba(108,71,255,0.55)">
          CTO
        </text>
      </svg>
    </div>
  );
}

// ─── Phase 03: Ghost UI Editor ────────────────────────────────────────────────

const GHOST_LINES = [
  { pct: 88, accent: true,  delay: 0 },
  { pct: 63, accent: false, delay: 260 },
  { pct: 95, accent: false, delay: 520 },
  { pct: 47, accent: true,  delay: 780 },
  { pct: 76, accent: false, delay: 1040 },
  { pct: 54, accent: false, delay: 1300 },
];

const CYCLING_PARAMS = [
  { label: "Tone",   values: ["Enterprise", "Technical", "Authoritative"], ms: 1900 },
  { label: "Format", values: ["Educational", "Thought Leadership", "Case Study"], ms: 2600 },
];

function InfluenceVisual({ active }: { active: boolean }) {
  const [widths, setWidths] = useState<number[]>(GHOST_LINES.map(() => 0));
  const [tone, setTone]     = useState(0);
  const [format, setFormat] = useState(0);

  useEffect(() => {
    if (!active) {
      queueMicrotask(() => { setWidths(GHOST_LINES.map(() => 0)); setTone(0); setFormat(0); });
      return;
    }

    const lineTimers = GHOST_LINES.map((line, i) =>
      setTimeout(() => setWidths(prev => {
        const next = [...prev]; next[i] = line.pct; return next;
      }), line.delay)
    );

    const t0 = setInterval(() => setTone(v => (v + 1) % CYCLING_PARAMS[0].values.length), CYCLING_PARAMS[0].ms);
    const t1 = setInterval(() => setFormat(v => (v + 1) % CYCLING_PARAMS[1].values.length), CYCLING_PARAMS[1].ms);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(t0); clearInterval(t1);
    };
  }, [active]);

  const pills = [
    { label: "Tone",      value: CYCLING_PARAMS[0].values[tone],   green: false },
    { label: "Format",    value: CYCLING_PARAMS[1].values[format],  green: false },
    { label: "Sentiment", value: "Verified",                        green: true  },
  ];

  return (
    <div className="space-y-4">
      {/* Ghost editor window */}
      <div className="rounded-lg bg-black/[0.03] border border-black/[0.06] px-4 py-3.5">
        <p className="text-[10px] font-mono text-black/18 mb-3.5">{"// geo-content-agent.brief"}</p>
        <div className="space-y-2.5">
          {GHOST_LINES.map((line, i) => (
            <div key={i} className="h-[7px] rounded-full bg-black/[0.05] overflow-hidden">
              <div
                style={{
                  height: "100%",
                  width: `${widths[i]}%`,
                  borderRadius: "9999px",
                  background: line.accent
                    ? "rgba(108,71,255,0.22)"
                    : "rgba(0,0,0,0.09)",
                  boxShadow: line.accent && widths[i] > 0
                    ? "0 0 7px rgba(108,71,255,0.22)"
                    : "none",
                  transition: "width 700ms cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Parameter pills */}
      <div className="flex flex-wrap gap-2">
        {pills.map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{ background: "rgba(108,71,255,0.06)", borderColor: "rgba(108,71,255,0.18)" }}
          >
            <span className="text-[9px] font-medium text-black/30">{p.label}:</span>
            <span
              className="text-[10px] font-bold"
              style={{ color: p.green ? "#22c55e" : "rgb(108,71,255)" }}
            >
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function PlatformSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [displayedPhase, setDisplayedPhase] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const phase = Math.max(
        0,
        Math.min(PHASES.length - 1, Math.floor(-rect.top / window.innerHeight))
      );
      setActivePhase(phase);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setIsTransitioning(true));
    const t = setTimeout(() => {
      setDisplayedPhase(activePhase);
      setIsTransitioning(false);
    }, 180);
    return () => clearTimeout(t);
  }, [activePhase]);

  const phase = PHASES[displayedPhase];

  return (
    <section
      ref={sectionRef}
      id="platform"
      className="section-lines scroll-section"
      style={{ height: `${PHASES.length * 100}vh` }}
    >
      <div
        className="lg:sticky flex items-center"
        style={{ top: NAV_HEIGHT, height: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        <div className="w-full mx-auto max-w-[1100px] px-4 sm:px-6">

          {/* Mobile phase selector */}
          <div className="flex gap-2 mb-6 lg:hidden">
            {PHASES.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: displayedPhase === i ? "rgba(108,71,255,0.08)" : "transparent",
                  color: displayedPhase === i ? "rgb(108,71,255)" : "rgba(0,0,0,0.3)",
                  border: displayedPhase === i ? "1px solid rgba(108,71,255,0.2)" : "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {p.tagline}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-center">

            {/* Left: copy */}
            <div
              className="transition-all duration-200"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? "translateY(6px)" : "translateY(0)",
              }}
            >
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-6">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                Phase {phase.n}: {phase.tagline}
              </div>

              <h2 className="text-3xl md:text-[36px] font-bold leading-tight tracking-[-0.02em] mb-5">
                {phase.headline}
              </h2>
              <p className="text-base text-black/60 leading-relaxed mb-10">
                {phase.detail}
              </p>

              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {PHASES.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: i === displayedPhase ? 20 : 8,
                      height: 8,
                      background: i === displayedPhase ? "rgb(108,71,255)" : "rgba(0,0,0,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right: agent window */}
            <div className="rounded-2xl overflow-hidden border border-black/[0.07] shadow-[0_8px_48px_rgba(0,0,0,0.07)] bg-white">

              {/* Window chrome */}
              <div className="px-4 py-3 flex items-center gap-2 border-b border-black/[0.05] bg-black/[0.015]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[11px] font-mono text-black/25">
                  refinea-agent: {phase.tagline.toLowerCase()}
                </span>
              </div>

              {/* Visual area */}
              <div
                className="px-6 pt-5 pb-4 min-h-[230px] transition-all duration-200"
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? "translateY(4px)" : "translateY(0)",
                }}
              >
                {displayedPhase === 0 && <DiagnosisVisual active={!isTransitioning} />}
                {displayedPhase === 1 && <MappingVisual   active={!isTransitioning} />}
                {displayedPhase === 2 && <InfluenceVisual active={!isTransitioning} />}
              </div>

              {/* System log */}
              <div className="border-t border-black/[0.05] bg-[#0d0d0d] px-4 py-3">
                <div
                  className="transition-opacity duration-200"
                  style={{ opacity: isTransitioning ? 0 : 1 }}
                >
                  {phase.logs.map((log, i) => (
                    <p
                      key={i}
                      className="text-[10px] font-mono leading-relaxed"
                      style={{ color: i === 0 ? "rgba(108,71,255,0.85)" : "rgba(255,255,255,0.3)" }}
                    >
                      <span style={{ color: "rgba(255,255,255,0.2)" }}>▶ </span>{log}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
