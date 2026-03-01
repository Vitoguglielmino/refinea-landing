"use client";

import { useState, useRef, useEffect } from "react";

// ─── Items ────────────────────────────────────────────────────────────────────

const ITEMS = [
  {
    title: "Beyond the Link",
    body: "We ensure your brand isn't just a search result, but the primary recommendation.",
    alert: "Ranked #1 on Google for 'Enterprise CRM' but 0% citations in ChatGPT for 'Best CRM for Startups'.",
  },
  {
    title: "Persona-Driven Accuracy",
    body: "We reveal why AI favors competitors for your most profitable customer segments.",
    alert: "Your product converts well on search ads. But the moment the query includes 'for small teams', AI recommends a competitor.",
  },
  {
    title: "Future-Proof Growth",
    body: "We map the decision paths of AI agents before they divert your traffic.",
    alert: "A new buyer intent is already active in AI search, months before it surfaces in your Google Analytics.",
  },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export default function GapSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-based activation: a card becomes active when its top edge scrolls
  // past the sticky panel threshold (top-28 = 112px). The last card to cross
  // that threshold wins - giving a full card-height of scroll before switching.
  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.50;
      let next = 0;
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el.getBoundingClientRect().top <= threshold) next = i;
      });
      setActiveIdx(next);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="section-lines py-16 md:py-28">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

        {/* Sticky scroll grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          {/* Left - outer div stretches to full grid height; inner div sticks */}
          <div>
          <div className="md:sticky md:top-28">
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold leading-tight tracking-[-0.02em] mb-6">
              You may rank on Google.
              <br />
              <span className="text-black/30">And still lose in AI.</span>
            </h2>
            <p className="text-lg text-black/70 leading-relaxed mb-8">
              Traditional SEO measures keywords. But in the age of AI, visibility
              is conditional. It depends on how your brand is synthesized for a
              specific person, in a specific moment.
            </p>

            {/* Progress dots */}
            <div className="flex items-center gap-2">
              {ITEMS.map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIdx ? 32 : 16,
                    background: i === activeIdx ? "#6c47ff" : "rgba(0,0,0,0.12)",
                  }}
                />
              ))}
            </div>
          </div>
          </div>

          {/* Right - scrolls through items */}
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-8">
              <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
              Refinea optimizes the outcome
            </div>

            <div className="space-y-14">
              {ITEMS.map((item, i) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={item.title}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    className="rounded-2xl border p-8 transition-all duration-500"
                    style={{
                      background: isActive ? "#ffffff" : "rgba(0,0,0,0.015)",
                      borderColor: isActive ? "rgba(108,71,255,0.18)" : "rgba(0,0,0,0.06)",
                      boxShadow: isActive ? "0 4px 28px rgba(108,71,255,0.09)" : "none",
                    }}
                  >
                    <p
                      className="text-base font-semibold mb-2 leading-snug transition-colors duration-500"
                      style={{ color: isActive ? "#000" : "rgba(0,0,0,0.35)" }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-sm leading-relaxed mb-5 transition-colors duration-500"
                      style={{ color: isActive ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.28)" }}
                    >
                      {item.body}
                    </p>

                    {/* Alert block */}
                    <div
                      className="rounded-xl border p-3.5 transition-all duration-500"
                      style={{
                        background: isActive ? "rgba(239,68,68,0.04)" : "rgba(0,0,0,0.02)",
                        borderColor: isActive ? "rgba(239,68,68,0.18)" : "rgba(0,0,0,0.05)",
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider shrink-0 mt-0.5 transition-colors duration-500"
                          style={{ color: isActive ? "rgba(239,68,68,0.65)" : "rgba(0,0,0,0.18)" }}
                        >
                          ALERT
                        </span>
                        <p
                          className="text-xs leading-relaxed transition-colors duration-500"
                          style={{ color: isActive ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.22)" }}
                        >
                          {item.alert}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Closing statement - full width, high breathing room */}
        <div className="mt-20 md:mt-24 text-center">
          <p className="text-2xl md:text-[28px] font-bold text-black tracking-[-0.025em] leading-tight mb-4">
            We turn your data into discovery.
          </p>
          <p className="text-base text-black/40 max-w-sm mx-auto leading-relaxed">
            Connect GA4, Search Console and first-party data in minutes.
          </p>
        </div>

      </div>
    </section>
  );
}
