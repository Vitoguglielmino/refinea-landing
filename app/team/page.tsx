"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOUNDERS = [
  {
    id: "vito",
    initials: "VG",
    photo: "/logos/Vito.jpeg",
    linkedin: "https://www.linkedin.com/in/vitoguglielmino/",
    name: "Vito Guglielmino",
    role: "Co-Founder & CEO",
    superpower: "> Focus: AI Distribution & Go-to-Market Architecture",
    tooltip: "Mapped 200+ AI decision paths across 12 verticals",
    status: "Building Phase 02",
    statusColor: "available" as const,
  },
  {
    id: "giorgio",
    initials: "GM",
    photo: "/logos/giorgio.jpeg",
    linkedin: "https://www.linkedin.com/in/giorgio-monaco/",
    name: "Giorgio Monaco",
    role: "Co-Founder & CTO",
    superpower: "> Focus: Neural Mapping & Behavioral Clusters",
    tooltip: "Architected Refinea's core intelligence pipeline",
    status: "Available for Brainstorming",
    statusColor: "available" as const,
  },
];

type Achievement = {
  span: string;
  label: string;
  sublabel: string;
  badge?: string;
  type: "award" | "program" | "metric" | "research";
};

const ACHIEVEMENTS: Achievement[] = [
  {
    span: "col-span-2",
    label: "Startup Ecosystem",
    sublabel: "Selected among top early-stage AI startups. Validated by operators and builders across the EU tech landscape.",
    badge: "Top 1% Selection",
    type: "award",
  },
  {
    span: "col-span-1",
    label: "Accelerator Program",
    sublabel: "Cohort member. Pre-seed stage.",
    type: "program",
  },
  {
    span: "col-span-1",
    label: "AI Research Citation",
    sublabel: "Methodology referenced in LLM behavioral analysis.",
    type: "research",
  },
  {
    span: "col-span-1",
    label: "200+",
    sublabel: "AI decision paths mapped",
    type: "metric",
  },
  {
    span: "col-span-1",
    label: "12",
    sublabel: "Verticals in the intelligence pipeline",
    type: "metric",
  },
  {
    span: "col-span-1",
    label: "Hackathon",
    sublabel: "Winner - AI Infrastructure category",
    badge: "1st Place",
    type: "award",
  },
];

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span
        className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
        style={{ animation: "ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite" }}
      />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  );
}

// ─── Founder card ─────────────────────────────────────────────────────────────

function FounderCard({ founder }: { founder: typeof FOUNDERS[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <div className="relative w-full aspect-square bg-[#0d0d0d] rounded-2xl overflow-hidden mb-5 select-none">
        {/* Actual photo - B&W → color on hover */}
        <img
          src={founder.photo}
          alt={founder.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-all duration-500"
          style={{
            filter: hovered
              ? "grayscale(0) contrast(1.02) brightness(1.0)"
              : "grayscale(1) contrast(1.08) brightness(0.92)",
          }}
        />

        {/* Vignette bottom gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)",
          }}
        />

        {/* Hover tooltip */}
        <div
          className="absolute bottom-3 left-3 right-3 rounded-lg bg-black/80 backdrop-blur-sm px-3 py-2.5 transition-all duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(5px)",
          }}
        >
          <p className="text-[11px] font-mono text-white/80 leading-snug">
            {"// "}{founder.tooltip}
          </p>
        </div>
      </div>

      {/* LinkedIn */}
      <a
        href={founder.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mb-4 group w-fit"
      >
        {/* LinkedIn icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-black/25 group-hover:text-[#0A66C2] transition-colors duration-200 shrink-0"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        <span className="text-[11px] font-mono text-black/30 group-hover:text-black/60 transition-colors duration-200 tracking-wide">
          linkedin
        </span>
        <svg
          width="8"
          height="8"
          viewBox="0 0 10 10"
          fill="none"
          className="text-black/20 group-hover:text-black/50 transition-colors duration-200"
        >
          <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

      {/* Name + divider */}
      <div className="pb-2 mb-2" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.12)" }}>
        <div className="flex items-center gap-2">
          <StatusDot />
          <span className="text-[18px] font-semibold text-black tracking-[-0.01em]">
            {founder.name}
          </span>
        </div>
      </div>

      {/* Role */}
      <p className="text-[14px] text-[#666] mb-3 leading-none">
        {founder.role}
      </p>

      {/* Status */}
      <p className="text-[11px] text-emerald-600 font-medium mb-3">
        {founder.status}
      </p>

      {/* Superpower - monospace */}
      <p className="text-[12px] font-mono text-black/40 leading-relaxed">
        {founder.superpower}
      </p>
    </div>
  );
}

// ─── Achievement card ─────────────────────────────────────────────────────────

