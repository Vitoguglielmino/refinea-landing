"use client";

/**
 * IndustrySection — renders one industry's full analysis block:
 *   header (title + subtitle + toggles) → AVI card → example prompts.
 *
 * Receives data + UI state from RefineaAnalysisView (the client wrapper
 * that owns the slug / days state and the fetch). Stays presentational —
 * doesn't fetch anything itself.
 *
 * Translations: we removed the `getTranslations` call now that the
 * component is client; the parent passes pre-resolved labels via props
 * (industryName, samplePrompts). Title and subtitle still come from
 * `useTranslations` because they don't depend on per-industry data.
 */
import { useTranslations } from "next-intl";
import type { AviResponse } from "@/lib/marketing-api";
import { AviIndexCard } from "./AviIndexCard";
import type { WindowDays } from "./RefineaAnalysisView";

export function IndustrySection({
  data,
  locale,
  days,
  onChangeDays,
  isLoading,
  samplePrompts,
  industryName,
}: {
  data: AviResponse;
  locale: string;
  days: WindowDays;
  onChangeDays: (d: WindowDays) => void;
  isLoading: boolean;
  /** Verbatim Italian prompts for the active industry. */
  samplePrompts: readonly string[];
  /** Pre-resolved display name for the active industry. */
  industryName: string;
}) {
  const t = useTranslations("refineaAnalysis");
  // Sample prompts are Italian verbatim — we don't localize them per
  // LANDING_INTEGRATION.md §4. `locale` is kept on the signature in case
  // the prompts section ever needs a localized helper text near them.
  void locale;

  return (
    <div className="flex flex-col gap-14 md:gap-16">
      {/* ── AVI Index section header (matches platform OverviewMetrics:
          small H2 + grey subtitle, sitting right above the card).
          On the right of the header sit the three platform-style toggles
          (Model · Region · Time range), in line with how the product
          surfaces the same filters above its own AVI card. */}
      <section>
        <div
          className="mb-5"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "rgba(0,0,0,0.75)",
                letterSpacing: "-0.02em",
              }}
            >
              {t("chart.title")}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(0,0,0,0.35)",
                letterSpacing: "-0.01em",
              }}
            >
              {t("chart.subtitle", { industry: industryName })}
            </p>
          </div>
          <HeaderTogglesContainer days={days} onChangeDays={onChangeDays} />
        </div>
        <AviIndexCard data={data} isLoading={isLoading} />
      </section>

      {/* ── Example prompts ──────────────────────────────────────────
          Same visual structure as the ranking table inside AviIndexCard:
          white card, header strip, divided rows. Keeps the section
          visually consistent with the leaderboard. */}
      {samplePrompts.length > 0 && (
        <section>
          <h3
            style={{
              margin: 0,
              marginBottom: 18,
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(0,0,0,0.75)",
              letterSpacing: "-0.02em",
            }}
          >
            {t("prompts.title", { industry: industryName })}
          </h3>
          <div
            className="bg-white rounded-2xl border border-black/[0.09] overflow-hidden"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
          >
            {samplePrompts.map((p, i) => {
              const isLast = i === samplePrompts.length - 1;
              return (
                <div
                  key={p}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr",
                    alignItems: "center",
                    padding: "14px 24px",
                    borderBottom: isLast
                      ? "none"
                      : "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', 'Roboto Mono', 'Fira Code', monospace",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.35)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: "rgba(0,0,0,0.75)",
                      lineHeight: 1.45,
                    }}
                  >
                    {p}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/* Local import to keep HeaderToggles colocated even though it lives in
   a separate file. Wrapped here so we can pass days + onChange instead
   of having HeaderToggles own that state internally. */
import { HeaderToggles } from "./HeaderToggles";

function HeaderTogglesContainer({
  days,
  onChangeDays,
}: {
  days: WindowDays;
  onChangeDays: (d: WindowDays) => void;
}) {
  return <HeaderToggles days={days} onChangeDays={onChangeDays} />;
}
