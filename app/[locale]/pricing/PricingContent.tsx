/**
 * Pricing page — server component.
 *
 * Two tabs: For Brands (Lite + Pro cards) / For Agencies (custom plan
 * with feature grid). The whole pricing content is server-rendered so
 * every price, plan name and feature is in the static HTML for Google
 * and AI crawlers. Only the tab interaction is a client island
 * (PricingTabs), which receives both panels as props and toggles
 * visibility while keeping the URL in sync.
 */

import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Favicon } from "../../components/mockups/Favicon";
import PricingTabs from "./PricingTabs";

const SALES_URL = "https://calendly.com/vito-guglielmino-refinea/30min";

/* ─── icons ─── */
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-black/70 leading-relaxed">
      <span className="text-accent mt-0.5 shrink-0">
        <CheckIcon />
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function ModelIcons({
  withAiOverviews = false,
  aiOverviewsLabel = "AI Overviews",
}: {
  withAiOverviews?: boolean;
  aiOverviewsLabel?: string;
}) {
  const models = [
    { domain: "chat.openai.com", label: "ChatGPT" },
    { domain: "perplexity.ai", label: "Perplexity" },
    { domain: "gemini.google.com", label: "Gemini" },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5">
        {models.map((m) => (
          <Favicon
            key={m.domain}
            domain={m.domain}
            initials={m.label.charAt(0)}
            color="#000"
            size={20}
          />
        ))}
      </span>
      {withAiOverviews && (
        <>
          <span className="text-black/30 text-sm">+</span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{
              color: "rgba(0,0,0,0.7)",
              padding: "3px 8px",
              borderRadius: 5,
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Favicon domain="google.com" initials="G" color="#000" size={14} />
            {aiOverviewsLabel}
          </span>
        </>
      )}
    </div>
  );
}

/* ─── For Brands tab content ─── */
async function ForBrands() {
  const t = await getTranslations("pricingPage.brands");
  const tPage = await getTranslations("pricingPage");
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[920px] mx-auto">
        {/* LITE */}
        <article
          className="bg-white rounded-2xl p-8 flex flex-col"
          style={{
            border: "1px solid rgba(0,0,0,0.09)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
          }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black tracking-tight mb-1">{t("lite.name")}</h3>
            <p className="text-sm text-black/55">
              {t("lite.tagline")}
            </p>
          </div>

          <div className="mb-1">
            <span className="text-4xl font-bold text-black tracking-tight">{t("lite.price")}</span>
            <span className="text-sm text-black/50 ml-1">{tPage("vatSuffix")}</span>
            <span className="text-sm text-black/50 ml-1">{t("lite.perMonth")}</span>
          </div>
          <p className="text-xs text-black/40 h-4 mb-7" />

          <a
            href="https://platform.refinea.io"
            className="inline-flex items-center justify-center bg-white hover:border-black/15 transition-colors mb-7"
            style={{
              padding: "12px 22px",
              fontSize: 15,
              fontWeight: 500,
              color: "rgba(0,0,0,0.75)",
              border: "1px solid rgba(0,0,0,0.09)",
              borderRadius: 8,
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}
          >
            {t("lite.cta")}
          </a>

          <ul className="flex flex-col gap-3">
            <Feature>{t("lite.feature1")}</Feature>
            <li className="flex items-start gap-2.5 text-sm text-black/70 leading-relaxed">
              <span className="text-accent mt-0.5 shrink-0">
                <CheckIcon />
              </span>
              <ModelIcons />
            </li>
            <Feature>{t("lite.feature3")}</Feature>
            <Feature>{t("lite.feature4")}</Feature>
            <Feature>{t("lite.feature5")}</Feature>
            <Feature>{t("lite.feature6")}</Feature>
            <Feature>{t("lite.feature7")}</Feature>
          </ul>
        </article>

        {/* PRO */}
        <article
          className="bg-white rounded-2xl p-8 flex flex-col relative"
          style={{
            border: "1.5px solid var(--accent)",
            boxShadow: "0 4px 24px rgba(108,71,255,0.08)",
          }}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-black tracking-tight">{t("pro.name")}</h3>
              <span
                className="inline-flex items-center"
                style={{
                  padding: "3px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--accent)",
                  background: "rgba(108,71,255,0.10)",
                  border: "1px solid rgba(108,71,255,0.20)",
                  borderRadius: 4,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {t("pro.trialBadge")}
              </span>
            </div>
            <p className="text-sm text-black/55">
              {t("pro.tagline")}
            </p>
          </div>

          <div className="mb-1">
            <span className="text-4xl font-bold text-black tracking-tight">{t("pro.price")}</span>
            <span className="text-sm text-black/50 ml-1">{tPage("vatSuffix")}</span>
            <span className="text-sm text-black/50 ml-1">{t("pro.perMonth")}</span>
          </div>
          <p className="text-xs text-black/40 h-4 mb-7" />

          <a
            href="https://platform.refinea.io"
            className="inline-flex items-center justify-center text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all mb-7"
            style={{
              padding: "12px 22px",
              fontSize: 15,
              fontWeight: 500,
              border: "1px solid transparent",
              borderRadius: 8,
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}
          >
            {t("pro.cta")}
          </a>

          <ul className="flex flex-col gap-3">
            <Feature>{t("pro.feature1")}</Feature>
            <li className="flex items-start gap-2.5 text-sm text-black/70 leading-relaxed">
              <span className="text-accent mt-0.5 shrink-0">
                <CheckIcon />
              </span>
              <ModelIcons withAiOverviews aiOverviewsLabel={tPage("agencies.modelsLabel.aiOverviews")} />
            </li>
            <Feature>{t("pro.feature3")}</Feature>
            <Feature>{t("pro.feature4")}</Feature>
            <Feature>{t("pro.feature5")}</Feature>
            <Feature>{t("pro.feature6")}</Feature>
            <Feature>{t("pro.feature7")}</Feature>
            <Feature>{t("pro.feature8")}</Feature>
          </ul>
        </article>
      </div>

      <p className="text-center mt-10 text-sm text-black/55">
        {t("footnotePrefix")}{" "}
        <a
          href={SALES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline font-medium"
        >
          {t("footnoteLink")}
        </a>
        {t("footnoteSuffix")}
      </p>
    </>
  );
}

/* ─── For Agencies tab content ───────────────────────────────────────
   Single bordered card with a 3-column grid:
     col 1: feature name
     col 2: value ("Custom" on every row, except "All AI models" → logos)
     col 3: description
   CTA section below mirrors the homepage Final CTA (violet glow + 2 CTAs).
*/

type ModelKey = "chatgpt" | "perplexity" | "gemini" | "aiOverviews" | "claude" | "deepseek" | "copilot" | "grok";

const AGENCY_MODELS: { domain: string; key: ModelKey }[] = [
  { domain: "chat.openai.com",       key: "chatgpt" },
  { domain: "perplexity.ai",         key: "perplexity" },
  { domain: "gemini.google.com",     key: "gemini" },
  { domain: "google.com",            key: "aiOverviews" },
  { domain: "claude.ai",             key: "claude" },
  { domain: "deepseek.com",          key: "deepseek" },
  { domain: "copilot.microsoft.com", key: "copilot" },
  { domain: "grok.com",              key: "grok" },
];

type AgencyValue = "custom" | "models";
type AgencyRowKey =
  | "unlimitedPrompts"
  | "customFrequency"
  | "allModels"
  | "apiMcp"
  | "clientManagement"
  | "salesPitch"
  | "customWorkflows"
  | "dedicatedSupport"
  | "partnerCommunity";

const AGENCY_ROWS: { key: AgencyRowKey; value: AgencyValue }[] = [
  { key: "unlimitedPrompts",  value: "custom" },
  { key: "customFrequency",   value: "custom" },
  { key: "allModels",         value: "models" },
  { key: "apiMcp",            value: "custom" },
  { key: "clientManagement",  value: "custom" },
  { key: "salesPitch",        value: "custom" },
  { key: "customWorkflows",   value: "custom" },
  { key: "dedicatedSupport",  value: "custom" },
  { key: "partnerCommunity",  value: "custom" },
];

// Pure presentational helpers — `t` is passed in so they work inside a
// server component (no hook call). `customBadge` is a single label;
// `models` receives the modelsLabel sub-namespace translator.
function CustomBadge({ customBadge }: { customBadge: string }) {
  return (
    <span
      className="inline-flex items-center"
      style={{
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--accent)",
        background: "rgba(108,71,255,0.08)",
        border: "1px solid rgba(108,71,255,0.18)",
        borderRadius: 6,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        lineHeight: 1.2,
      }}
    >
      {customBadge}
    </span>
  );
}

function ModelsCell({ tModels }: { tModels: (key: string) => string }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {AGENCY_MODELS.map((m) => {
        const label = tModels(m.key);
        return (
          <span
            key={m.domain}
            title={label}
            className="inline-flex items-center justify-center"
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Favicon
              domain={m.domain}
              initials={label.charAt(0)}
              color="#000"
              size={18}
            />
          </span>
        );
      })}
    </div>
  );
}

async function ForAgencies() {
  const t = await getTranslations("pricingPage.agencies");
  const tModels = await getTranslations("pricingPage.agencies.modelsLabel");
  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Sub-header */}
      <div className="text-center mb-12 max-w-[680px] mx-auto">
        <h2 className="text-black mb-4">{t("title")}</h2>
        <p className="text-black/60 text-lg leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* ── 3-column features card ── */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: "1px solid rgba(0,0,0,0.09)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        }}
      >
        {/* Column header */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "minmax(220px, 1.1fr) minmax(260px, 1.5fr) 2fr",
            gap: 24,
            padding: "16px 28px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(0,0,0,0.015)",
          }}
        >
          {[t("tableHeaderFeature"), t("tableHeaderPlan"), t("tableHeaderDetails")].map((h) => (
            <span
              key={h}
              className="font-semibold uppercase"
              style={{
                fontSize: 11,
                color: "rgba(0,0,0,0.45)",
                letterSpacing: "0.08em",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {AGENCY_ROWS.map((row, i) => (
          <div
            key={row.key}
            className="grid grid-cols-1 md:grid-cols-[minmax(220px,1.1fr)_minmax(260px,1.5fr)_2fr] gap-x-6 gap-y-2"
            style={{
              padding: "20px 28px",
              borderBottom:
                i < AGENCY_ROWS.length - 1
                  ? "1px solid rgba(0,0,0,0.05)"
                  : "none",
              alignItems: "center",
            }}
          >
            {/* Col 1: feature name */}
            <div className="flex items-center gap-2.5">
              <span className="text-accent shrink-0">
                <CheckIcon />
              </span>
              <span className="text-base font-semibold text-black tracking-tight">
                {t(`rows.${row.key}.title`)}
              </span>
            </div>

            {/* Col 2: value */}
            <div>
              {row.value === "models" ? (
                <ModelsCell tModels={tModels} />
              ) : (
                <CustomBadge customBadge={t("customBadge")} />
              )}
            </div>

            {/* Col 3: description */}
            <p className="text-sm text-black/55 leading-relaxed">
              {t(`rows.${row.key}.desc`)}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ─── Agency CTA block ─── rendered as a separate white section below
   the agency feature grid (only when the Agencies tab is active). */
async function AgencyCTA() {
  const t = await getTranslations("pricingPage.agencies");
  return (
    <div className="max-w-[920px] mx-auto">
      <div className="text-center py-12 px-6">
        <h2 className="text-black mb-5">
          {t("ctaTitleLine1")}
          <br />
          {t("ctaTitleLine2")}
        </h2>
        <p className="text-black/60 text-lg leading-relaxed max-w-[560px] mx-auto mb-9">
          {t("ctaBody")}
        </p>
        <div className="flex items-center justify-center">
          <a
            href={SALES_URL}
            target="_blank"
            rel="noopener noreferrer"
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
            {t("ctaButton")}
          </a>
        </div>
        <p className="text-xs text-black/40 mt-5">
          {t("ctaFootnote")}
        </p>
      </div>
    </div>
  );
}

/* ─── FAQ (shared, below both tabs) ─── */
type FaqKey = "switchPlans" | "afterTrial" | "annualBilling" | "agencyPlan";
const FAQ_KEYS: FaqKey[] = ["switchPlans", "afterTrial", "annualBilling", "agencyPlan"];

async function Faqs() {
  const t = await getTranslations("pricingPage.faq");

  // FAQPage schema. Google retired FAQ rich results for non-gov/health
  // sites in 2023, but FAQPage is still parsed by Google AI Overviews
  // and Bing Copilot as a citable Q&A structure — worthwhile on a
  // commercial page whose content is already written as questions.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`items.${key}.q`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${key}.a`),
      },
    })),
  };

  return (
    <div className="max-w-[760px] mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h2 className="text-black text-center mb-10">{t("title")}</h2>
      <div className="flex flex-col gap-4">
        {FAQ_KEYS.map((key) => (
          <details
            key={key}
            className="group bg-white rounded-xl border border-black/[0.07] overflow-hidden"
          >
            <summary
              className="flex items-center justify-between cursor-pointer p-5 list-none"
              style={{ fontSize: 15, fontWeight: 600, color: "rgba(0,0,0,0.85)" }}
            >
              {t(`items.${key}.q`)}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="text-black/40 transition-transform group-open:rotate-180 shrink-0 ml-4"
              >
                <path
                  d="M3 5l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </summary>
            <p className="px-5 pb-5 text-sm text-black/65 leading-relaxed">
              {t(`items.${key}.a`)}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ─── server component */

export default async function PricingContent() {
  const t = await getTranslations("pricingPage");

  // Both panels are server-rendered here and handed to the PricingTabs
  // client island, which toggles their visibility. Every price, plan
  // and feature is therefore in the static HTML for crawlers and AI
  // bots; only the tab switch is client-side.
  const brandsPanel = <ForBrands />;
  const agenciesPanel = <ForAgencies />;
  const agencyCta = (
    <section className="bg-white py-16 md:py-20 border-y border-black/[0.06]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <AgencyCTA />
      </div>
    </section>
  );

  return (
    <div className="landing bg-background text-foreground min-h-screen">
      {/* Nav is rendered by pricing/layout.tsx. */}
      <main className="pt-28 md:pt-36">
        {/* ─── Top: header + tabs + plans (with grid) ─── */}
        <section className="section-lines pb-10 md:pb-14">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            {/* Header */}
            <div className="text-center max-w-[760px] mx-auto mb-12">
              <h1 className="text-black mb-5">{t("title")}</h1>
              <p className="text-black/60 text-lg leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* PricingTabs reads useSearchParams, which requires a
                Suspense boundary. The server-rendered panels are passed
                through as props and render regardless. */}
            <Suspense fallback={null}>
              <PricingTabs
                tabsLabel={t("tabsLabel")}
                brandsLabel={t("tabBrands")}
                agenciesLabel={t("tabAgencies")}
                brandsPanel={brandsPanel}
                agenciesPanel={agenciesPanel}
                agencyCta={agencyCta}
              />
            </Suspense>
          </div>
        </section>

        {/* ─── Bottom: FAQ (no grid, neutral grey) ─── */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <Faqs />
          </div>
        </section>
      </main>
    </div>
  );
}