function AchievementCard({ item }: { item: Achievement }) {
  const icons = {
    award:    "◈",
    program:  "◎",
    metric:   "▸",
    research: "◇",
  };

  return (
    <div
      className={`${item.span} rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm p-5 flex flex-col gap-2`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[18px] text-black/20 leading-none">{icons[item.type]}</span>
        {item.badge && (
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-accent/[0.07] border border-accent/[0.15] text-accent/80 whitespace-nowrap shrink-0">
            {item.badge}
          </span>
        )}
      </div>
      <p className={`font-semibold text-black tracking-[-0.01em] leading-tight ${item.type === "metric" ? "text-3xl" : "text-[15px]"}`}>
        {item.label}
      </p>
      <p className="text-[13px] text-black/45 leading-relaxed">
        {item.sublabel}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background pt-16">

        {/* ── Hero ── */}
        <section className="section-lines pt-16 md:pt-24 pb-12 md:pb-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-8">
              <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
              The Architects
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">
              <div>
                <h1 className="text-[36px] sm:text-5xl md:text-[56px] font-bold leading-[1.02] tracking-[-0.03em] text-black">
                  Engineering<br />
                  the invisible<br />
                  <span style={{ color: "rgba(0,0,0,0.18)" }}>layer.</span>
                </h1>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-black/60 leading-relaxed">
                  Two builders obsessed with a single problem: why great brands disappear inside AI responses.
                </p>
                <p className="text-[13px] font-mono text-black/30 leading-relaxed">
                  {">"} Building infrastructure for the post-search era.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Founders ── */}
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 max-w-[680px]">
              {FOUNDERS.map((f) => (
                <FounderCard key={f.id} founder={f} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Validation ── */}
        <section className="section-lines py-16 md:py-24 border-t border-black/[0.05]">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">

            <div className="mb-8 md:mb-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 mb-3">
                Validated by the ecosystem.
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-[36px] font-bold tracking-[-0.025em] text-black leading-tight">
                Execution over narrative.
              </h2>
            </div>

            {/* Bento grid - 2 col mobile, 3 col tablet, 4 col desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[100px] md:auto-rows-[120px]">

              {/* Wide card - Startup Ecosystem with B4I + TEF logos */}
              <div className="col-span-2 row-span-2 rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  {/* Partner logos */}
                  <div className="flex items-center gap-4">
                    <img
                      src="/logos/B4i-logo-CMYK-pos.svg"
                      alt="B4i"
                      style={{ height: 36, objectFit: "contain", filter: "grayscale(1)", opacity: 0.5 }}
                    />
                    <img
                      src="/logos/tech_europe_foundation_logo.jpeg"
                      alt="Tech Europe Foundation"
                      style={{ height: 32, objectFit: "contain", filter: "grayscale(1)", opacity: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-accent/[0.07] border border-accent/[0.15] text-accent/80 shrink-0">
                    Top 1% Selection
                  </span>
                </div>
                <div>
                  <p className="text-[17px] font-semibold text-black tracking-[-0.01em] leading-snug mb-2">
                    Startup Ecosystem
                  </p>
                  <p className="text-[13px] text-black/45 leading-relaxed">
                    Selected among top early-stage AI startups. Validated by operators and builders across the EU tech landscape.
                  </p>
                </div>
              </div>

              {/* Metric: buyer personas */}
              <div className="col-span-1 row-span-1 rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm p-5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-black/20 uppercase tracking-widest">›_</span>
                <div>
                  <p className="text-3xl font-bold text-black tracking-[-0.03em] tabular-nums">60+</p>
                  <p className="text-[11px] text-black/40 leading-snug mt-0.5 font-mono">buyer personas analyzed</p>
                </div>
              </div>

              {/* Metric: prompts */}
              <div className="col-span-1 row-span-1 rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm p-5 flex flex-col justify-between">
                <span className="text-[11px] font-mono text-black/20 uppercase tracking-widest">›_</span>
                <div>
                  <p className="text-3xl font-bold text-black tracking-[-0.03em] tabular-nums">15K+</p>
                  <p className="text-[11px] text-black/40 leading-snug mt-0.5 font-mono">prompts analyzed</p>
                </div>
              </div>

              {/* Achievement - Startcup Lombardia */}
              <div className="col-span-1 row-span-1 rounded-2xl border border-black/[0.06] bg-white/60 backdrop-blur-sm p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <img
                    src="/logos/startcup_logo_2017 (1).png"
                    alt="Startcup Lombardia"
                    style={{ height: 24, objectFit: "contain", filter: "grayscale(1)", opacity: 0.5 }}
                  />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/[0.07] border border-accent/[0.15] text-accent/80 shrink-0">
                    Finalist
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-black leading-snug">Achievement</p>
                  <p className="text-[12px] text-black/40 mt-0.5">Startcup Lombardia</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Why ── */}
        <section className="py-16 md:py-24 border-t border-black/[0.05]">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="max-w-[680px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 mb-8">
                The Why
              </p>
              <blockquote className="text-2xl md:text-[28px] font-bold text-black leading-[1.3] tracking-[-0.025em] mb-6">
                &quot;We are first-time founders obsessed with a single problem: the delegation of choice to AI.&quot;
              </blockquote>
              <p className="text-[17px] text-black/50 leading-relaxed">
                We aren&apos;t here to play the legacy game; we are here to build the infrastructure that replaces it.
              </p>

              <div className="mt-12 pt-8 border-t border-black/[0.06]">
                <p className="text-[13px] font-mono text-black/30 leading-relaxed mb-6">
                  {">"} status: actively_building - refinea v1 in production
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent/90 active:scale-[0.99] transition-all"
                >
                  Get your AI Visibility Report
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <style jsx>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
