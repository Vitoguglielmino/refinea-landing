/**
 * PlatformInsights
 * ────────────────────────────────────────────────────────────────────────
 * Static replica of the Refinea platform's Actionable Insights list.
 *
 * Source files used as ground truth:
 *   /tmp/platform-reference/src/components/home/InsightCard.tsx
 *     - SEVERITY_CONFIG (line 15-47)
 *     - CATEGORY_CONFIG + CATEGORY_ICONS (line 49-84)
 *     - CONFIDENCE_CONFIG (line 88-110)
 *     - Compact table row layout (line 637-770)
 *
 * Data: Gucci insights. Fabricated but plausible.
 */

const brand = {
  color: "#6c47ff",
  text: "rgba(0,0,0,0.75)",
  muted: "rgba(0,0,0,0.5)",
  border: "rgba(0,0,0,0.06)",
  bg: "#ffffff",
  subtle: "#f5f6f7",
  accentSoft: "rgba(108,71,255,0.08)",
} as const;

const MONO =
  "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', 'Roboto Mono', 'Fira Code', monospace";

/* ─── Severity config (verbatim from InsightCard.tsx line 15-47) ─────── */
const SEVERITY: Record<string, { label: string; dot: string; bg: string; color: string; border: string }> = {
  high:     { label: "High",     dot: "#d97706", bg: "rgba(245,158,11,0.08)",  color: "#d97706", border: "rgba(245,158,11,0.18)" },
  medium:   { label: "Medium",   dot: "#a16207", bg: "rgba(234,179,8,0.08)",   color: "#a16207", border: "rgba(234,179,8,0.18)" },
  positive: { label: "Positive", dot: "#059669", bg: "rgba(16,185,129,0.08)",  color: "#059669", border: "rgba(16,185,129,0.18)" },
};

const CATEGORY: Record<string, { label: string }> = {
  visibility:  { label: "Visibility"  },
  competitive: { label: "Competitive" },
  content:     { label: "Content"     },
  gsc_ga4:     { label: "Google Data" },
};

const CONFIDENCE: Record<string, { label: string; bg: string; color: string; border: string }> = {
  low:    { label: "Early Signal",  bg: "rgba(245,158,11,0.08)",  color: "#d97706", border: "rgba(245,158,11,0.18)" },
  medium: { label: "Confirmed",     bg: "rgba(59,130,246,0.08)",  color: "#2563eb", border: "rgba(59,130,246,0.18)" },
  high:   { label: "Strong Signal", bg: "rgba(16,185,129,0.08)",  color: "#059669", border: "rgba(16,185,129,0.18)" },
};

