"use client";

import { useState, useEffect, useRef } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const PERSONAS = [
  "Weekend Runner",
  "Fashion Sneakerhead",
  "Pro Athlete",
  "Fitness Enthusiast",
];
const LOCATIONS = ["United States", "Europe", "Asia Pacific", "Middle East"];
const INTENTS   = ["Comparison", "Discovery", "Research", "Purchase"];

// Nike AI visibility base score per B2C persona
const BASE_SCORES: Record<string, number> = {
  "Weekend Runner":       51,
  "Fashion Sneakerhead":  72,
  "Pro Athlete":          44,
  "Fitness Enthusiast":   58,
};
const LOC_MOD: Record<string, number> = {
  "United States":  0,
  "Europe":        -4,
  "Asia Pacific":  -8,
  "Middle East":  -11,
};
const INTENT_MOD: Record<string, number> = {
  "Comparison": 0,
  "Discovery": -11,
  "Research":   -4,
  "Purchase":  -14,
};

// Predefined auto-cycle combinations
const CYCLES = [
  { persona: "Weekend Runner",      location: "United States", intent: "Purchase"   },
  { persona: "Fashion Sneakerhead", location: "Europe",        intent: "Comparison" },
  { persona: "Pro Athlete",         location: "Asia Pacific",  intent: "Research"   },
  { persona: "Fitness Enthusiast",  location: "United States", intent: "Discovery"  },
];

function getScore(p: string, l: string, i: string) {
  return Math.max(10, Math.min(88,
    (BASE_SCORES[p] ?? 45) + (LOC_MOD[l] ?? 0) + (INTENT_MOD[i] ?? 0)
  ));
}

// ─── Count-up animation ────────────────────────────────────────────────────────

function useCountTo(target: number, duration = 500) {
  const [value, setValue] = useState(target);
  const prev = useRef(target);

  useEffect(() => {
    const from = prev.current;
    if (from === target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p   = Math.min((now - start) / duration, 1);
      const eas = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eas));
      if (p < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

// ─── Brand logos ───────────────────────────────────────────────────────────────

// ─── Select chevron ────────────────────────────────────────────────────────────

const CHEVRON = `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23000' stroke-opacity='0.3' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

// ─── Component ────────────────────────────────────────────────────────────────

const CYCLE_DURATION = 5000; // ms

export default function HeroDemo() {
  const [persona,  setPersona]  = useState(CYCLES[0].persona);
  const [location, setLocation] = useState(CYCLES[0].location);
  const [intent,   setIntent]   = useState(CYCLES[0].intent);

  const [cycleKey,       setCycleKey]       = useState(0);   // restarts progress bar animation
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused,        setIsPaused]        = useState(false);
  const cycleIdx = useRef(0);

  // Auto-cycle
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        cycleIdx.current = (cycleIdx.current + 1) % CYCLES.length;
        const next = CYCLES[cycleIdx.current];
        setPersona(next.persona);
        setLocation(next.location);
        setIntent(next.intent);
        setCycleKey(k => k + 1);
        setIsTransitioning(false);
      }, 280);
    }, CYCLE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused]);

  const score  = getScore(persona, location, intent);
  const hoka   = Math.max(5, score - 9);
  const asics  = Math.max(5, score - 15);
  const adidas = Math.max(5, score - 21);

  const dScore  = useCountTo(score);
  const dHoka   = useCountTo(hoka);
  const dAsics  = useCountTo(asics);
  const dAdidas = useCountTo(adidas);

  const sel = {
    className: "w-full text-sm font-medium text-black bg-black/[0.03] border border-black/[0.07] rounded-lg px-3 py-2.5 outline-none transition-all appearance-none cursor-pointer",
    style: { backgroundImage: CHEVRON, backgroundRepeat: "no-repeat" as const, backgroundPosition: "right 12px center", paddingRight: "32px" },
  };

  return (
    <div className="w-full rounded-2xl bg-white border border-black/[0.07] shadow-[0_8px_48px_rgba(0,0,0,0.07)] overflow-hidden">

      {/* Brand header */}
      <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/nike.png" alt="Nike" style={{ width: 52, height: 52, objectFit: "contain" }} />
          <div>
            <p className="text-sm font-bold text-black leading-none">Nike</p>
            <p className="text-[11px] text-black/35 mt-0.5">AI Visibility Simulator</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-black/35 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          live
        </span>
      </div>

      {/* Progress bar - restarts on each cycle via key */}
      <div className="h-[2px] bg-black/[0.05] relative overflow-hidden">
        <div
          key={cycleKey}
          className="absolute left-0 top-0 h-full w-full bg-accent/40 origin-left"
          style={{ animation: `cycle-progress ${CYCLE_DURATION}ms linear forwards` }}
        />
      </div>

      {/* Controls - fade during transition */}
      <div
        className={`px-6 pt-5 pb-4 space-y-3 transition-all duration-[280ms] ${
          isTransitioning ? "opacity-0 translate-y-[4px]" : "opacity-100 translate-y-0"
        }`}
        onChangeCapture={() => setIsPaused(true)}  // pause when user interacts
      >
        {([
          { label: "Persona",  value: persona,  set: setPersona,  opts: PERSONAS  },
          { label: "Location", value: location, set: setLocation, opts: LOCATIONS },
          { label: "Intent",   value: intent,   set: setIntent,   opts: INTENTS   },
        ] as const).map(({ label, value, set, opts }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-[60px] text-[11px] font-medium text-black/35 uppercase tracking-wide shrink-0">
              {label}
            </span>
            <select value={value} onChange={e => set(e.target.value as never)} {...sel}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06] mx-6" />

      {/* Score */}
      <div className="px-6 pt-5 pb-6">
        <div className="text-[11px] font-medium text-black/35 uppercase tracking-wide mb-3">
          Nike AI Visibility
        </div>

        <div className="flex items-baseline gap-2 mb-2.5">
          <span className="text-[42px] font-bold text-black leading-none tabular-nums">
            {dScore}%
          </span>
          <span className="text-xs text-black/35 font-medium">visibility score</span>
        </div>

        <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden mb-5">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
            style={{ width: `${dScore}%` }}
          />
        </div>

        {/* Competitors */}
        <div className="text-[11px] font-medium text-black/35 uppercase tracking-wide mb-3">
          vs. competitors
        </div>

        <div className="space-y-3">
          {[
            { name: "Hoka",   val: dHoka   },
            { name: "Asics",  val: dAsics  },
            { name: "Adidas", val: dAdidas },
          ].map(({ name, val }) => (
            <div key={name} className="flex items-center gap-3">
              <span className="w-[56px] shrink-0 text-xs font-medium leading-none text-black/70">{name}</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden bg-black/[0.05]">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out bg-black/[0.15]"
                  style={{ width: `${val}%` }}
                />
              </div>
              <span className="text-xs w-8 text-right tabular-nums text-black/70">{val}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
