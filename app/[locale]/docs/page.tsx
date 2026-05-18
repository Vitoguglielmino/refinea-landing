import { setRequestLocale, getTranslations } from "next-intl/server";
import { SidebarIcon } from "../../components/SidebarIcons";

import PlatformOverviewReplica from "../../components/mockups/HeroAVITimeSeries";
import PlatformShareOfVoice from "../../components/mockups/PlatformShareOfVoice";
import PlatformCitations from "../../components/mockups/PlatformCitations";
import PlatformPersonas from "../../components/mockups/PlatformPersonas";
import PlatformInsights from "../../components/mockups/PlatformInsights";

/* ─── Container helper (matches landing) ─── */
function C({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-[1100px] px-4 sm:px-6 ${className}`}>{children}</div>
  );
}

/* ─── Mockup shell — horizontal scroll on narrow viewports ─── */
function MockupShell({ children, minWidth = 980 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="-mx-4 sm:mx-0 md:overflow-visible" style={{ overflowX: "auto" }}>
      <div style={{ minWidth, padding: "0 16px" }} className="sm:px-0">
        {children}
      </div>
    </div>
  );
}

/* ─── Overline — same chip style as landing sections ─── */
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

/* ─── Definition list block (term + body, used inside docs sections) ─── */
function DefList({ items }: { items: { term: string; body: string }[] }) {
  return (
    <dl
      className="mt-8 grid gap-x-8 gap-y-5"
      style={{ gridTemplateColumns: "minmax(140px, 180px) 1fr" }}
    >
      {items.map(({ term, body }) => (
        <div key={term} className="contents">
          <dt className="text-sm font-semibold text-black leading-relaxed">{term}</dt>
          <dd className="text-sm text-black/60 leading-relaxed m-0">{body}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ─── Numbered steps (onboarding-style cards) ─── */
function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="mt-10 grid gap-3 md:grid-cols-2">
      {items.map((s, i) => (
        <li
          key={i}
          className="bg-white rounded-2xl border border-black/[0.07] p-5 flex gap-4"
        >
          <span
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/[0.08] text-accent font-semibold"
            style={{ fontSize: 13 }}
          >
            {i + 1}
          </span>
          <div>
            <div className="text-sm font-semibold text-black mb-1 tracking-tight">
              {s.title}
            </div>
            <p className="text-sm text-black/60 leading-relaxed m-0">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─── In-page TOC chip row (under hero) ─── */
const TOC: { id: string; key: string }[] = [
  { id: "get-started", key: "tocGetStarted" },
  { id: "metrics", key: "tocMetrics" },
  { id: "share-of-voice", key: "tocSov" },
  { id: "citations", key: "tocCitations" },
  { id: "personas", key: "tocPersonas" },
  { id: "insights", key: "tocInsights" },
  { id: "workflows", key: "tocWorkflows" },
  { id: "brand-memory", key: "tocBrandMemory" },
  { id: "api", key: "tocApi" },
];

/* ─── Page ─── */
export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("docs");

  const onboardingSteps = [
    { title: t("getStarted.steps.s1.title"), body: t("getStarted.steps.s1.body") },
    { title: t("getStarted.steps.s2.title"), body: t("getStarted.steps.s2.body") },
    { title: t("getStarted.steps.s3.title"), body: t("getStarted.steps.s3.body") },
    { title: t("getStarted.steps.s4.title"), body: t("getStarted.steps.s4.body") },
    { title: t("getStarted.steps.s5.title"), body: t("getStarted.steps.s5.body") },
  ];

  const metricDefs = [
    { term: t("metrics.defs.avi.term"), body: t("metrics.defs.avi.body") },
    { term: t("metrics.defs.sov.term"), body: t("metrics.defs.sov.body") },
    { term: t("metrics.defs.rank.term"), body: t("metrics.defs.rank.body") },
    { term: t("metrics.defs.sentiment.term"), body: t("metrics.defs.sentiment.body") },
  ];

  const sovInterpret = [
    { term: t("sov.interpret.up.term"), body: t("sov.interpret.up.body") },
    { term: t("sov.interpret.flat.term"), body: t("sov.interpret.flat.body") },
    { term: t("sov.interpret.down.term"), body: t("sov.interpret.down.body") },
  ];

  const citationCats = [
    { term: t("citations.cats.owner.term"), body: t("citations.cats.owner.body") },
    { term: t("citations.cats.magazine.term"), body: t("citations.cats.magazine.body") },
    { term: t("citations.cats.reference.term"), body: t("citations.cats.reference.body") },
    { term: t("citations.cats.company.term"), body: t("citations.cats.company.body") },
    { term: t("citations.cats.blog.term"), body: t("citations.cats.blog.body") },
    { term: t("citations.cats.forum.term"), body: t("citations.cats.forum.body") },
    { term: t("citations.cats.government.term"), body: t("citations.cats.government.body") },
    { term: t("citations.cats.other.term"), body: t("citations.cats.other.body") },
  ];

  const personaMethods = [
    { term: t("personas.methods.ai.term"), body: t("personas.methods.ai.body") },
    { term: t("personas.methods.data.term"), body: t("personas.methods.data.body") },
    { term: t("personas.methods.hybrid.term"), body: t("personas.methods.hybrid.body") },
    { term: t("personas.methods.you.term"), body: t("personas.methods.you.body") },
  ];

  const insightLifecycle = [
    { term: t("insights.lifecycle.open.term"), body: t("insights.lifecycle.open.body") },
    { term: t("insights.lifecycle.progress.term"), body: t("insights.lifecycle.progress.body") },
    { term: t("insights.lifecycle.resolved.term"), body: t("insights.lifecycle.resolved.body") },
  ];

  const workflowCards = [
    {
      icon: "audit" as const,
      title: t("workflows.cards.crawl.title"),
      body: t("workflows.cards.crawl.body"),
      checks: [
        t("workflows.cards.crawl.c1"),
        t("workflows.cards.crawl.c2"),
        t("workflows.cards.crawl.c3"),
        t("workflows.cards.crawl.c4"),
      ],
    },
    {
      icon: "audit" as const,
      title: t("workflows.cards.schema.title"),
      body: t("workflows.cards.schema.body"),
      checks: [
        t("workflows.cards.schema.c1"),
        t("workflows.cards.schema.c2"),
        t("workflows.cards.schema.c3"),
        t("workflows.cards.schema.c4"),
      ],
    },
    {
      icon: "audit" as const,
      title: t("workflows.cards.quality.title"),
      body: t("workflows.cards.quality.body"),
      checks: [
        t("workflows.cards.quality.c1"),
        t("workflows.cards.quality.c2"),
        t("workflows.cards.quality.c3"),
        t("workflows.cards.quality.c4"),
      ],
    },
  ];

  const brandMemoryAssets = [
    { term: t("brandMemory.assets.proof.term"), body: t("brandMemory.assets.proof.body") },
    { term: t("brandMemory.assets.expert.term"), body: t("brandMemory.assets.expert.body") },
    { term: t("brandMemory.assets.facts.term"), body: t("brandMemory.assets.facts.body") },
  ];

  return (
    <div className="landing bg-background text-foreground">
      {/* ─── HERO ─── */}
      <section className="section-lines pt-28 md:pt-36 pb-12 md:pb-16">
        <C>
          <div className="max-w-[820px] mx-auto text-center">
            <Overline>{t("hero.overline")}</Overline>
            <h1 className="text-black mb-7">{t("hero.title")}</h1>
            <p className="text-black/60 text-lg leading-relaxed max-w-[640px] mx-auto">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* In-page TOC */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="inline-flex items-center bg-white hover:border-accent/30 hover:text-black transition-colors"
                style={{
                  gap: 6,
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.65)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {t(item.key)}
              </a>
            ))}
          </div>
        </C>
      </section>

      {/* ─── GET STARTED ─── */}
      <section id="get-started" className="py-10 md:py-14 bg-white scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("getStarted.overline")}
            title={t("getStarted.title")}
            body={t("getStarted.body")}
          />
          <Steps items={onboardingSteps} />
        </C>
      </section>

      {/* ─── METRICS — 4 definitions + Overview mockup ─── */}
      <section id="metrics" className="section-lines py-10 md:py-14 scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("metrics.overline")}
            title={t("metrics.title")}
            body={t("metrics.body")}
          />
          <MockupShell>
            <PlatformOverviewReplica />
          </MockupShell>
          <DefList items={metricDefs} />
        </C>
      </section>

      {/* ─── SHARE OF VOICE — mockup + interpret table ─── */}
      <section id="share-of-voice" className="py-10 md:py-14 bg-white scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("sov.overline")}
            title={t("sov.title")}
            body={t("sov.body")}
          />
          <MockupShell>
            <PlatformShareOfVoice />
          </MockupShell>
          <DefList items={sovInterpret} />
        </C>
      </section>

      {/* ─── CITATIONS — mockup + 8 categories ─── */}
      <section id="citations" className="section-lines py-10 md:py-14 scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("citations.overline")}
            title={t("citations.title")}
            body={t("citations.body")}
          />
          <MockupShell minWidth={1000}>
            <PlatformCitations />
          </MockupShell>
          <h3 className="text-base font-semibold text-black mt-10 mb-3 tracking-tight">
            {t("citations.catsTitle")}
          </h3>
          <DefList items={citationCats} />
        </C>
      </section>

      {/* ─── PERSONAS — mockup + 4 generation methods ─── */}
      <section id="personas" className="py-10 md:py-14 bg-white scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("personas.overline")}
            title={t("personas.title")}
            body={t("personas.body")}
          />
          <MockupShell minWidth={760}>
            <PlatformPersonas />
          </MockupShell>
          <h3 className="text-base font-semibold text-black mt-10 mb-3 tracking-tight">
            {t("personas.methodsTitle")}
          </h3>
          <DefList items={personaMethods} />
        </C>
      </section>

      {/* ─── INSIGHTS — mockup + lifecycle ─── */}
      <section id="insights" className="section-lines py-10 md:py-14 scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("insights.overline")}
            title={t("insights.title")}
            body={t("insights.body")}
          />
          <MockupShell minWidth={900}>
            <PlatformInsights />
          </MockupShell>
          <h3 className="text-base font-semibold text-black mt-10 mb-3 tracking-tight">
            {t("insights.lifecycleTitle")}
          </h3>
          <DefList items={insightLifecycle} />
        </C>
      </section>

      {/* ─── WORKFLOWS — 3 audit cards ─── */}
      <section id="workflows" className="py-10 md:py-14 bg-white scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("workflows.overline")}
            title={t("workflows.title")}
            body={t("workflows.body")}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {workflowCards.map((card) => (
              <div
                key={card.title}
                className="bg-background rounded-2xl border border-black/[0.09] p-6 flex flex-col gap-4"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/[0.08] text-accent">
                  <SidebarIcon seg={card.icon} size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-black mb-2 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-black/55 leading-relaxed">{card.body}</p>
                </div>
                <ul className="mt-2 space-y-2">
                  {card.checks.map((c) => (
                    <li
                      key={c}
                      className="text-xs text-black/65 leading-snug flex gap-2"
                    >
                      <span className="text-accent mt-[2px]">·</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ─── BRAND MEMORY ─── */}
      <section id="brand-memory" className="section-lines py-10 md:py-14 scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("brandMemory.overline")}
            title={t("brandMemory.title")}
            body={t("brandMemory.body")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Assets card */}
            <div className="bg-white rounded-2xl border border-black/[0.09] p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/[0.08] text-accent mb-4">
                <SidebarIcon seg="brand-memory" size={20} />
              </div>
              <h3 className="text-base font-bold text-black mb-2 tracking-tight">
                {t("brandMemory.assetsTitle")}
              </h3>
              <p className="text-sm text-black/55 leading-relaxed mb-5">
                {t("brandMemory.assetsBody")}
              </p>
              <DefList items={brandMemoryAssets} />
            </div>

            {/* Brand Kit card */}
            <div className="bg-white rounded-2xl border border-black/[0.09] p-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/[0.08] text-accent mb-4">
                <SidebarIcon seg="improve" size={20} />
              </div>
              <h3 className="text-base font-bold text-black mb-2 tracking-tight">
                {t("brandMemory.kitTitle")}
              </h3>
              <p className="text-sm text-black/55 leading-relaxed mb-5">
                {t("brandMemory.kitBody")}
              </p>
              <ul className="space-y-2">
                {[
                  t("brandMemory.kit.k1"),
                  t("brandMemory.kit.k2"),
                  t("brandMemory.kit.k3"),
                  t("brandMemory.kit.k4"),
                  t("brandMemory.kit.k5"),
                  t("brandMemory.kit.k6"),
                ].map((k) => (
                  <li key={k} className="text-xs text-black/65 leading-snug flex gap-2">
                    <span className="text-accent mt-[2px]">·</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Autopilot callout */}
          <div className="mt-6 bg-accent/[0.04] border border-accent/[0.15] rounded-2xl px-6 py-5 flex items-start gap-4">
            <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white text-accent">
              <SidebarIcon seg="brand-memory" size={18} />
            </span>
            <div>
              <div className="text-sm font-semibold text-black mb-1 tracking-tight">
                {t("brandMemory.autopilotTitle")}
              </div>
              <p className="text-sm text-black/60 leading-relaxed m-0">
                {t("brandMemory.autopilotBody")}
              </p>
            </div>
          </div>
        </C>
      </section>

      {/* ─── PUBLIC API ─── */}
      <section id="api" className="py-10 md:py-14 bg-white scroll-mt-20">
        <C>
          <SectionHeader
            overline={t("api.overline")}
            title={t("api.title")}
            body={t("api.body")}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Auth card with curl example */}
            <div className="md:col-span-2 bg-background rounded-2xl border border-black/[0.09] p-6">
              <h3 className="text-base font-bold text-black mb-2 tracking-tight">
                {t("api.authTitle")}
              </h3>
              <p className="text-sm text-black/55 leading-relaxed mb-4">
                {t("api.authBody")}
              </p>
              <pre
                className="bg-white border border-black/[0.07] rounded-lg p-4 text-xs text-black/75 overflow-x-auto"
                style={{
                  fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
                  lineHeight: 1.55,
                }}
              >
{`curl https://api.refinea.io/public/domains \\
  -H "X-API-Key: rfn_..."`}
              </pre>
            </div>

            {/* Reference links card */}
            <div className="bg-background rounded-2xl border border-black/[0.09] p-6 flex flex-col gap-3">
              <h3 className="text-base font-bold text-black mb-1 tracking-tight">
                {t("api.referenceTitle")}
              </h3>
              <a
                href="https://api.refinea.io/public/swagger"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                {t("api.linkSwagger")} →
              </a>
              <a
                href="https://api.refinea.io/public/redoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                {t("api.linkRedoc")} →
              </a>
              <a
                href="https://api.refinea.io/public/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                {t("api.linkOpenapi")} →
              </a>
              <p className="text-xs text-black/45 leading-snug mt-2">
                {t("api.note")}
              </p>
            </div>
          </div>
        </C>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-white py-12 md:py-16 border-t border-black/[0.05]">
        <C>
          <div className="text-center max-w-[720px] mx-auto">
            <h2 className="text-black mb-5">{t("cta.title")}</h2>
            <p className="text-black/60 text-lg leading-relaxed max-w-[560px] mx-auto mb-9">
              {t("cta.body")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://platform.refinea.io"
                className="inline-flex items-center text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all"
                style={{
                  gap: 8,
                  padding: "12px 22px",
                  fontSize: 16,
                  fontWeight: 500,
                  border: "1px solid transparent",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {t("cta.ctaPrimary")}
              </a>
              <a
                href="https://calendly.com/vito-guglielmino-refinea/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white hover:border-black/15 transition-colors"
                style={{
                  gap: 8,
                  padding: "12px 22px",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.75)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 8,
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}
              >
                {t("cta.ctaSecondary")}
              </a>
            </div>
          </div>
        </C>
      </section>
    </div>
  );
}
