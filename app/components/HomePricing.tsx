/**
 * HomePricing
 * ────────────────────────────────────────────────────────────────────────
 * Pricing section of the marketing homepage. Lives in a dedicated client
 * file because it needs `useState` for the monthly/yearly toggle and
 * animated price transitions. page.tsx stays a server component.
 *
 * Two plans (Lite / Pro). One shared toggle "Billed yearly" gives 3 months
 * free — i.e. pay for 9 months instead of 12. Yearly mode shows the
 * "effective monthly" price (annual / 12) with a small "Billed annually"
 * caption underneath.
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Favicon } from "./mockups/Favicon";

const MONTHLY = { lite: 129, pro: 299 } as const;

// Yearly = 9 months of price (3 months free). Effective monthly shown to user.
const YEARLY_EFFECTIVE = {
  lite: Math.round((MONTHLY.lite * 9) / 12),
  pro: Math.round((MONTHLY.pro * 9) / 12),
};
const YEARLY_TOTAL = {
  lite: MONTHLY.lite * 9,
  pro: MONTHLY.pro * 9,
};

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

/* ─── Animated price ─── crossfade + tiny slide when value changes */
function AnimatedPrice({ value }: { value: number }) {
  return (
    <span className="relative inline-block tabular-nums" style={{ minWidth: "3ch" }}>
      <span
        key={value}
        style={{
          display: "inline-block",
          animation: "priceFade 280ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        €{value}
      </span>
      <style>{`
        @keyframes priceFade {
          0%   { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}

/* ─── Toggle ─── billed monthly / billed yearly */
function BillingToggle({
  yearly,
  onChange,
  monthlyLabel,
  yearlyLabel,
  badgeLabel,
}: {
  yearly: boolean;
  onChange: (v: boolean) => void;
  monthlyLabel: string;
  yearlyLabel: string;
  badgeLabel: string;
}) {
  return (
    <div
      className="inline-flex items-center bg-white"
      style={{
        padding: 4,
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 8,
        gap: 2,
      }}
    >
      <button
        type="button"
        onClick={() => onChange(false)}
        className="transition-colors"
        style={{
          padding: "7px 14px",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 6,
          color: !yearly ? "#fff" : "rgba(0,0,0,0.55)",
          background: !yearly ? "var(--accent)" : "transparent",
          border: "none",
          cursor: "pointer",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {monthlyLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className="transition-colors"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 6,
          color: yearly ? "#fff" : "rgba(0,0,0,0.55)",
          background: yearly ? "var(--accent)" : "transparent",
          border: "none",
          cursor: "pointer",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {yearlyLabel}
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: 4,
            background: yearly ? "rgba(255,255,255,0.18)" : "rgba(16,185,129,0.12)",
            color: yearly ? "#fff" : "#059669",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {badgeLabel}
        </span>
      </button>
    </div>
  );
}

/* ─── AI model icons row ─── */
function ModelIcons({
  withAiOverviews = false,
  aiOverviewsLabel = "AI Overviews",
}: {
  withAiOverviews?: boolean;
  aiOverviewsLabel?: string;
}) {
  const models = [
    { domain: "chat.openai.com", label: "ChatGPT" },
    { domain: "perplexity.ai",   label: "Perplexity" },
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
            <Favicon
              domain="google.com"
              initials="G"
              color="#000"
              size={14}
            />
            {aiOverviewsLabel}
          </span>
        </>
      )}
    </div>
  );
}

/* ─── Section ─── */
export default function HomePricing() {
  const t = useTranslations("pricing");
  const [yearly, setYearly] = useState(false);

  const litePrice = yearly ? YEARLY_EFFECTIVE.lite : MONTHLY.lite;
  const proPrice  = yearly ? YEARLY_EFFECTIVE.pro  : MONTHLY.pro;

  return (
    <section id="pricing" className="section-lines py-10 md:py-14 scroll-mt-20">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto mb-12">
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
            {t("overline")}
          </div>
          <h2 className="text-black mb-5">
            {t("title")}
          </h2>
          <p className="text-black/60 text-lg leading-relaxed max-w-[560px] mx-auto mb-8">
            {t("subtitle")}
          </p>

          <BillingToggle
            yearly={yearly}
            onChange={setYearly}
            monthlyLabel={t("toggleMonthly")}
            yearlyLabel={t("toggleYearly")}
            badgeLabel={t("yearlyBadge")}
          />
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[920px] mx-auto">
          {/* ── LITE ── */}
          <article
            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col"
            style={{
              border: "1px solid rgba(0,0,0,0.09)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-black tracking-tight">{t("lite.name")}</h3>
              </div>
              <p className="text-sm text-black/55">
                {t("lite.tagline")}
              </p>
            </div>

            <div className="mb-1">
              <span className="text-4xl font-bold text-black tracking-tight">
                <AnimatedPrice value={litePrice} />
              </span>
              <span className="text-sm text-black/50 ml-1">{t("perMonth")}</span>
            </div>
            <p className="text-xs text-black/40 h-4 mb-7">
              {yearly ? t("billedAnnually", { total: YEARLY_TOTAL.lite }) : " "}
            </p>

            <a
              href="https://platform.refinea.io"
              className="inline-flex items-center justify-center bg-white hover:border-black/15 transition-colors mb-7"
              style={{
                minHeight: 48,
                padding: "12px 22px",
                fontSize: 15,
                fontWeight: 500,
                color: "rgba(0,0,0,0.75)",
                border: "1px solid rgba(0,0,0,0.09)",
                borderRadius: 8,
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

          {/* ── PRO (highlighted) ── */}
          <article
            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col relative"
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
              <span className="text-4xl font-bold text-black tracking-tight">
                <AnimatedPrice value={proPrice} />
              </span>
              <span className="text-sm text-black/50 ml-1">{t("perMonth")}</span>
            </div>
            <p className="text-xs text-black/40 h-4 mb-7">
              {yearly ? t("billedAnnually", { total: YEARLY_TOTAL.pro }) : " "}
            </p>

            <a
              href="https://platform.refinea.io"
              className="inline-flex items-center justify-center text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all mb-7"
              style={{
                minHeight: 48,
                padding: "12px 22px",
                fontSize: 15,
                fontWeight: 500,
                border: "1px solid transparent",
                borderRadius: 8,
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
                <ModelIcons withAiOverviews aiOverviewsLabel={t("aiOverviewsLabel")} />
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

        {/* Custom plan footnote */}
        <p className="text-center mt-10 text-sm font-semibold text-black/70">
          {t("footnotePrefix")}{" "}
          <a
            href="https://calendly.com/vito-guglielmino-refinea/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {t("footnoteLink")}
          </a>{" "}
          {t("footnoteSuffix")}
        </p>
      </div>
    </section>
  );
}
