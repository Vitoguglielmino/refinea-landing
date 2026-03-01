"use client";

import { useState } from "react";
import Nav from "../components/Nav";

// ─── Data ─────────────────────────────────────────────────────────────────────

const GROWTH_FEATURES = [
  { mono: "5", label: "Dynamic Personas", sub: "The Decision Makers" },
  { mono: "48h", label: "Strategic Pulse", sub: "Automatic refresh" },
  { mono: "50", label: "GEO Queries / mo", sub: "Intent-mapped + query fan out" },
  { mono: "3×", label: "AI-Optimized Articles / mo", sub: "Direct to WP Headless" },
  { mono: "3", label: "LLM Engines", sub: "ChatGPT · Gemini · Perplexity" },
  { mono: "✓", label: "GSC + GA4 Integration", sub: "Search & Analytics data" },
];

const PRO_FEATURES = [
  { mono: "15", label: "Dynamic Personas", sub: "Full Funnel Coverage" },
  { mono: "48h", label: "Strategic Pulse", sub: "Automatic refresh" },
  { mono: "150", label: "GEO Queries / mo", sub: "Intent-mapped + query fan out" },
  { mono: "10×", label: "AI-Optimized Articles / mo", sub: "Direct to WP Headless" },
  { mono: "All", label: "LLM Engines", sub: "ChatGPT · Gemini · Perplexity" },
  { mono: "✓", label: "GSC + GA4 Integration", sub: "Search & Analytics data" },
  { mono: "⊕", label: "Cross-Persona Insights", sub: "Multi-profile impact analysis" },
  { mono: "#", label: "Dedicated Slack Connect", sub: "Direct access channel" },
];

const FAQS = [
  {
    q: "Can I change my personas later?",
    a: "Yes. Refinea is built for agility. As your market evolves, your persona mapping evolves with it.",
  },
  {
    q: "How does the WP Headless integration work?",
    a: "Refinea publishes AI-optimized articles directly to your WordPress instance via REST API. Zero manual copy-paste.",
  },
  {
    q: "What counts as a GEO Query?",
    a: "Each time Refinea runs a persona-matched prompt across LLM engines to measure your brand visibility, that's one query.",
  },
];

// ─── Persona Avatars ───────────────────────────────────────────────────────────

