import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAviForIndustry } from "@/lib/marketing-api";
import { DEFAULT_INDUSTRY_SLUG, ACTIVE_INDUSTRIES } from "@/lib/industries";
import { RefineaAnalysisView } from "./RefineaAnalysisView";

/**
 * /refinea-analysis — public AI Visibility Index observatory.
 *
 * Statically generated with ISR. The seed data is fetched server-side
 * with `include_series=true` so the chart hydrates with real history on
 * first paint; subsequent toggle clicks proxy through /api/avi.
 */
export const revalidate = 86400;

/** FAQ accordion items — render order matches array order. Translations
 *  live in messages/{locale}.json under `refineaAnalysis.faq.items.*`. */
const FAQ_KEYS = [
  "whatIs",
  "updateFrequency",
  "missingBrand",
  "newIndustry",
  "freeAccess",
] as const;

/** Initial window for the seed fetch. 7 days matches the default
 *  surfaced by the time-range toggle. */
const INITIAL_WINDOW_DAYS = 7;

export default async function RefineaAnalysisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("refineaAnalysis");
  // Final CTA at the bottom reuses the homepage's `finalCta.*` strings —
  // single source of truth for the "Start free trial / Talk to sales"
  // copy site-wide.
  const tFinalCta = await getTranslations("finalCta");

  const data = await getAviForIndustry(DEFAULT_INDUSTRY_SLUG, {
    days: INITIAL_WINDOW_DAYS,
    includeSeries: true,
  });
  // Resolve all active-industry display labels server-side and pass the
  // resulting map to the client view — avoids shipping a client-side
  // useTranslations call just for slug → name lookup.
  const industryLabels: Record<string, string> = {};
  for (const ind of ACTIVE_INDUSTRIES) {
    if (ind.labelKey) industryLabels[ind.slug] = t(ind.labelKey);
  }

  return (
    <div className="landing bg-background text-foreground min-h-screen">
      <main>
        {/* ── Hero (white background, no grid pattern) ─────────────────
            Pulled out into its own section so the eyebrow / H1 / subtitle
            read as a clean intro. The grid-pattern observatory below
            picks up from here. */}
        <section className="bg-white pt-28 md:pt-36 pb-14 md:pb-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="max-w-[820px] mx-auto text-center">
              {/* Eyebrow rendered with the homepage Overline style: white
                  pill, grey border, font-size 14, like the section
                  overlines "Sources / Monitoring / Intelligence". */}
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
                {t("hero.eyebrow")}
              </div>
              <h1 className="text-black mb-6">
                {t("hero.title")}
              </h1>
              <p className="text-black/60 text-lg leading-relaxed max-w-[680px] mx-auto">
                {t("hero.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* ── Observatory (grid-pattern background) ────────────────────
            All interactive observatory state lives inside
            RefineaAnalysisView — industry pills, days toggle, fetches
            on change. The wrapper here is just layout. */}
        <section className="section-lines py-14 md:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <RefineaAnalysisView
              initial={data}
              locale={locale}
              toggleLabel={t("toggle.label")}
              ariaLabel={t("toggle.ariaLabel")}
              comingSoonLabel={t("toggle.comingSoon")}
              soonBadgeLabel={t("toggle.soonBadge")}
              industryLabels={industryLabels}
            />
          </div>
        </section>

        {/* ── Methodology (white background) ──────────────────────────
            White surface section. The methodology cards inside drop the
            soft shadow they had when sitting on a grey container — on
            white they read as flat outlined panels. */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            {/* Section header — pill kicker matching the hero, then H2.
                Centered for visual rhythm with the hero up top. */}
            <div className="max-w-[760px] mx-auto text-center mb-12">
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
                {t("methodology.kicker")}
              </div>
              <h2 className="text-black mb-3">{t("methodology.title")}</h2>
              <p className="text-black/60 text-lg leading-relaxed">
                {t("methodology.intro")}
              </p>
            </div>

            {/* All four cards on a single row at md+, stacked on mobile.
                Each card has its own accent-colored icon up top — same
                stroke style as SidebarIcons (sw 1.8, currentColor). */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-[1100px] mx-auto">
              {(
                [
                  { k: "step1", icon: <IconSearch /> },
                  { k: "step2", icon: <IconRepeat /> },
                  { k: "step3", icon: <IconTag /> },
                  { k: "step4", icon: <IconBars /> },
                ] as const
              ).map(({ k, icon }) => (
                <article
                  key={k}
                  className="rounded-xl flex flex-col"
                  style={{
                    // Section background is now white, so the cards
                    // drop the shadow and lean on a slightly stronger
                    // border to read as outlined panels on white.
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    padding: "20px 20px",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 28,
                      height: 28,
                      color: "var(--accent)",
                      marginBottom: 14,
                      marginLeft: -2,
                    }}
                  >
                    {icon}
                  </span>
                  <div
                    style={{
                      fontFamily:
                        "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', 'Roboto Mono', 'Fira Code', monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(108,71,255,0.8)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {t(`methodology.${k}.label`)}
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.9)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      marginBottom: 8,
                    }}
                  >
                    {t(`methodology.${k}.title`)}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: "rgba(0,0,0,0.6)",
                      lineHeight: 1.55,
                    }}
                  >
                    {t(`methodology.${k}.body`)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Common questions ─────────────────────────────────────────
            Same `<details>` accordion pattern as /pricing's FAQ —
            consistency across the site. White cards on the neutral
            grey background, no grid pattern. */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="max-w-[760px] mx-auto">
              <h2 className="text-black text-center mb-10">{t("faq.title")}</h2>
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
                      {t(`faq.items.${key}.q`)}
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
                      {t(`faq.items.${key}.a`)}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────────────
            Verbatim replica of the homepage's `finalCta` section so the
            conversion endpoint is identical across the two main entry
            pages of the site. Strings come from the shared `finalCta.*`
            i18n namespace. */}
        <section className="bg-white py-10 md:py-14 border-t border-black/[0.05]">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="text-center max-w-[720px] mx-auto">
              <h2 className="text-black mb-5">{tFinalCta("title")}</h2>
              <p className="text-black/60 text-lg leading-relaxed max-w-[560px] mx-auto mb-9">
                {tFinalCta("body")}
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
                  {tFinalCta("ctaPrimary")}
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
                  {tFinalCta("ctaSecondary")}
                </a>
              </div>
              <p className="text-xs font-semibold text-black/60 mt-5">
                {tFinalCta("footnote")}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ─── Methodology card icons ──────────────────────────────────────────
   Same stroke style as SidebarIcons (sw 1.8, currentColor). Each ~18px
   so they read cleanly inside the 32×32 lavender square wrapper. */
const ICON_SIZE = 18;
const ICON_SW = 1.8;

function IconSearch() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <line x1="20" y1="20" x2="16" y2="16" />
    </svg>
  );
}

function IconRepeat() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 15.5-6.3" />
      <polyline points="20 3 20 8 15 8" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3" />
      <polyline points="4 21 4 16 9 16" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.5 13.5L13 21a1.5 1.5 0 0 1-2.1 0L3 13V3h10l7.5 7.5a1.5 1.5 0 0 1 0 2.1z" />
      <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconBars() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ICON_SW} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="20" x2="5" y2="14" />
      <line x1="12" y1="20" x2="12" y2="8" />
      <line x1="19" y1="20" x2="19" y2="11" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </svg>
  );
}
