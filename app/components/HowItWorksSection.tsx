"use client";

import { useEffect, useRef, useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    n: "01",
    tagline: "Contextual Diagnosis",
    headline: "We sync with your real-world data to find where you are invisible.",
    flow: "The agent cross-references your GSC/GA4 data with live LLM responses to pinpoint where your SEO doesn't convert into AI recommendations.",
  },
  {
    n: "02",
    tagline: "Strategic Mapping",
    headline: "Mapping the authority sources AI engines trust.",
    flow: "We identify the digital nodes where your brand must appear to influence decisions at the moment they form, not after the fact.",
  },
  {
    n: "03",
    tagline: "Algorithmic Influence",
    headline: "Engineering decisions, not just rankings.",
    flow: "Our agent generates content optimized to be synthesized by AI, ensuring your brand isn't just listed: it's chosen.",
  },
];

const NAV_HEIGHT = 64;

// ─── Phase visuals ─────────────────────────────────────────────────────────────

function DiagnosisVisual({ active }: { active: boolean }) {
  const [scanY, setScanY] = useState(-20);

  useEffect(() => {
    if (!active) { queueMicrotask(() => setScanY(-20)); return; }
    let frame: number;
    let startTime: number | null = null;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const progress = ((now - startTime) % 2400) / 2400;
      setScanY(10 + progress * 145);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const inIntersection = scanY > 40 && scanY < 120;

  return (
    <svg width="100%" height="170" viewBox="0 0 300 170">
      <defs>
        <clipPath id="hiw-seo-clip">
          <circle cx="115" cy="85" r="58" />
        </clipPath>
      </defs>
      <circle cx="115" cy="85" r="58" fill="rgba(0,0,0,0.025)" stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
      <text x="90" y="155" fontSize="9" fill="rgba(0,0,0,0.25)" fontFamily="system-ui,sans-serif" fontWeight="600">Search</text>
      <circle cx="185" cy="85" r="40" fill="rgba(108,71,255,0.06)" stroke="rgba(108,71,255,0.2)" strokeWidth="1.5" />
      <text x="172" y="132" fontSize="9" fill="rgba(108,71,255,0.45)" fontFamily="system-ui,sans-serif" fontWeight="600">AI</text>
      <circle cx="185" cy="85" r="40"
        clipPath="url(#hiw-seo-clip)"
        fill={inIntersection ? "rgba(108,71,255,0.32)" : "rgba(108,71,255,0.08)"}
        style={{ transition: "fill 0.09s ease" }}
      />
      <line x1="18" y1={scanY} x2="282" y2={scanY} stroke="rgba(108,71,255,0.12)" strokeWidth="14" />
      <line x1="18" y1={scanY} x2="282" y2={scanY} stroke="rgba(108,71,255,0.8)" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x="150" y="82" textAnchor="middle" fontSize="7.5" fontFamily="monospace" fontWeight="700" letterSpacing="2" fill="rgba(108,71,255,0.95)"
        style={{ opacity: inIntersection ? 1 : 0, transition: "opacity 0.09s" }}>
        GAP
      </text>
    </svg>
  );
}

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
    const timers = NODES.map((n, i) => setTimeout(() => setVisible(i + 1), n.delay));
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <svg width="100%" height="170" viewBox="0 0 300 170">
      {NODES.map((n, i) => (
        <line key={i}
          x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y}
          stroke="rgba(108,71,255,0.25)" strokeWidth="1"
          style={{ opacity: i < visible ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
      ))}
      {NODES.map((n, i) => (
        <g key={i} style={{ opacity: i < visible ? 1 : 0, transition: "opacity 0.45s ease" }}>
          <circle cx={n.x} cy={n.y} r="15" fill="rgba(108,71,255,0.04)" stroke="rgba(108,71,255,0.12)" strokeWidth="1" />
          <circle cx={n.x} cy={n.y} r="3.5" fill="rgba(108,71,255,0.5)" />
          <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="600" fill="rgba(0,0,0,0.35)">
            {n.label}
          </text>
        </g>
      ))}
      <circle cx={CENTER.x} cy={CENTER.y} r="34" fill="none" stroke="rgba(108,71,255,0.1)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx={CENTER.x} cy={CENTER.y} r="24" fill="rgba(108,71,255,0.09)" stroke="rgba(108,71,255,0.38)" strokeWidth="1.5" />
      <text x={CENTER.x} y={CENTER.y - 4} textAnchor="middle" fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="800" fill="rgb(108,71,255)">PERSONA</text>
      <text x={CENTER.x} y={CENTER.y + 7} textAnchor="middle" fontSize="6.5" fontFamily="system-ui,sans-serif" fontWeight="600" fill="rgba(108,71,255,0.55)">CTO</text>
    </svg>
  );
}

const GHOST_LINES = [
  { pct: 88, accent: true,  delay: 0 },
  { pct: 63, accent: false, delay: 260 },
  { pct: 95, accent: false, delay: 520 },
  { pct: 47, accent: true,  delay: 780 },
  { pct: 76, accent: false, delay: 1040 },
  { pct: 54, accent: false, delay: 1300 },
];
const CYCLING = [
  { label: "Tone",      values: ["Enterprise", "Technical", "Authoritative"], ms: 1900 },
  { label: "Format",    values: ["Educational", "Thought Leadership", "Case Study"], ms: 2600 },
];

function InfluenceVisual({ active }: { active: boolean }) {
  const [widths, setWidths]   = useState<number[]>(GHOST_LINES.map(() => 0));
  const [tone, setTone]       = useState(0);
  const [format, setFormat]   = useState(0);

  useEffect(() => {
    if (!active) { queueMicrotask(() => { setWidths(GHOST_LINES.map(() => 0)); setTone(0); setFormat(0); }); return; }
    const lt = GHOST_LINES.map((l, i) =>
      setTimeout(() => setWidths(prev => { const n = [...prev]; n[i] = l.pct; return n; }), l.delay)
    );
    const t0 = setInterval(() => setTone(v => (v + 1) % CYCLING[0].values.length), CYCLING[0].ms);
    const t1 = setInterval(() => setFormat(v => (v + 1) % CYCLING[1].values.length), CYCLING[1].ms);
    return () => { lt.forEach(clearTimeout); clearInterval(t0); clearInterval(t1); };
  }, [active]);

  const pills = [
    { label: "Sentiment",  value: "Positive",                  green: true  },
    { label: "Tone",       value: CYCLING[0].values[tone],     green: false },
    { label: "Format",     value: CYCLING[1].values[format],   green: false },
  ];

  return (
    <div className="space-y-4 w-full max-w-[300px]">
      <div className="rounded-lg bg-black/[0.03] border border-black/[0.06] px-4 py-3.5">
        <p className="text-[10px] font-mono text-black/18 mb-3.5">{"// geo-content-agent.brief"}</p>
        <div className="space-y-2.5">
          {GHOST_LINES.map((l, i) => (
            <div key={i} className="h-[7px] rounded-full bg-black/[0.05] overflow-hidden">
              <div style={{
                height: "100%", width: `${widths[i]}%`, borderRadius: "9999px",
                background: l.accent ? "rgba(108,71,255,0.22)" : "rgba(0,0,0,0.09)",
                boxShadow: l.accent && widths[i] > 0 ? "0 0 7px rgba(108,71,255,0.22)" : "none",
                transition: "width 700ms cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {pills.map(p => (
          <div key={p.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{ background: "rgba(108,71,255,0.06)", borderColor: "rgba(108,71,255,0.18)" }}>
            <span className="text-[9px] font-medium text-black/30">{p.label}:</span>
            <span className="text-[10px] font-bold" style={{ color: p.green ? "#22c55e" : "rgb(108,71,255)" }}>
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function TimelineGlow({ scrollProgress, displayedPhase }: { scrollProgress: number; displayedPhase: number }) {
  const L1 = 40; const L2 = 760; const LY = 20;
  const nodes = [L1, (L1 + L2) / 2, L2];
  const pulseX = L1 + scrollProgress * (L2 - L1);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6">
      <svg width="100%" height="52" viewBox="0 0 800 52">
        {/* Base line */}
        <line x1={L1} y1={LY} x2={L2} y2={LY} stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
        {/* Filled glow line */}
        <line x1={L1} y1={LY} x2={pulseX} y2={LY} stroke="rgba(108,71,255,0.3)" strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 3px rgba(108,71,255,0.45))" }} />
        {/* Phase nodes */}
        {nodes.map((nx, i) => {
          const isActive = i === displayedPhase;
          const isPast   = i < displayedPhase;
          return (
            <g key={i}>
              {isActive && <circle cx={nx} cy={LY} r="11" fill="rgba(108,71,255,0.1)" />}
              <circle cx={nx} cy={LY} r={isActive ? 6 : 4}
                fill={isActive ? "rgb(108,71,255)" : isPast ? "rgba(108,71,255,0.4)" : "rgba(0,0,0,0.12)"}
                style={{ filter: isActive ? "drop-shadow(0 0 6px rgba(108,71,255,0.7))" : "none",
                  transition: "fill 0.4s, r 0.4s" }}
              />
              <text x={nx} y={42} textAnchor="middle" fontSize="9.5"
                fill={isActive ? "rgb(108,71,255)" : "rgba(0,0,0,0.25)"}
                fontFamily="system-ui,sans-serif" fontWeight={isActive ? "700" : "500"}
                style={{ transition: "fill 0.4s" }}>
                {PHASES[i].tagline}
              </text>
            </g>
          );
        })}
        {/* Traveling pulse dot */}
        <circle cx={pulseX} cy={LY} r="4.5" fill="rgb(108,71,255)"
          style={{ filter: "drop-shadow(0 0 8px rgba(108,71,255,0.9)) drop-shadow(0 0 2px rgba(108,71,255,1))" }} />
      </svg>
    </div>
  );
}

// ─── Micro-log ────────────────────────────────────────────────────────────────

const ALL_LOGS = [
  '> Analyzing Persona: "Tech Lead"',
  "> Cross-referencing GA4 behavior patterns...",
  "> SEO/GEO Gap detected: 64%",
  "> Mapping authority sources for CTO Persona...",
  "> High-trust path: r/devops → Authority.io",
  "> Injecting authority signal... COMPLETE",
  '> Content brief deployed. Rec. Likelihood: 85%',
  "> Monitoring AI synthesis coverage...",
  '> New persona cluster detected: "VP Engineering"',
];

function MicroLog() {
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStartIdx(i => i + 1), 1700);
    return () => clearInterval(t);
  }, []);

  const lines = [0, 1, 2, 3].map(offset => ALL_LOGS[(startIdx + offset) % ALL_LOGS.length]);

  return (
    <div className="rounded-xl bg-[#0d0d0d] px-4 py-3">
      <div className="flex items-center gap-1.5 mb-2.5">
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="ml-1 text-[9px] font-mono text-white/15">refinea-agent · live</span>
      </div>
      {lines.map((log, i) => (
        <p key={i} className="text-[10px] font-mono leading-relaxed"
          style={{
            color: i === 3
              ? "rgba(108,71,255,0.9)"
              : `rgba(255,255,255,${0.12 + i * 0.09})`,
            transition: "color 0.3s",
          }}>
          {log}
        </p>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function HowItWorksSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [activePhase,    setActivePhase]    = useState(0);
  const [displayedPhase, setDisplayedPhase] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress,  setScrollProgress]  = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const phase = Math.max(0, Math.min(PHASES.length - 1, Math.floor(-rect.top / window.innerHeight)));
      setActivePhase(phase);
      // scrollProgress 0→1 spans the full scrollable range of this section
      const totalScrollable = (PHASES.length - 1) * window.innerHeight;
      setScrollProgress(Math.max(0, Math.min(1, -rect.top / totalScrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => setIsTransitioning(true));
    const t = setTimeout(() => { setDisplayedPhase(activePhase); setIsTransitioning(false); }, 180);
    return () => clearTimeout(t);
  }, [activePhase]);

  const phase = PHASES[displayedPhase];

  return (
    <section
      ref={sectionRef}
      id="how"
      className="section-lines scroll-section"
      style={{ height: `${PHASES.length * 100}vh` }}
    >
      <div
        className="lg:sticky flex flex-col"
        style={{ top: NAV_HEIGHT, height: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        {/* Section header */}
        <div className="pt-6 pb-2 mx-auto w-full max-w-[1100px] px-4 sm:px-6 flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full">
            <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
            How it works
          </div>
          <h2 className="text-xl font-bold tracking-[-0.02em] text-black">
            Measure.<span className="text-black/25"> Optimize. Monitor.</span>
          </h2>
        </div>

        {/* Timeline - hidden on mobile (unreadable at small widths) */}
        <div className="py-2 hidden lg:block">
          <TimelineGlow scrollProgress={scrollProgress} displayedPhase={displayedPhase} />
        </div>

        {/* Mobile phase selector */}
        <div className="flex gap-2 mx-auto w-full max-w-[1100px] px-4 sm:px-6 pb-4 lg:hidden">
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

        {/* Main content */}
        <div className="flex-1 mx-auto w-full max-w-[1100px] px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-10 items-center overflow-hidden">

          {/* Left: visualization */}
          <div
            className="rounded-[28px] bg-black/[0.02] border border-black/[0.05] flex items-center justify-center p-8 transition-all duration-200"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? "scale(0.98)" : "scale(1)",
              minHeight: 240,
            }}
          >
            {displayedPhase === 0 && <DiagnosisVisual active={!isTransitioning} />}
            {displayedPhase === 1 && <MappingVisual   active={!isTransitioning} />}
            {displayedPhase === 2 && <InfluenceVisual active={!isTransitioning} />}
          </div>

          {/* Right: copy + micro-log */}
          <div className="flex flex-col gap-6">

            {/* Phase copy */}
            <div
              className="transition-all duration-200"
              style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(6px)" : "translateY(0)" }}
            >
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3 py-1 rounded-full mb-4">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                Phase {phase.n}
              </div>

              <h3 className="text-2xl md:text-[26px] font-bold leading-tight tracking-[-0.02em] mb-4">
                {phase.headline}
              </h3>

              <div className="pl-3 border-l-2 border-accent/[0.3]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-black/35 mb-1">Agent Flow</p>
                <p className="text-sm text-black/60 leading-relaxed">
                  {phase.flow}
                </p>
              </div>
            </div>

            {/* Micro-log terminal */}
            <MicroLog />

          </div>
        </div>
      </div>
    </section>
  );
}
