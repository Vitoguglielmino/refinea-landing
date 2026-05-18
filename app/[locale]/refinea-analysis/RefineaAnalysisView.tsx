"use client";

/**
 * RefineaAnalysisView — interactive wrapper around the AVI observatory.
 *
 * Holds two pieces of state:
 *   - `slug`  → which industry is currently selected
 *   - `days`  → window size (7 / 30 / 90)
 *
 * Each combination is one fetch to `/api/avi`, server-cached for 24h
 * on Vercel's edge. Initial render is hydrated from the SSR-fetched
 * `initial` prop so the first paint is instant and SEO-friendly.
 *
 * IndustrySection (the leaderboard + chart + prompts block) stays
 * presentational and just re-renders with the new `data` whenever the
 * fetch resolves.
 */
import { useEffect, useRef, useState, useTransition } from "react";
import type { AviResponse } from "@/lib/marketing-api";
import { INDUSTRIES, getIndustry } from "@/lib/industries";
import { IndustrySection } from "./IndustrySection";

export type WindowDays = 7 | 30 | 90;

export function RefineaAnalysisView({
  initial,
  locale,
  toggleLabel,
  ariaLabel,
  comingSoonLabel,
  soonBadgeLabel,
  industryLabels,
}: {
  initial: AviResponse;
  locale: string;
  /** Pre-resolved translations passed in so this client component
   *  doesn't need its own i18n provider lookup. */
  toggleLabel: string;
  ariaLabel: string;
  comingSoonLabel: string;
  soonBadgeLabel: string;
  /** slug → human-readable industry name, pre-resolved via i18n. */
  industryLabels: Record<string, string>;
}) {
  const [slug, setSlug] = useState(initial.slug);
  const [days, setDays] = useState<WindowDays>(
    (initial.window_days as WindowDays) ?? 7,
  );
  const [data, setData] = useState<AviResponse>(initial);
  const [isPending, startTransition] = useTransition();

  // Track which `(slug, days)` we already showed so the first effect
  // doesn't refetch the initial combination served by SSR.
  const seedKey = `${initial.slug}::${initial.window_days}`;
  const currentKey = `${slug}::${days}`;
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      if (currentKey === seedKey) return; // skip the no-op initial fetch
    }
    let aborted = false;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/avi?slug=${slug}&days=${days}`, {
          // Browser cache off; the route handler caches on the edge.
          cache: "no-store",
        });
        if (!res.ok) {
          console.error("[avi-view] fetch failed:", await res.text());
          return;
        }
        const next = (await res.json()) as AviResponse;
        if (!aborted) setData(next);
      } catch (err) {
        if (!aborted) console.error("[avi-view] fetch error:", err);
      }
    });
    return () => {
      aborted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, days]);

  return (
    <>
      {/* Industry toggle */}
      <div className="mb-10 md:mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 mb-4 font-mono">
          {toggleLabel}
        </p>
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="flex flex-wrap items-center gap-2.5"
        >
          {INDUSTRIES.map((ind) => {
            if (ind.status === "coming-soon") {
              return (
                <span
                  key={ind.slug}
                  role="tab"
                  aria-disabled="true"
                  aria-selected="false"
                  className="inline-flex items-center select-none"
                  style={{
                    gap: 8,
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.35)",
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 8,
                    whiteSpace: "nowrap",
                    cursor: "not-allowed",
                    lineHeight: 1.2,
                  }}
                >
                  {comingSoonLabel}
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: "rgba(0,0,0,0.05)",
                      color: "rgba(0,0,0,0.45)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {soonBadgeLabel}
                  </span>
                </span>
              );
            }
            const active = ind.slug === slug;
            const label = industryLabels[ind.slug] ?? ind.slug;
            return (
              <button
                key={ind.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSlug(ind.slug)}
                className="transition-colors"
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 8,
                  color: active ? "#fff" : "rgba(0,0,0,0.65)",
                  background: active ? "var(--accent)" : "#ffffff",
                  border: active
                    ? "1px solid transparent"
                    : "1px solid rgba(0,0,0,0.08)",
                  cursor: active ? "default" : "pointer",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  opacity: isPending && !active ? 0.6 : 1,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <IndustrySection
        data={data}
        locale={locale}
        days={days}
        onChangeDays={setDays}
        isLoading={isPending}
        samplePrompts={getIndustry(slug)?.samplePrompts ?? []}
        industryName={industryLabels[slug] ?? data.display_name}
      />
    </>
  );
}

