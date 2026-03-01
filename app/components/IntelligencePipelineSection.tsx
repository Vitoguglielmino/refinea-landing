"use client";

import { useEffect, useRef, useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PHASES = [
  {
    n: "01",
    tagline: "Behavioral Synthesis",
    method: "We connect directly to your GA4 and Search Console to stop relying on marketing assumptions.",
    agent: "The agent processes your real traffic to build dynamic Buyer Personas segmented by intent, language, geography, and demographics.",
    featureLabel: "Persona Modeling",
    featureDesc: "We transform your data into Digital Twins of your real market segments.",
  },
  {
    n: "02",
    tagline: "Generative Discovery Audit",
    method: "We simulate the actual conversations your customers are having with AI models.",
    agent: "Our agent queries ChatGPT, Perplexity, Gemini, Claude, and Grok using the exact questions identified in Phase 01.",
    featureLabel: "The SEO → GEO Gap",
    featureDesc: "We pinpoint exactly where you rank on Google but disappear in AI answers, identifying your hidden ROI leakage.",
  },
  {
    n: "03",
    tagline: "Strategic Authority Mapping",
    method: "We analyze why AI models choose specific brands over others.",
    agent: "The agent monitors Visibility Scores, brand sentiment, and identifies Authority Hubs (Reddit threads, niche forums, media channels) that train AI models to trust you.",
    featureLabel: "Actionable Insights",
    featureDesc: "Precise strategic commands: \"Join this Subreddit to increase citation probability for CFOs in ChatGPT\".",
  },
  {
    n: "04",
    tagline: "Content & Loop Optimization",
    method: "We create a continuous learning loop where every insight improves the next.",
    agent: "Our GEO-Compliant Content Agent crafts blog posts engineered for AI synthesis, fully customizable for the specific market segment you want to penetrate.",
    featureLabel: "Longitudinal Intelligence",
    featureDesc: "We monitor visibility trends over time, ensuring your brand stays at the core of AI-native discovery.",
  },
];

const PHASE_DURATION = 5000;

// ─── Phase 01: Behavioral Synthesis ──────────────────────────────────────────

function Phase01Visual({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) { queueMicrotask(() => setStep(0)); return; }
    const ts = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 650),
      setTimeout(() => setStep(3), 1050),
      setTimeout(() => setStep(4), 1350),
      setTimeout(() => setStep(5), 1650),
    ];
    return () => ts.forEach(clearTimeout);
  }, [active]);

  return (
    <svg width="100%" height="170" viewBox="0 0 310 170">
      <path d="M 70 62 Q 115 62 140 82" stroke="rgba(108,71,255,0.22)" fill="none" strokeWidth="1"
        style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.5s" }} />
      <path d="M 70 108 Q 115 108 140 98" stroke="rgba(108,71,255,0.22)" fill="none" strokeWidth="1"
        style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.5s" }} />
      <path d="M 170 90 Q 202 55 230 48" stroke="rgba(108,71,255,0.18)" fill="none" strokeWidth="1"
        style={{ opacity: step >= 3 ? 1 : 0, transition: "opacity 0.5s" }} />
      <path d="M 170 90 L 230 90" stroke="rgba(108,71,255,0.18)" fill="none" strokeWidth="1"
        style={{ opacity: step >= 4 ? 1 : 0, transition: "opacity 0.5s" }} />
      <path d="M 170 90 Q 202 125 230 132" stroke="rgba(108,71,255,0.18)" fill="none" strokeWidth="1"
        style={{ opacity: step >= 5 ? 1 : 0, transition: "opacity 0.5s" }} />

      <g style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 0.4s" }}>
        <circle cx="50" cy="62" r="18" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
        <text x="50" y="59" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,sans-serif" fontWeight="700" fill="rgba(0,0,0,0.5)">Your</text>
        <text x="50" y="69" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,sans-serif" fontWeight="700" fill="rgba(0,0,0,0.5)">Real</text>
      </g>
      <g style={{ opacity: step >= 1 ? 1 : 0, transition: "opacity 0.4s 0.1s" }}>
        <circle cx="50" cy="108" r="18" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        <text x="50" y="105" textAnchor="middle" fontSize="7.5" fontFamily="system-ui,sans-serif" fontWeight="700" fill="rgba(0,0,0,0.5)">Data</text>
        <text x="50" y="115" textAnchor="middle" fontSize="6" fontFamily="system-ui,sans-serif" fontWeight="500" fill="rgba(0,0,0,0.3)">sources</text>
      </g>

      <g style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 0.4s" }}>
        <circle cx="155" cy="90" r="18" fill="rgba(108,71,255,0.1)" stroke="rgba(108,71,255,0.4)" strokeWidth="1.5" />
        <text x="155" y="87" textAnchor="middle" fontSize="6.5" fontFamily="system-ui,sans-serif" fontWeight="800" fill="rgb(108,71,255)">AGENT</text>
        <text x="155" y="97" textAnchor="middle" fontSize="6" fontFamily="system-ui,sans-serif" fontWeight="600" fill="rgba(108,71,255,0.6)">PROCESS</text>
      </g>

      <g style={{ opacity: step >= 3 ? 1 : 0, transition: "opacity 0.4s" }}>
        <rect x="230" y="30" width="68" height="28" rx="7" fill="rgba(108,71,255,0.09)" stroke="rgba(108,71,255,0.28)" strokeWidth="1" />
        <text x="264" y="43" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" fill="rgb(108,71,255)">CTO</text>
        <text x="264" y="52" textAnchor="middle" fontSize="6.5" fontFamily="system-ui,sans-serif" fontWeight="500" fill="rgba(0,0,0,0.38)">Enterprise</text>
      </g>
      <g style={{ opacity: step >= 4 ? 1 : 0, transition: "opacity 0.4s" }}>
        <rect x="230" y="74" width="68" height="28" rx="7" fill="rgba(108,71,255,0.06)" stroke="rgba(108,71,255,0.2)" strokeWidth="1" />
        <text x="264" y="87" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" fill="rgb(108,71,255)">Founder</text>
        <text x="264" y="96" textAnchor="middle" fontSize="6.5" fontFamily="system-ui,sans-serif" fontWeight="500" fill="rgba(0,0,0,0.38)">Growth</text>
      </g>
      <g style={{ opacity: step >= 5 ? 1 : 0, transition: "opacity 0.4s" }}>
        <rect x="230" y="118" width="68" height="28" rx="7" fill="rgba(108,71,255,0.06)" stroke="rgba(108,71,255,0.2)" strokeWidth="1" />
        <text x="264" y="131" textAnchor="middle" fontSize="9" fontFamily="system-ui,sans-serif" fontWeight="700" fill="rgb(108,71,255)">SMB</text>
        <text x="264" y="140" textAnchor="middle" fontSize="6.5" fontFamily="system-ui,sans-serif" fontWeight="500" fill="rgba(0,0,0,0.38)">Scale-up</text>
      </g>
    </svg>
  );
}

