import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HomePricing from "../components/HomePricing";
import { SidebarIcon } from "../components/SidebarIcons";

import MockupShell from "../components/MockupShell";
import PlatformOverviewReplica from "../components/mockups/HeroAVITimeSeries";
import PlatformPersonas from "../components/mockups/PlatformPersonas";
import PlatformShareOfVoice from "../components/mockups/PlatformShareOfVoice";
import PlatformCitations from "../components/mockups/PlatformCitations";
import PlatformInsights from "../components/mockups/PlatformInsights";
import {
  ContentMini,
  WorkflowsMini,
  BrandMemoryMini,
} from "../components/mockups/PlatformActionMinis";

/* ─── Container helper ─── */
function C({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-[1100px] px-4 sm:px-6 ${className}`}>{children}</div>
  );
}

/* ─── Overline ─── styled like the platform's toggle buttons
   (ModelsToggle/LayerScopeToggle/TimeRangeSelect) at rest. */
function Overline({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center mb-6"
      style={{
        gap: 8,
        padding: "7px 14px",
        fontSize: 14,
        fontWeight: 500,
        color: "rgba(0,0,0,0.75)",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 6,
        whiteSpace: "nowrap",
        lineHeight: 1.2,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Section header (overline + H2 + body) ─── */
function SectionHeader({
  overline,
  title,
  body,
}: {
  overline: string;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <div className="mb-14">
      <Overline>{overline}</Overline>
      <h2 className="text-black mb-5">{title}</h2>
      <p className="text-black/60 text-lg leading-relaxed max-w-[640px]">{body}</p>
    </div>
  );
}

/* ─── Page ─── */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="landing bg-background text-foreground">
      <Nav />

      {/* ─── Section 0: HERO ─── */}
      <section className="section-lines pt-20 md:pt-36 pb-12 md:pb-20">
        <C>
          <div className="max-w-[820px] mx-auto text-center">
            <a
              href="/refinea-analysis"
              className="inline-flex items-center mb-7 bg-white hover:border-black/15 transition-colors"
              style={{
                gap: 8,
                minHeight: 36,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(0,0,0,0.75)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 999,
                lineHeight: 1.2,
                maxWidth: "100%",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "var(--accent)",
                  boxShadow: "0 0 0 4px rgba(108, 71, 255, 0.15)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="truncate">{t("hero.analysisPill")}</span>
            </a>
            <h1 className="text-black mb-7">
              {t("hero.title")}
            </h1>
            <p className="text-black/60 text-lg leading-relaxed max-w-[640px] mx-auto mb-9">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 mb-4">
              <a
                href="https://platform.refinea.io"
                className="inline-flex items-center justify-center text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all"
                style={{
                  gap: 8,
                  minHeight: 48,
                  padding: "12px 22px",
                  fontSize: 16,
                  fontWeight: 500,
                  border: "1px solid transparent",
                  borderRadius: 8,
                  lineHeight: 1.2,
                }}
              >
                {t("hero.ctaPrimary")}
              </a>
              <a
                href="https://calendly.com/vito-guglielmino-refinea/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white hover:border-black/15 transition-colors"
                style={{
                  gap: 8,
                  minHeight: 48,
                  padding: "12px 22px",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.75)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 8,
                  lineHeight: 1.2,
                }}
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
            <p className="text-xs font-semibold text-black/60 mt-4">
              {t("hero.footnote")}
            </p>
          </div>

          {/* Hero mockup, full width below the copy */}
          <div className="mt-12 md:mt-16">
            <MockupShell>
              <PlatformOverviewReplica />
            </MockupShell>
          </div>
        </C>
      </section>

      {/* ─── Section 0.5: Social proof — client logo marquee ─── */}
      <section className="py-12 border-y border-black/[0.05] bg-white overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/35">
            {t("socialProof.overline")}
          </p>
        </div>

        {/* Fade-mask wrapper: side gradients hide the loop seam */}
        <div
          className="relative"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee items-center gap-x-16 hover:[animation-play-state:paused]">
            {/* List rendered twice so the loop wraps seamlessly.
                Each logo gets a per-item `scale` to compensate for the fact
                that visual weight ≠ bounding-box height (a thin wordmark like
                Fabio Antichi reads larger at the same height than a stacked
                lockup like B4i). Tweak `scale` to taste, not `h`. */}
            {[...Array(2)].flatMap((_, copy) =>
              [
                { name: "Seoleader",              src: "/logos/seoleader.png",     href: "https://seoleader.digital",       w: 2529, h: 353, scale: 1.0  },
                { name: "Omnigraf",               src: "/logos/omnigraf.png",      href: "https://omnigraf.it",             w: 1039, h: 258, scale: 1.0  },
                { name: "StoryWalking",           src: "/logos/storywalking.png",  href: "https://storywalking.tours",      w: 800,  h: 150, scale: 1.0  },
                { name: "Fabio Antichi",          src: "/logos/fabio-antichi.png", href: "https://www.fabioantichi.it/",    w: 676,  h: 94,  scale: 0.85 },
                { name: "B4i",                    src: "/logos/b4i.svg",           href: "https://b4i.unibocconi.it",       w: 514,  h: 121, scale: 1.15 },
                { name: "Tech Europe Foundation", src: "/logos/tech-europe.png",   href: "https://techeuropefoundation.eu", w: 168,  h: 56,  scale: 1.0  },
              ].map((c) => (
                <a
                  key={`${copy}-${c.name}`}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={c.name}
                  aria-hidden={copy === 1 ? true : undefined}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="block shrink-0 grayscale opacity-50 hover:opacity-90 transition-opacity"
                >
                  <Image
                    src={c.src}
                    alt={c.name}
                    width={c.w}
                    height={c.h}
                    className="w-auto object-contain"
                    style={{ height: `${28 * c.scale}px` }}
                  />
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── Section 1: BUYER PERSONA INTELLIGENCE ─── */}
      <section id="intelligence" className="section-lines py-10 md:py-14 scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("section1.overline")}
            title={t("section1.title")}
            body={t("section1.body")}
          />
          <MockupShell minWidth={980}>
            <PlatformPersonas />
          </MockupShell>
          <p className="text-xs font-semibold text-black/60 mt-4 text-center">
            {t("section1.caption")}
          </p>
        </C>
      </section>

      {/* ─── Section 2: AI VISIBILITY MONITORING ─── */}
      <section id="monitoring" className="py-10 md:py-14 bg-white scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("section2.overline")}
            title={t("section2.title")}
            body={t("section2.body")}
          />

          <MockupShell>
            <PlatformShareOfVoice />
          </MockupShell>
        </C>
      </section>

      {/* ─── Section 3: CITATIONS & SOURCES ─── */}
      <section id="sources" className="section-lines py-10 md:py-14 scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("section3.overline")}
            title={t("section3.title")}
            body={t("section3.body")}
          />
          <MockupShell minWidth={1000}>
            <PlatformCitations />
          </MockupShell>
        </C>
      </section>

      {/* ─── Section 4: ACTION — three cards ─── */}
      <section id="action" className="py-10 md:py-14 bg-white scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("section4.overline")}
            title={
              <>
                {t("section4.titleLine1")}
                <br />
                {t("section4.titleLine2")}
              </>
            }
            body={t("section4.body")}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 — Content */}
            <div
              id="content"
              className="scroll-mt-20 bg-background rounded-2xl border border-black/[0.09] p-6 flex flex-col gap-5 hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/[0.08] text-accent mb-4">
                  <SidebarIcon seg="improve" size={20} />
                </div>
                <h3 className="text-lg font-bold text-black mb-2 tracking-tight">
                  {t("section4.cards.content.title")}
                </h3>
                <p className="text-sm text-black/55 leading-relaxed">
                  {t("section4.cards.content.body")}
                </p>
              </div>
              <ContentMini />
            </div>

            {/* Card 2 — Workflows */}
            <div
              id="workflows"
              className="scroll-mt-20 bg-background rounded-2xl border border-black/[0.09] p-6 flex flex-col gap-5 hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/[0.08] text-accent mb-4">
                  <SidebarIcon seg="audit" size={20} />
                </div>
                <h3 className="text-lg font-bold text-black mb-2 tracking-tight">
                  {t("section4.cards.workflows.title")}
                </h3>
                <p className="text-sm text-black/55 leading-relaxed">
                  {t("section4.cards.workflows.body")}
                </p>
              </div>
              <WorkflowsMini />
            </div>

            {/* Card 3 — Brand Memory */}
            <div
              id="brand-memory"
              className="scroll-mt-20 bg-background rounded-2xl border border-black/[0.09] p-6 flex flex-col gap-5 hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/[0.08] text-accent mb-4">
                  <SidebarIcon seg="brand-memory" size={20} />
                </div>
                <h3 className="text-lg font-bold text-black mb-2 tracking-tight">
                  {t("section4.cards.brandMemory.title")}
                </h3>
                <p className="text-sm text-black/55 leading-relaxed">
                  {t("section4.cards.brandMemory.body")}
                </p>
              </div>
              <BrandMemoryMini />
            </div>
          </div>
        </C>
      </section>

      {/* ─── Section 5: ACTIONABLE INSIGHTS ─── */}
      <section id="insights" className="section-lines py-10 md:py-14 scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("section5.overline")}
            title={t("section5.title")}
            body={t("section5.body")}
          />
          <MockupShell minWidth={900}>
            <PlatformInsights />
          </MockupShell>
        </C>
      </section>

      {/* ─── Section 6: PRICING ─── */}
      <HomePricing />

      {/* ─── Section 7: FINAL CTA ─── */}
      <section className="bg-white py-10 md:py-14 border-t border-black/[0.05]">
        <C>
          <div className="text-center max-w-[720px] mx-auto">
            <h2 className="text-black mb-5">
              {t("finalCta.title")}
            </h2>
            <p className="text-black/60 text-lg leading-relaxed max-w-[560px] mx-auto mb-9">
              {t("finalCta.body")}
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3">
              <a
                href="https://platform.refinea.io"
                className="inline-flex items-center justify-center text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all"
                style={{
                  gap: 8,
                  minHeight: 48,
                  padding: "12px 22px",
                  fontSize: 16,
                  fontWeight: 500,
                  border: "1px solid transparent",
                  borderRadius: 8,
                  lineHeight: 1.2,
                }}
              >
                {t("finalCta.ctaPrimary")}
              </a>
              <a
                href="https://calendly.com/vito-guglielmino-refinea/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white hover:border-black/15 transition-colors"
                style={{
                  gap: 8,
                  minHeight: 48,
                  padding: "12px 22px",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.75)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 8,
                  lineHeight: 1.2,
                }}
              >
                {t("finalCta.ctaSecondary")}
              </a>
            </div>
            <p className="text-xs font-semibold text-black/60 mt-5">
              {t("finalCta.footnote")}
            </p>
          </div>
        </C>
      </section>

      <Footer />
    </div>
  );
}
