"use client";

/**
 * MetricTooltip — replicates the platform's <MetricTooltip metricId="avi"/>
 * (see /tmp/platform-reference/src/components/ds/MetricTooltip.tsx) without
 * pulling in Radix as a dependency. Tiny client component, isolated so
 * AviIndexCard can stay a server component except for this one button.
 *
 * Trigger: 18×18 button with the same ⓘ glyph (lucide-style stroked icon).
 * Popover: white-glass card with title, definition, formula, example —
 * matches the platform's tooltip surface byte-for-byte.
 */
import { useId, useState } from "react";

const SURFACE = "rgba(255, 255, 255, 0.96)";

export type MetricInfo = {
  title: string;
  definition: string;
  formula?: string;
  example?: string;
};

export function MetricTooltip({ info }: { info: MetricInfo }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label={`About ${info.title}`}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 18,
          height: 18,
          padding: 0,
          border: "none",
          background: "transparent",
          color: open ? "#6c47ff" : "rgba(0,0,0,0.5)",
          cursor: "help",
          borderRadius: "50%",
          transition: "color 120ms ease",
        }}
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>

      {open && (
        <div
          id={id}
          role="tooltip"
          style={{
            position: "absolute",
            // Opens BELOW the trigger so it never gets clipped by the
            // card header's `border-top` and stays inside the page flow.
            top: "calc(100% + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 240,
            padding: 12,
            backgroundColor: SURFACE,
            backdropFilter: "blur(16px) saturate(1.8)",
            WebkitBackdropFilter: "blur(16px) saturate(1.8)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            borderRadius: 6,
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.06), 0 2px 5px rgba(0,0,0,0.03)",
            zIndex: 2000,
            animation: "metricTooltipIn 150ms cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "top center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(0,0,0,0.3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            {info.title}
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "rgba(0,0,0,0.8)",
              lineHeight: 1.45,
              marginBottom: info.formula || info.example ? 10 : 0,
            }}
          >
            {info.definition}
          </div>

          {(info.formula || info.example) && (
            <div
              style={{
                paddingTop: 8,
                borderTop: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              {info.formula && (
                <code
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', 'Roboto Mono', 'Fira Code', monospace",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#6c47ff",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                    display: "block",
                  }}
                >
                  {info.formula}
                </code>
              )}
              {info.example && (
                <div
                  style={{
                    fontSize: 10,
                    fontStyle: "italic",
                    color: "rgba(0,0,0,0.5)",
                    lineHeight: 1.3,
                    marginTop: info.formula ? 4 : 0,
                  }}
                >
                  {info.example}
                </div>
              )}
            </div>
          )}

          {/* Tooltip arrow — small triangle pointing UP toward the ⓘ
              trigger (since the tooltip now opens below the icon). */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: `6px solid ${SURFACE}`,
              filter: "drop-shadow(0 -1px 1px rgba(0,0,0,0.04))",
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes metricTooltipIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.99); }
          to   { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </span>
  );
}

/** Content for `metricId="avi"` — copied verbatim from the platform's
 *  METRIC_LIBRARY (see /tmp/platform-reference/src/constants/metrics.ts).
 *  Public-facing language stays identical so users coming from the
 *  product feel at home. */
export const AVI_METRIC_INFO: MetricInfo = {
  title: "AI Visibility Index (AVI)",
  definition:
    "Measures how often a brand is present in AI responses relative to total query volume.",
  formula: "AVI = (Brand Mentions / Total Responses) * 100",
  example:
    "Example: If a brand is mentioned in 40 responses out of 100, its AVI is 40% (40/100).",
};