function PersonaAvatars({ count, accent = false }: { count: number; accent?: boolean }) {
  const show = Math.min(count, 5);
  const colors = accent
    ? ["#6c47ff", "#8b6bff", "#a98bff", "#c4adff", "#ddd0ff"]
    : ["#1a1a1a", "#333", "#555", "#777", "#999"];

  return (
    <div className="flex items-center gap-1 mb-1">
      <div className="flex -space-x-1.5">
        {Array.from({ length: show }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
            style={{ background: colors[i], zIndex: show - i }}
          />
        ))}
      </div>
      {count > 5 && (
        <span className="text-[10px] font-mono ml-1" style={{ color: accent ? "#6c47ff" : "#999" }}>
          +{count - 5}
        </span>
      )}
      <span className="text-[10px] font-mono ml-1.5" style={{ color: accent ? "#8b6bff" : "#aaa" }}>
        personas
      </span>
    </div>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({
  mono,
  label,
  sub,
  accent = false,
}: {
  mono: string;
  label: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
      <span
        className="font-mono text-[11px] font-bold w-8 shrink-0 pt-0.5 tabular-nums"
        style={{ color: accent ? "#6c47ff" : "#1a1a1a" }}
      >
        {mono}
      </span>
      <div>
        <p className="text-[13px] font-semibold text-black leading-snug">{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#999" }}>{sub}</p>
      </div>
    </div>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "0.5px solid #E5E7EB" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-black leading-snug">{q}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          style={{ color: open ? "#6c47ff" : "#999" }}
        >
          <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <p className="text-[14px] leading-relaxed pb-5" style={{ color: "#555" }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ─── Calendly modal ───────────────────────────────────────────────────────────

function CalendlyModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-white"
        style={{
          height: "min(700px, 90vh)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/[0.06] hover:bg-black/[0.12] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <iframe
          src="https://calendly.com/vito-guglielmino-refinea/30min"
          width="100%"
          height="100%"
          frameBorder="0"
          title="Book a call with Refinea"
        />
      </div>
    </div>
  );
}

// ─── Pricing card ─────────────────────────────────────────────────────────────

function PricingCard({
  plan,
  price,
  tagline,
  badge,
  personaCount,
  features,
  ctaLabel,
  ctaStyle,
  accent,
  onCta,
}: {
  plan: string;
  price: string;
  tagline: string;
  badge?: string;
  personaCount: number;
  features: typeof GROWTH_FEATURES;
  ctaLabel: string;
  ctaStyle: "outline" | "accent";
  accent: boolean;
  onCta?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col rounded-2xl bg-white p-7 transition-all duration-300"
      style={{
        border: hovered
          ? `1.5px solid ${accent ? "rgba(108,71,255,0.5)" : "rgba(108,71,255,0.3)"}`
          : `1.5px solid ${accent ? "rgba(108,71,255,0.2)" : "rgba(0,0,0,0.08)"}`,
        boxShadow: hovered
          ? accent
            ? "0 0 0 4px rgba(108,71,255,0.08), 0 20px 60px rgba(108,71,255,0.12)"
            : "0 0 0 3px rgba(108,71,255,0.06), 0 12px 40px rgba(0,0,0,0.08)"
          : accent
          ? "0 8px 32px rgba(108,71,255,0.08)"
          : "0 2px 12px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 left-6">
          <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-accent text-white shadow-sm">
            {badge}
          </span>
        </div>
      )}

      {/* Plan name */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-black/35">
            Plan
          </span>
          <span
            className="text-[11px] font-mono font-bold uppercase tracking-[0.1em]"
            style={{ color: accent ? "#6c47ff" : "#1a1a1a" }}
          >
            {plan}
          </span>
        </div>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#666" }}>
          {tagline}
        </p>

        {/* Persona visual */}
        <PersonaAvatars count={personaCount} accent={accent} />

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-4">
          <span className="text-[40px] font-bold tracking-[-0.03em] text-black leading-none">
            {price}
          </span>
          <span className="text-[13px] font-mono" style={{ color: "#aaa" }}>/mo</span>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-black/[0.06] mb-4" />

      {/* Features */}
      <div className="flex-1 mb-6">
        {features.map((f) => (
          <FeatureRow key={f.label} {...f} accent={accent} />
        ))}
      </div>

      {/* CTA */}
      {ctaStyle === "outline" ? (
        <a
          href="https://try.refinea.io"
          className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-[#1a1a1a] border-2 border-[#1a1a1a] transition-all duration-200 hover:bg-black hover:text-white"
        >
          {ctaLabel}
        </a>
      ) : (
        <button
          onClick={onCta}
          className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
          style={{
            background: "#6c47ff",
            boxShadow: "0 4px 20px rgba(108,71,255,0.35), 0 1px 4px rgba(108,71,255,0.2)",
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  return (
    <>
      <Nav />
      {calendlyOpen && <CalendlyModal onClose={() => setCalendlyOpen(false)} />}
      <main className="min-h-screen pt-16" style={{ background: "#fff" }}>

        {/* Grid background - full page */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.028) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            zIndex: 0,
          }}
        />

        {/* Scan line */}
        <div
          className="fixed left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(108,71,255,0.4), transparent)",
            animation: "scan-line 10s linear infinite",
            zIndex: 1,
          }}
        />

        <div className="relative" style={{ zIndex: 2 }}>

          {/* ── Hero ── */}
          <section className="pt-16 md:pt-24 pb-10 md:pb-16 px-4 sm:px-6">
            <div className="mx-auto max-w-[1100px]">

              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-8">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                Pricing
              </div>

              <h1 className="text-[36px] sm:text-5xl md:text-[60px] font-bold leading-[1.01] tracking-[-0.03em] text-black mb-5 max-w-[680px]">
                Deploy your<br />
                <span style={{ color: "rgba(0,0,0,0.18)" }}>Persona Strategy.</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-black/50 leading-relaxed max-w-[560px]">
                Stop optimizing for algorithms. Start influencing the entities that drive AI decisions.{" "}
                <span className="text-black/70 font-medium">Choose the scale of your intelligence.</span>
              </p>
            </div>
          </section>

          {/* ── Cards ── */}
          <section className="px-4 sm:px-6 pb-10 md:pb-16">
            <div className="mx-auto max-w-[1100px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-[820px]">
                <PricingCard
                  plan="GROWTH"
                  price="$149"
                  tagline="Validation for scaling brands."
                  personaCount={5}
                  features={GROWTH_FEATURES}
                  ctaLabel="Start 14-day Free Trial"
                  ctaStyle="outline"
                  accent={false}
                />
                <PricingCard
                  plan="PRO"
                  price="$349"
                  tagline="Market Orchestration at scale."
                  badge="Enterprise Ready"
                  personaCount={15}
                  features={PRO_FEATURES}
                  ctaLabel="Scale with Pro"
                  ctaStyle="accent"
                  accent={true}
                  onCta={() => setCalendlyOpen(true)}
                />
              </div>
            </div>
          </section>

          {/* ── Custom anchor ── */}
          <section className="px-4 sm:px-6 pb-10 md:pb-16">
            <div className="mx-auto max-w-[1100px]">
              <div
                className="rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                style={{ border: "0.5px solid #E5E7EB", background: "rgba(255,255,255,0.8)" }}
              >
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-black/30 mb-1">
                    Custom Infrastructure
                  </p>
                  <p className="text-[16px] font-semibold text-black leading-snug">
                    Global Persona Infrastructure?
                  </p>
                  <p className="text-[13px] mt-1" style={{ color: "#666" }}>
                    Custom query volumes, unlimited personas, and dedicated AI training.
                  </p>
                </div>
                <button
                  onClick={() => setCalendlyOpen(true)}
                  className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-black/60 hover:text-black transition-colors whitespace-nowrap"
                >
                  Contact for Custom Plan
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="px-4 sm:px-6 pb-16 md:pb-28">
            <div className="mx-auto max-w-[1100px]">
              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 mb-3">
                    FAQ
                  </p>
                  <h2 className="text-2xl font-bold tracking-[-0.02em] text-black leading-snug">
                    Common<br />questions.
                  </h2>
                </div>
                <div style={{ borderTop: "0.5px solid #E5E7EB" }}>
                  {FAQS.map((faq) => (
                    <FaqItem key={faq.q} {...faq} />
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
