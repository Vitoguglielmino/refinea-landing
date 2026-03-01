"use client";

import { useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

type Category = "Different Intent" | "Different Context" | "Different Geography" | "Different Persona";

const CATEGORIES: Category[] = [
  "Different Intent",
  "Different Context",
  "Different Geography",
  "Different Persona",
];

type BubbleData = {
  tag: string;
  query: string;
  response: string;
  confidence: number;
};

const DATA: Record<
  Category,
  { headline: string; subline: string; bubbles: [BubbleData, BubbleData] }
> = {
  "Different Intent": {
    headline: "AI answers why, not just what.",
    subline: "The intent behind a query reshapes the entire response - and which brands get recommended.",
    bubbles: [
      {
        tag: "Intent: Research",
        query: "best running shoes",
        response:
          "Depends on what you're training for. If you're logging serious miles, you'll want solid stack height and cushioning. Carbon-plate options like the Vaporfly or Endorphin Pro are worth the investment past the half-marathon mark. For everyday training, something like the Brooks Ghost or Nike Pegasus gives you durability without beating up your legs. What distances are you targeting?",
        confidence: 62,
      },
      {
        tag: "Intent: Purchase",
        query: "best running shoes",
        response:
          "If you're buying today, the Nike Pegasus 40 is hard to beat at $130. Versatile, ships fast, and works for most runners. One thing to know: running shoes often run narrow, so sizing up half a size is pretty common. Brooks Ghost 15 is another safe pick if you want something slightly more cushioned. Want me to compare a few options by price?",
        confidence: 85,
      },
    ],
  },
  "Different Context": {
    headline: "Context is the new ranking factor.",
    subline: "Answers evolve in real-time based on the conversational history and goals of the user.",
    bubbles: [
      {
        tag: "Training for a marathon",
        query: "best running shoes",
        response:
          "For marathon prep, two pairs is the standard approach: a daily trainer for easy miles like the Brooks Ghost or ASICS Gel-Nimbus, and a carbon-plate racer for tempo and race day. The Nike Vaporfly and Adidas Adizero are the ones showing up at the finish line most often. How far out is your race, and are you chasing a specific time?",
        confidence: 58,
      },
      {
        tag: "Casual weekend run",
        query: "best running shoes",
        response:
          "For 3-5km weekend runs you don't need anything too technical. The Nike React Infinity and Brooks Ghost are both comfortable and forgiving from the first wear. Hoka Clifton is another solid pick - super cushioned without feeling heavy. Any of those would work well and won't break the bank.",
        confidence: 74,
      },
    ],
  },
  "Different Geography": {
    headline: "Hyper-local intelligence.",
    subline: "Discovery is no longer about global rankings, but local relevance in AI-native search.",
    bubbles: [
      {
        tag: "Location: United States",
        query: "best running shoes",
        response:
          "In the US, Nike and Brooks dominate: Nike for performance and tech innovation, Brooks for everyday training comfort and reliability. Hoka's also grown massively over the last few years, especially for recovery and long-distance runs. Most specialty running stores will put you on a treadmill to analyze your gait before recommending anything.",
        confidence: 82,
      },
      {
        tag: "Location: Germany",
        query: "best running shoes",
        response:
          "In Germany, Adidas tends to lead - the Adizero and Ultraboost lines are very well regarded there. On Running is also strong in the DACH region, especially among urban runners. Nike is widely available but tends to play second fiddle to Adidas in the local running community. Are you looking for road, trail, or everyday use?",
        confidence: 28,
      },
    ],
  },
  "Different Persona": {
    headline: "The persona is the unit of analysis.",
    subline: "We measure how AI changes answers based on the specific buyer persona asking.",
    bubbles: [
      {
        tag: "Persona: Pro Athlete",
        query: "best running shoes",
        response:
          "At the competitive level you're looking at carbon-plate racers. The Nike Alphafly NEXT% 2 and Adizero Adios Pro 3 keep showing up at major marathons - both have 40mm+ stack heights and a full carbon plate. The difference is noticeable from 5k onwards. For training blocks, pair one of those with a durable daily shoe like the Pegasus. What race distance are you targeting?",
        confidence: 78,
      },
      {
        tag: "Persona: Fashion Sneakerhead",
        query: "best running shoes",
        response:
          "For something that looks good and actually performs, New Balance 990v6 and Saucony Shadow 6000 are the top picks right now. ASICS Gel-NYC is everywhere this season and crosses over well between running and street. If pure streetwear is the goal, the Dunk Low is still the cleanest silhouette going - though you'll sacrifice performance.",
        confidence: 31,
      },
    ],
  },
};

// ─── Skeleton line ────────────────────────────────────────────────────────────

function SkeletonLine({ className = "w-full", delay = "0ms" }: { className?: string; delay?: string }) {
  return (
    <div
      className={`h-3 rounded-full bg-black/[0.10] ${className}`}
      style={{ animation: `skeleton-pulse 1.2s ease-in-out infinite`, animationDelay: delay }}
    />
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────

function ChatBubble({
  tag,
  query,
  response,
  confidence,
  isLoading,
}: BubbleData & { isLoading: boolean }) {
  return (
    <div className="rounded-[22px] bg-white/85 backdrop-blur-md border border-white/60 overflow-hidden shadow-[0_8px_32px_rgba(108,71,255,0.08),0_2px_12px_rgba(0,0,0,0.06)]">

      {/* Header bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-black/[0.05]">
        {/* Left: text-line icon + ChatGPT label */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col gap-[5px]">
            <div className="w-[22px] h-[2px] rounded-full bg-black/25" />
            <div className="w-[14px] h-[2px] rounded-full bg-black/25" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[14px] font-semibold text-black leading-none">ChatGPT</span>
            <span className="text-[13px] text-black/35 leading-none">5.2 &gt;</span>
          </div>
        </div>
        {/* Right: three dots */}
        <div className="flex items-center gap-[5px]">
          <span className="w-[5px] h-[5px] rounded-full bg-black/25" />
          <span className="w-[5px] h-[5px] rounded-full bg-black/25" />
          <span className="w-[5px] h-[5px] rounded-full bg-black/25" />
        </div>
      </div>

      {/* Context tag - accent-tinted when content is live */}
      <div className="flex justify-center pt-3.5 pb-0.5">
        <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full border text-accent/80 bg-accent/[0.07] border-accent/[0.15]">
          {tag}
        </span>
      </div>

      {/* Messages */}
      <div className="px-4 pt-2.5 pb-3 min-h-[220px]">
        <div className="space-y-3">
          {/* Query - sempre visibile subito */}
          <div className="flex justify-end">
            <div
              className="max-w-[78%] px-4 py-2.5 text-[14px] text-black leading-[1.45]"
              style={{ background: "#e9e9eb", borderRadius: "20px 20px 6px 20px" }}
            >
              {query}
            </div>
          </div>
          {/* Risposta - skeleton per 1s, poi testo */}
          {isLoading ? (
            <div className="space-y-2 pt-1">
              <SkeletonLine delay="0ms" />
              <SkeletonLine className="w-5/6"  delay="120ms" />
              <SkeletonLine className="w-11/12" delay="240ms" />
              <SkeletonLine className="w-4/6"  delay="360ms" />
            </div>
          ) : (
            <div className="text-[14px] text-black/80 leading-[1.7]">
              {response}
            </div>
          )}
        </div>
      </div>

      {/* Bottom input bar */}
      <div className="px-3.5 pt-1 pb-3">
        <div className="flex items-center gap-2.5 bg-[#f2f2f2] rounded-full px-4 py-2.5 border border-black/[0.06]">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
            <circle cx="9" cy="9" r="8" stroke="#007AFF" strokeWidth="1.5" />
            <path d="M9 5.5V12.5M5.5 9H12.5" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="flex-1 text-[14px] text-black/30 leading-none">Message</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
            <path d="M9 2.5V15.5M6 5.5V12.5M3 7.5V10.5M12 5.5V12.5M15 7.5V10.5" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Confidence score - Refinea indicator */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-accent/[0.03] border border-accent/[0.08] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-black/35 uppercase tracking-wider">
              Brand visibility for this intent
            </span>
            <span
              className="text-xs font-bold tabular-nums transition-all duration-500"
              style={{ color: isLoading ? "transparent" : confidence >= 55 ? "#6c47ff" : "#aaaaaa" }}
            >
              {confidence}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-black/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: isLoading ? "0%" : `${confidence}%`,
                background: confidence >= 55 ? "#6c47ff" : "#D1D1D1",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function ParadigmSection() {
  const [active,    setActive]    = useState<Category>("Different Intent");
  const [displayed, setDisplayed] = useState<Category>("Different Intent");
  const [isLoading, setIsLoading] = useState(false);

  const select = (cat: Category) => {
    if (cat === active || isLoading) return;

    setActive(cat);
    setDisplayed(cat);   // query appare subito
    setIsLoading(true);  // risposta mostra skeleton

    setTimeout(() => {
      setIsLoading(false); // risposta appare dopo 1s
    }, 1000);
  };

  const { headline, subline, bubbles } = DATA[displayed];

  return (
    <section className="section-lines pt-16 md:pt-24 pb-20 md:pb-28 bg-white">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Header - 2-col, consistent with all other sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-end mb-8 md:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
              AI-Native Visibility
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold leading-tight tracking-[-0.02em]">
              Same question.<br />Different outcomes.
            </h2>
          </div>
          <p className="text-base md:text-lg text-black/70 leading-relaxed">
            We map how AI filters your brand based on why, where, and who is asking.
            Stop guessing, start influencing.
          </p>
        </div>

        {/* Main grid - left: controls + context  |  right: live demo */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[360px_1fr] gap-8 md:gap-12 items-start">

          {/* Left: category selector + dynamic explanation */}
          <div className="flex flex-col gap-8">

            {/* Vertical category tabs */}
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = cat === active;
                return (
                  <button
                    key={cat}
                    onClick={() => select(cat)}
                    className="text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background:  isActive ? "rgba(108,71,255,0.07)" : "transparent",
                      borderColor: isActive ? "rgba(108,71,255,0.28)" : "rgba(0,0,0,0.07)",
                      color:       isActive ? "rgb(108,71,255)"       : "rgba(0,0,0,0.45)",
                      boxShadow:   isActive ? "0 0 0 3px rgba(108,71,255,0.08)" : "none",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      )}
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic headline - fades on switch */}
            <div
              className="transition-all duration-200"
            >
              <h3 className="text-xl font-bold tracking-[-0.02em] text-black mb-2">
                {headline}
              </h3>
              <p className="text-sm text-black/60 leading-relaxed">{subline}</p>
            </div>

          </div>

          {/* Right: chat bubbles */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {bubbles.map((b) => (
              <ChatBubble key={b.tag} {...b} isLoading={isLoading} />
            ))}
          </div>

        </div>

        {/* Conclusion - full-width, centered */}
        <div className="mt-20 md:mt-24 text-center">
          <p className="text-2xl md:text-[28px] font-bold text-black tracking-[-0.025em] leading-tight">
            Stop optimizing for phantom users.
          </p>
          <p className="text-2xl md:text-[28px] font-bold text-black/20 tracking-[-0.025em] leading-tight">
            Generic search data is dead. We map real behavioral patterns into AI recommendations.
          </p>
        </div>

      </div>
    </section>
  );
}