/* ─── Category icons (copied from CATEGORY_ICONS) ──────────────────── */
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  visibility: (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  competitive: (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  content: (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="1.5" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 5h6M5 8h6M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  gsc_ga4: (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="9" width="3" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="6.5" y="5" width="3" height="9.5" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11.5" y="1.5" width="3" height="13" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
};

/* ─── Gucci insights data (fabricated) ─────────────────────────────── */
type Insight = {
  title: string;
  severity: keyof typeof SEVERITY;
  category: keyof typeof CATEGORY;
  confidence: keyof typeof CONFIDENCE;
  metric: string;
  metricLabel: string;
  trend: "up" | "down" | null;
  status: "open" | "resolved";
};

const INSIGHTS: Insight[] = [
  {
    title: "Louis Vuitton dominates 12 buyer-intent queries on ChatGPT",
    severity: "high",
    category: "competitive",
    confidence: "high",
    metric: "84",
    metricLabel: "Mentions",
    trend: "up",
    status: "open",
  },
  {
    title: "Vogue articles cite Gucci 3× more than gucci.com itself",
    severity: "medium",
    category: "visibility",
    confidence: "medium",
    metric: "368K",
    metricLabel: "Monthly Impressions",
    trend: "up",
    status: "open",
  },
  {
    title: "Missing FAQ schema on 8 product pages limits AI parsing",
    severity: "high",
    category: "content",
    confidence: "low",
    metric: "8",
    metricLabel: "Pages affected",
    trend: null,
    status: "open",
  },
  {
    title: "Organic CTR dropping on \"gucci handbags\" SERP, AIO is taking clicks",
    severity: "medium",
    category: "gsc_ga4",
    confidence: "medium",
    metric: "-22%",
    metricLabel: "CTR change",
    trend: "down",
    status: "open",
  },
  {
    title: "Gucci ranks #1 on Perplexity for sustainable luxury queries",
    severity: "positive",
    category: "visibility",
    confidence: "high",
    metric: "+18%",
    metricLabel: "Share of Voice",
    trend: "up",
    status: "resolved",
  },
];

/* ─── Trend arrow ──────────────────────────────────────────────────── */
function TrendArrow({ direction }: { direction: "up" | "down" | null }) {
  if (!direction) return null;
  const isUp = direction === "up";
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      style={{ transform: isUp ? "none" : "rotate(180deg)", color: isUp ? "#059669" : "#dc2626" }}
    >
      <path d="M5 1.5L8.5 6.5H1.5L5 1.5Z" fill="currentColor" />
    </svg>
  );
}

/* ─── Main mockup ──────────────────────────────────────────────────── */
export default function PlatformInsights() {
  return (
    <div
      style={{
        background: brand.subtle,
        borderRadius: 12,
        border: `1px solid ${brand.border}`,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      }}
    >
      <div style={{ padding: "24px 32px", background: brand.subtle }}>
        {/* Section header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: brand.text, letterSpacing: "-0.02em" }}>
            Refinea Actionable Insights
          </h2>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.35)", letterSpacing: "-0.01em" }}>
            Opportunities, risks and gaps for Gucci&apos;s AI visibility
          </p>
        </div>

        {/* KpiCard wrapper with insights table */}
        <section
          style={{
            background: brand.bg,
            border: `1px solid ${brand.border}`,
            borderRadius: 6,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.015)" }}>
                <th style={th(undefined, "left")}>Insight</th>
                <th style={th(130, "left")}>Category</th>
                <th style={th(150, "left")}>Metric</th>
                <th style={th(150, "left")}>Confidence</th>
                <th style={th(110, "left")}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {INSIGHTS.map((ins, i) => {
                const isResolved = ins.status === "resolved";
                const sev = SEVERITY[ins.severity];
                const cat = CATEGORY[ins.category];
                const conf = CONFIDENCE[ins.confidence];

                if (isResolved) {
                  return (
                    <tr key={i} style={{ background: "rgba(16,185,129,0.04)" }}>
                      <td style={td("rgba(16,185,129,0.15)")}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity: 0.85, minWidth: 0 }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 20,
                              height: 20,
                              borderRadius: 6,
                              background: "rgba(16,185,129,0.12)",
                              flexShrink: 0,
                              fontSize: 11,
                              color: "#059669",
                            }}
                          >
                            ✓
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#059669",
                              lineHeight: 1.3,
                              textDecoration: "line-through",
                              textDecorationColor: "rgba(5,150,105,0.3)",
                            }}
                          >
                            {ins.title}
                          </span>
                        </div>
                      </td>
                      <td style={td("rgba(16,185,129,0.15)")}></td>
                      <td style={td("rgba(16,185,129,0.15)")}></td>
                      <td style={td("rgba(16,185,129,0.15)")}></td>
                      <td style={{ ...td("rgba(16,185,129,0.15)"), textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "rgba(16,185,129,0.08)",
                            color: "#059669",
                            border: "0.5px solid rgba(16,185,129,0.18)",
                          }}
                        >
                          Resolved
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={i}>
                    {/* Title */}
                    <td style={td()}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, minWidth: 0 }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 20,
                            height: 20,
                            borderRadius: 6,
                            background: "rgba(0,0,0,0.03)",
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M3 1L7 5L3 9" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: sev.dot,
                            flexShrink: 0,
                            marginTop: 5,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: brand.text,
                            lineHeight: 1.4,
                            minWidth: 0,
                          }}
                        >
                          {ins.title}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={td()}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "rgba(0,0,0,0.55)",
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(0,0,0,0.04)",
                          border: `0.5px solid ${brand.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {CATEGORY_ICONS[ins.category]}
                        {cat.label}
                      </span>
                    </td>

                    {/* Metric */}
                    <td style={td()}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                        <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: brand.text }}>
                          {ins.metric}
                        </span>
                        <TrendArrow direction={ins.trend} />
                        <span style={{ fontSize: 11, color: brand.muted, overflow: "hidden", textOverflow: "ellipsis" }}>{ins.metricLabel}</span>
                      </div>
                    </td>

                    {/* Confidence */}
                    <td style={td()}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: conf.bg,
                          color: conf.color,
                          border: `0.5px solid ${conf.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conf.label}
                      </span>
                    </td>

                    {/* Severity */}
                    <td style={td()}>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: sev.bg,
                          color: sev.color,
                          border: `0.5px solid ${sev.border}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sev.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

/* ─── Table cell helpers ──────────────────────────────────────────── */
function th(width: number | undefined, align: "left" | "center" | "right" = "left"): React.CSSProperties {
  return {
    width,
    textAlign: align,
    padding: "10px 16px",
    fontSize: 10,
    fontWeight: 700,
    color: "rgba(0,0,0,0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    borderBottom: `1px solid ${brand.border}`,
  };
}

function td(borderColor?: string): React.CSSProperties {
  return {
    padding: "12px 16px",
    fontSize: 13,
    color: brand.text,
    borderBottom: `1px solid ${borderColor || brand.border}`,
    verticalAlign: "middle",
  };
}
