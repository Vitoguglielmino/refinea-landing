"use client";

import { useCallback, useState } from "react";

export default function StatementSection() {
  const [line2Lit, setLine2Lit] = useState(false);
  const [paraLit, setParaLit] = useState(false);

  const line2Ref = useCallback((node: HTMLParagraphElement | null) => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLine2Lit(true); obs.disconnect(); } },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    obs.observe(node);
  }, []);

  const paraRef = useCallback((node: HTMLParagraphElement | null) => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setParaLit(true); obs.disconnect(); } },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    obs.observe(node);
  }, []);

  return (
    <section id="statement-section" className="section-lines py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="max-w-2xl">

          {/* Line 1 - always lit */}
          <p className="text-2xl sm:text-4xl md:text-[52px] font-bold leading-[1.05] tracking-[-0.025em] text-black">
            You may rank on Google.
          </p>

          {/* Line 2 - illuminates at midscreen */}
          <p
            ref={line2Ref}
            className="text-2xl sm:text-4xl md:text-[52px] font-bold leading-[1.05] tracking-[-0.025em] transition-[color] duration-700"
            style={{ color: line2Lit ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.08)" }}
          >
            And still lose in AI.
          </p>

          {/* Paragraph - illuminates at midscreen */}
          <p
            ref={paraRef}
            className="text-lg leading-relaxed max-w-xl mt-7 transition-[color] duration-700"
            style={{ color: paraLit ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.10)" }}
          >
            Traditional SEO measures keywords. But in the age of AI, visibility is conditional.
            It depends on how your brand is synthesized for a specific person, in a specific moment.
          </p>

        </div>
      </div>
    </section>
  );
}
