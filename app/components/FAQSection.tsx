"use client";

import { useState } from "react";

const FAQS = [
  {
    num: "01",
    q: "What is Generative Engine Optimization (GEO)?",
    a: [
      "Generative Engine Optimization (GEO) is the practice of increasing the probability that a brand is selected and recommended inside AI-generated responses from models such as ChatGPT, Gemini, or Claude.",
      "Unlike traditional SEO, GEO does not optimize for rankings in a list of links. It optimizes for inclusion inside synthesized answers, where AI models interpret sources, compare options, and generate recommendations.",
      "In the generative era, visibility is not about ranking first. It is about being included in the answer.",
    ],
  },
  {
    num: "02",
    q: "How can a brand appear in ChatGPT or AI-generated responses?",
    a: [
      "A brand appears in AI-generated responses when it is consistently associated with authoritative sources, relevant semantic contexts, and clear topical expertise.",
      "Large language models tend to recommend brands that are cited across credible digital spaces, demonstrate structured and informative content, align semantically with the user's intent, and appear within authoritative discussions or knowledge hubs.",
      "Optimizing for AI visibility requires structured content, external authority signals, and persona-specific positioning.",
    ],
  },
  {
    num: "03",
    q: "How is GEO different from traditional SEO?",
    a: [
      "Traditional SEO focuses on improving rankings in search engine result pages. Generative Engine Optimization focuses on influencing how AI systems synthesize information and select brands within a generated response.",
      "In SEO, users choose from a list of links. In GEO, AI models pre-select and recommend options on behalf of users.",
      "This shift moves marketing from keyword competition to decision-layer influence.",
    ],
  },
  {
    num: "04",
    q: "Why do AI answers change depending on the buyer persona?",
    a: [
      "AI-generated responses are not static. They change depending on who is asking the question, the context, and the intent behind it.",
      "Large language models adapt recommendations based on inferred user characteristics such as industry, experience level, geography, and goals. This means a brand might be recommended for one type of user but excluded for another.",
      "In the AI-native discovery era, the unit of optimization is no longer the keyword. It is the persona behind the question.",
    ],
  },
];

function FaqItem({ item, isOpen, onToggle }: {
  item: typeof FAQS[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-5 py-6 text-left group"
      >
        {/* Number */}
        <span
          className="font-mono text-[11px] font-bold tracking-[0.12em] shrink-0 pt-0.5 transition-colors duration-200"
          style={{ color: isOpen ? "#6c47ff" : "rgba(0,0,0,0.2)" }}
        >
          {item.num}
        </span>

        {/* Question */}
        <span className="flex-1 text-[15px] sm:text-[16px] font-semibold text-black leading-snug tracking-[-0.01em] group-hover:text-black/80 transition-colors">
          {item.q}
        </span>

        {/* Toggle icon */}
        <span
          className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isOpen ? "#6c47ff" : "rgba(0,0,0,0.05)",
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            className="transition-transform duration-300"
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <path
              d="M4 1v6M1 4h6"
              stroke={isOpen ? "#fff" : "#000"}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* Answer - animated height */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "600px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div className="pl-6 sm:pl-10 pb-6 space-y-3">
          {item.a.map((para, i) => (
            <p key={i} className="text-[14px] text-black/55 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-lines py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 md:gap-20">

          {/* Left - heading */}
          <div className="md:pt-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-6">
              <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
              GEO
            </div>
            <h2 className="text-2xl sm:text-[28px] font-bold tracking-[-0.025em] text-black leading-snug">
              AI Visibility<br />Questions.
            </h2>
            <p className="text-[13px] font-mono text-black/30 leading-relaxed mt-4">
              {">"} Everything you need to<br />understand GEO.
            </p>
          </div>

          {/* Right - accordion */}
          <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.num}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
