import HeroDemo from "./components/HeroDemo";
import ReportForm from "./components/ReportForm";
import HeroCTA from "./components/HeroCTA";
import Nav from "./components/Nav";
import ParadigmSection from "./components/ParadigmSection";
import GapSection from "./components/GapSection";
import AgentPipelineSection from "./components/AgentPipelineSection";
import IntelligencePipelineSection from "./components/IntelligencePipelineSection";
import FAQSection from "./components/FAQSection";

// ─── Shared layout helpers ────────────────────────────────────────────────────

function C({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-[1100px] px-4 sm:px-6 ${className}`}>{children}</div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="bg-background text-foreground">

      <Nav />

      {/* ── Hero ── */}
      <section className="section-lines pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28">
        <C>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 items-center">

            {/* Text */}
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent bg-accent/[0.08] border border-accent/[0.15] px-3.5 py-1.5 rounded-full mb-7">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                The New Standard for Generative Engine Optimization (GEO)
              </div>

              {/* H1 */}
              <h1 className="text-[32px] sm:text-[43px] md:text-[56px] lg:text-[64px] font-bold leading-[1.06] tracking-[-0.025em] text-black mb-7">
                AI visibility is no{" "}
                <br className="hidden sm:block" />
                longer static.{" "}
                <br className="hidden sm:block" />
                <span className="text-black/40">It&apos;s conditional.</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base md:text-lg text-black/60 leading-relaxed mb-10 max-w-lg">
                AI personalizes recommendations by intent and persona.{" "}
                <br className="hidden sm:block" />
                Refinea is the infrastructure for selection.
              </p>

              {/* Hero CTA */}
              <div className="space-y-3">
                <HeroCTA />
                <p className="text-[13px] text-black/40 leading-relaxed pl-1">
                  Get your free AI visibility report in 10 minutes.<br className="hidden sm:block" /> See how ChatGPT, Gemini and Perplexity recommend your brand to real buyers.
                </p>
              </div>
            </div>

            {/* Widget */}
            <div className="relative">
              <HeroDemo />
            </div>

          </div>
        </C>
      </section>

      {/* separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#6400ca]/15 to-transparent" />

      {/* ── Section 2: New Paradigm (interactive) ── */}
      <ParadigmSection />

      {/* separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#6400ca]/15 to-transparent" />

      {/* ── Section 3: Invisible Gap ── */}
      <GapSection />

      {/* separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#6400ca]/15 to-transparent" />

      {/* ── Section 4: Agent Pipeline ── */}
      <AgentPipelineSection />

      {/* separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#6400ca]/15 to-transparent" />

      {/* ── Section 5+6: Intelligence Pipeline ── */}
      <IntelligencePipelineSection />

      {/* separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#6400ca]/15 to-transparent" />

      {/* ── Section 7: Free Report ── */}
      <section className="section-lines py-28 md:py-32">
        <C>
          <div className="max-w-lg mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold leading-[1.12] tracking-[-0.025em] mb-5">
              See how AI recommends your brand
              under real conditions.
            </h2>
            <p className="text-lg text-black/65">
              Intent. Context. Location. Persona.
            </p>
          </div>
          <ReportForm />
        </C>
      </section>

      {/* separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#6400ca]/15 to-transparent" />

      {/* ── FAQ ── */}
      <FAQSection />

      {/* separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#6400ca]/15 to-transparent" />

      {/* ── Section 8: Vision ── */}
      <section className="section-lines py-28 md:py-32 lg:py-40 bg-black">
        <C>
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold leading-[1.1] tracking-[-0.025em] text-white mb-10">
              Marketing is becoming
              <br />
              algorithmic selection.
            </h2>

            <div className="space-y-6 mb-14">
              <p className="text-lg text-white/65 leading-relaxed">
                As AI agents mediate more decisions, brands won&apos;t compete for
                rankings. They will compete for selection.
              </p>
              <p className="text-lg text-white/65 leading-relaxed">
                Refinea is the infrastructure layer that measures and optimizes
                how brands are chosen in a world of personalized AI agents.
              </p>
              <p className="text-xl font-medium text-white/80 leading-relaxed">
                We are not optimizing content.
                <br />
                We are optimizing decisions.
              </p>
            </div>

            <a
              href="/pricing"
              className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              Start Controlling AI Selection
            </a>
          </div>
        </C>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 bg-black border-t border-white/[0.06]">
        <C className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center">
            <img
              src="/logos/refinea%20grigio.svg"
              alt=""
              style={{ height: 30, width: 30, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.4, marginRight: -4 }}
            />
            <span className="text-sm font-bold text-white/35">Refinea</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5">
            <span className="text-xs text-white/20">
              © {new Date().getFullYear()} Refinea. All rights reserved.
            </span>
            <span className="hidden sm:block text-white/10 text-xs">·</span>
            <span className="text-xs text-white/15 font-mono">
              VAT 06241080875 · Cap. Soc. €10.000
            </span>
          </div>
        </C>
      </footer>

    </div>
  );
}
