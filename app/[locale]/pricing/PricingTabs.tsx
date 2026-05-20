"use client";

/**
 * PricingTabs — the only client island on the pricing page.
 *
 * The pricing content itself (cards, feature grid, FAQ) is server-
 * rendered in PricingContent so crawlers and AI bots see every price
 * and plan in the static HTML. This component only owns the Brands /
 * Agencies tab interaction:
 *
 *   - both panels are always present in the DOM (server-rendered);
 *     this component toggles visibility, so nothing is hidden from
 *     non-JS parsers
 *   - the active tab is mirrored to the URL (?tier=agencies) for
 *     deep-linking and browser back/forward
 *
 * Panels are passed as props from the server component.
 */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Tab = "brands" | "agencies";

export default function PricingTabs({
  tabsLabel,
  brandsLabel,
  agenciesLabel,
  brandsPanel,
  agenciesPanel,
  agencyCta,
}: {
  tabsLabel: string;
  brandsLabel: string;
  agenciesLabel: string;
  brandsPanel: React.ReactNode;
  agenciesPanel: React.ReactNode;
  agencyCta: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab: Tab =
    searchParams.get("tier") === "agencies" ? "agencies" : "brands";
  const [tab, setTab] = useState<Tab>(initialTab);

  // Keep state in sync if the URL changes externally (back/forward).
  useEffect(() => {
    setTab(searchParams.get("tier") === "agencies" ? "agencies" : "brands");
  }, [searchParams]);

  const selectTab = (next: Tab) => {
    setTab(next);
    router.replace(next === "agencies" ? "/pricing?tier=agencies" : "/pricing", {
      scroll: false,
    });
  };

  return (
    <>
      <div className="text-center mb-12">
        <div
          role="tablist"
          aria-label={tabsLabel}
          className="inline-flex items-center bg-white"
          style={{
            padding: 4,
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 8,
            gap: 2,
          }}
        >
          {(
            [
              { id: "brands" as const, label: brandsLabel },
              { id: "agencies" as const, label: agenciesLabel },
            ]
          ).map((tabItem) => {
            const active = tab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(tabItem.id)}
                className="transition-colors"
                style={{
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 6,
                  color: active ? "#fff" : "rgba(0,0,0,0.55)",
                  background: active ? "var(--accent)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                {tabItem.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Both panels live in the DOM; the inactive one is hidden. Crawlers
          and AI bots receive both, fully server-rendered. */}
      <div role="tabpanel" hidden={tab !== "brands"}>
        {brandsPanel}
      </div>
      <div role="tabpanel" hidden={tab !== "agencies"}>
        {agenciesPanel}
      </div>

      {/* Agency CTA — same toggle, only meaningful on the Agencies tab. */}
      <div hidden={tab !== "agencies"}>{agencyCta}</div>
    </>
  );
}