// ─── Phase 02: Generative Discovery Audit ─────────────────────────────────────

const AI_MODELS = ["ChatGPT", "Perplexity", "Gemini", "Claude", "Grok"];
const AUDIT_QUERY = "Best SaaS for scaling infrastructure?";

function Phase02Visual({ active }: { active: boolean }) {
  const [modelsVisible, setModelsVisible] = useState(0);
  const [queryChars, setQueryChars]       = useState(0);
  const [showGap, setShowGap]             = useState(false);

  useEffect(() => {
    if (!active) { queueMicrotask(() => { setModelsVisible(0); setQueryChars(0); setShowGap(false); }); return; }
    AI_MODELS.forEach((_, i) => setTimeout(() => setModelsVisible(i + 1), 100 + i * 140));
    let q = 0;
    const interval = setInterval(() => {
      q = Math.min(q + 3, AUDIT_QUERY.length);
      setQueryChars(q);
      if (q >= AUDIT_QUERY.length) {
        clearInterval(interval);
        setTimeout(() => setShowGap(true), 400);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-wrap gap-1.5">
        {AI_MODELS.map((m, i) => (
          <span key={m} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-300"
            style={{
              opacity: i < modelsVisible ? 1 : 0,
              background: "rgba(108,71,255,0.07)",
              borderColor: "rgba(108,71,255,0.22)",
              color: "rgb(108,71,255)",
            }}>
            {m}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-black/[0.03] border border-black/[0.07] rounded-lg px-3 py-2">
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="shrink-0">
          <circle cx="5.5" cy="5.5" r="4.5" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" />
          <path d="M9.5 9.5L13 13" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[11px] text-black/65 font-medium flex-1 leading-none">
          {AUDIT_QUERY.slice(0, queryChars)}
          {queryChars > 0 && queryChars < AUDIT_QUERY.length && (
            <span className="inline-block w-0.5 h-3 bg-accent animate-pulse align-middle ml-px" />
          )}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 transition-opacity duration-500" style={{ opacity: showGap ? 1 : 0 }}>
        <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/60 px-3 py-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-600/60 mb-1">Search Rank</p>
          <p className="text-[22px] font-bold text-emerald-600 leading-none">#1</p>
          <p className="text-[9px] text-emerald-600/55 mt-1">Google · Target keyword</p>
        </div>
        <div className="rounded-xl border border-red-200/70 bg-red-50/60 px-3 py-2.5">
          <p className="text-[9px] font-bold uppercase tracking-wide text-red-500/60 mb-1">AI Visibility</p>
          <p className="text-[22px] font-bold text-red-500 leading-none">12%</p>
          <p className="text-[9px] text-red-500/55 mt-1">Not recommended</p>
        </div>
      </div>

      <div className="text-center transition-opacity duration-500" style={{ opacity: showGap ? 1 : 0 }}>
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full"
          style={{ background: "rgba(108,71,255,0.08)", color: "rgb(108,71,255)", border: "1px solid rgba(108,71,255,0.2)" }}>
          ↑ Gap detected: 88% ROI leakage
        </span>
      </div>
    </div>
  );
}

// ─── Phase 03: Strategic Authority Mapping ────────────────────────────────────

const AUTH_NODES = [
  { x: 52,  y: 28,  label: "r/SaaS"       },
  { x: 248, y: 25,  label: "TechCrunch"   },
  { x: 265, y: 100, label: "HackerNews"   },
  { x: 46,  y: 120, label: "IndieHackers" },
  { x: 160, y: 148, label: "Substack"     },
];
const AUTH_CENTER = { x: 150, y: 82 };

function Phase03Visual({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!active) { queueMicrotask(() => setVisible(0)); return; }
    const ts = AUTH_NODES.map((_, i) => setTimeout(() => setVisible(i + 1), i * 240));
    return () => ts.forEach(clearTimeout);
  }, [active]);

  return (
    <svg width="100%" height="170" viewBox="0 0 310 170">
      {AUTH_NODES.map((n, i) => (
        <line key={i}
          x1={AUTH_CENTER.x} y1={AUTH_CENTER.y} x2={n.x} y2={n.y}
          stroke="rgba(108,71,255,0.25)" strokeWidth="1"
          style={{ opacity: i < visible ? 1 : 0, transition: "opacity 0.5s ease" }}
        />
      ))}
      {AUTH_NODES.map((n, i) => (
        <g key={i} style={{ opacity: i < visible ? 1 : 0, transition: "opacity 0.45s ease" }}>
          <circle cx={n.x} cy={n.y} r="16" fill="rgba(108,71,255,0.04)" stroke="rgba(108,71,255,0.15)" strokeWidth="1" />
          <circle cx={n.x} cy={n.y} r="3.5" fill="rgba(108,71,255,0.55)" />
          <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize="7"
            fontFamily="system-ui,sans-serif" fontWeight="600" fill="rgba(0,0,0,0.38)">
            {n.label}
          </text>
        </g>
      ))}
      <circle cx={AUTH_CENTER.x} cy={AUTH_CENTER.y} r="34" fill="none" stroke="rgba(108,71,255,0.1)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx={AUTH_CENTER.x} cy={AUTH_CENTER.y} r="23" fill="rgba(108,71,255,0.09)" stroke="rgba(108,71,255,0.38)" strokeWidth="1.5" />
      <text x={AUTH_CENTER.x} y={AUTH_CENTER.y - 3} textAnchor="middle" fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="800" fill="rgb(108,71,255)">YOUR</text>
      <text x={AUTH_CENTER.x} y={AUTH_CENTER.y + 8} textAnchor="middle" fontSize="7" fontFamily="system-ui,sans-serif" fontWeight="800" fill="rgb(108,71,255)">BRAND</text>
    </svg>
  );
}

// ─── Phase 04: Content & Loop Optimization ────────────────────────────────────

const CONTENT_LINES = [
  { pct: 88, accent: true,  delay: 0   },
  { pct: 63, accent: false, delay: 240 },
  { pct: 95, accent: false, delay: 480 },
  { pct: 47, accent: true,  delay: 720 },
  { pct: 76, accent: false, delay: 960 },
];

function Phase04Visual({ active }: { active: boolean }) {
  const [widths, setWidths] = useState<number[]>(CONTENT_LINES.map(() => 0));

  useEffect(() => {
    if (!active) { queueMicrotask(() => setWidths(CONTENT_LINES.map(() => 0))); return; }
    const ts = CONTENT_LINES.map((l, i) =>
      setTimeout(() => setWidths(prev => { const n = [...prev]; n[i] = l.pct; return n; }), l.delay)
    );
    return () => ts.forEach(clearTimeout);
  }, [active]);

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-lg bg-black/[0.03] border border-black/[0.06] px-4 py-3.5">
        <p className="text-[10px] font-mono text-black/18 mb-3">{"// geo-content.brief: CTO Segment"}</p>
        <div className="space-y-2.5">
          {CONTENT_LINES.map((l, i) => (
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
      <div className="flex gap-2">
        {[
          { label: "Visibility",  value: "+34%", green: true  },
          { label: "Rec. Score",  value: "High", green: false },
          { label: "Loop",        value: "Active", green: true },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border flex-1 justify-center"
            style={{ background: "rgba(108,71,255,0.06)", borderColor: "rgba(108,71,255,0.18)" }}>
            <span className="text-[9px] font-medium text-black/30">{m.label}:</span>
            <span className="text-[10px] font-bold" style={{ color: m.green ? "#22c55e" : "rgb(108,71,255)" }}>
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Live Log ────────────────────────────────────────────────────────────────

const LIVE_LOGS = [
  '[AGENT] Analyzing real-time query fan-out for "CTO" segment...',
  "[STATUS] Authority gap detected on Reddit/r/SaaS.",
  "[ACTION] Generating GEO-optimized brief...",
  '[AGENT] Visibility score for "CFO" improved: +12%',
  "[STATUS] New authority source: HackerNews · relevance: High",
  "[ACTION] Content brief deployed. Rec. Likelihood: 85%",
  '[AGENT] Monitoring synthesis coverage for "VP Engineering"...',
  "[STATUS] Brand sentiment: Positive across 3 LLMs",
];

function LiveLog() {
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStartIdx(i => i + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const lines = [0, 1, 2, 3].map(off => LIVE_LOGS[(startIdx + off) % LIVE_LOGS.length]);

  return (
    <div className="border-t border-black/[0.05] bg-[#0d0d0d] px-4 py-3 overflow-hidden" style={{ height: 88 }}>
      {lines.map((log, i) => (
        <p key={i} className="text-[10px] font-mono leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ color: i === 3 ? "rgba(108,71,255,0.9)" : `rgba(255,255,255,${0.1 + i * 0.08})` }}>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>▶ </span>{log}
        </p>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function IntelligencePipelineSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [activePhase,     setActivePhase]     = useState(0);
  const [displayedPhase,  setDisplayedPhase]  = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [inView,          setInView]          = useState(false);

  // Track section visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-cycle only when in view; reset to phase 0 when leaving so next entry starts fresh
  useEffect(() => {
    if (!inView) {
      queueMicrotask(() => setActivePhase(0));
      return;
    }
    const t = setInterval(() => setActivePhase(p => (p + 1) % PHASES.length), PHASE_DURATION);
    return () => clearInterval(t);
  }, [inView]);

  // Cross-fade on phase change
  useEffect(() => {
    queueMicrotask(() => setIsTransitioning(true));
    const t = setTimeout(() => { setDisplayedPhase(activePhase); setIsTransitioning(false); }, 180);
    return () => clearTimeout(t);
  }, [activePhase]);

  const phase = PHASES[displayedPhase];
  const visualActive = !isTransitioning && inView;

  return (
    <section ref={sectionRef} id="platform" className="section-lines py-20 md:py-28">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-5">
            <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
            The Refinea Intelligence Pipeline
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold tracking-[-0.025em] leading-tight mb-3">
            From raw data to algorithmic influence.
          </h2>
          <p className="text-base text-black/50 leading-relaxed max-w-lg">
            Our AI agent bridges the gap between your real-world traffic and GEO, turning data into a defensible competitive advantage.
          </p>
        </div>

        {/* Phase tabs */}
        <div className="flex gap-1.5 sm:gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-none">
          {PHASES.map((p, i) => {
            const isActive = i === activePhase;
            return (
              <button
                key={p.n}
                onClick={() => setActivePhase(i)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
                style={{
                  background:   isActive ? "rgba(108,71,255,0.07)" : "transparent",
                  borderColor:  isActive ? "rgba(108,71,255,0.28)" : "rgba(0,0,0,0.08)",
                  color:        isActive ? "rgb(108,71,255)"       : "rgba(0,0,0,0.4)",
                  boxShadow:    isActive ? "0 0 0 3px rgba(108,71,255,0.08)" : "none",
                }}
              >
                <span className="text-[10px] font-black tabular-nums"
                  style={{ color: isActive ? "rgba(108,71,255,0.5)" : "rgba(0,0,0,0.2)" }}>
                  {p.n}
                </span>
                {p.tagline}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="h-px bg-black/[0.06] mb-8" />

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] lg:grid-cols-[1fr_440px] gap-8 md:gap-10 items-start">

          {/* Left: phase copy */}
          <div
            className="flex flex-col gap-5 transition-all duration-200"
            style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(6px)" : "translateY(0)" }}
          >
            {/* Phase indicator */}
            <div className="flex items-center gap-3.5 self-start">
              <span className="text-[52px] font-black leading-none tabular-nums"
                style={{ color: "rgba(108,71,255,0.18)", fontVariantNumeric: "tabular-nums" }}>
                {phase.n}
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/30 mb-0.5">Phase</p>
                <p className="text-base font-bold text-black/70 leading-snug tracking-tight">{phase.tagline}</p>
              </div>
            </div>

            {/* Method */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/30 mb-1.5">Method</p>
              <p className="text-base text-black/70 leading-relaxed">{phase.method}</p>
            </div>

            {/* Agent at work */}
            <div className="pl-3 border-l-2 border-accent/[0.28]">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/30 mb-1.5">The Agent at work</p>
              <p className="text-sm text-black/60 leading-relaxed">{phase.agent}</p>
            </div>

            {/* Feature box */}
            <div className="rounded-xl px-4 py-3"
              style={{ background: "rgba(108,71,255,0.04)", border: "1px solid rgba(108,71,255,0.12)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: "rgb(108,71,255)" }}>
                Feature: {phase.featureLabel}
              </p>
              <p className="text-sm text-black/55 leading-relaxed">{phase.featureDesc}</p>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {PHASES.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-500"
                  style={{
                    width:      i === displayedPhase ? 20 : 8,
                    height:     8,
                    background: i === displayedPhase ? "rgb(108,71,255)" : "rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: Agent Sandbox - fixed height prevents layout shifts from animations */}
          <div className="flex flex-col rounded-2xl overflow-hidden border border-black/[0.07] shadow-[0_8px_48px_rgba(0,0,0,0.07)] bg-white lg:h-[420px]">

            {/* macOS chrome */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-black/[0.05] bg-black/[0.015] shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] font-mono text-black/25">
                refinea-agent: {phase.tagline.toLowerCase()}
              </span>
            </div>

            {/* Visual area */}
            <div
              className="px-6 pt-5 pb-4 flex-1 flex items-center transition-all duration-200"
              style={{
                opacity:   isTransitioning ? 0 : 1,
                transform: isTransitioning ? "translateY(4px)" : "translateY(0)",
                minHeight: 200,
              }}
            >
              {displayedPhase === 0 && <Phase01Visual active={visualActive} />}
              {displayedPhase === 1 && <Phase02Visual active={visualActive} />}
              {displayedPhase === 2 && <Phase03Visual active={visualActive} />}
              {displayedPhase === 3 && <Phase04Visual active={visualActive} />}
            </div>

            {/* Live log */}
            <LiveLog />
          </div>

        </div>
      </div>
    </section>
  );
}
