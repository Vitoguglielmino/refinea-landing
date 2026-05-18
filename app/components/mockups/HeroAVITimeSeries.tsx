/**
 * PlatformOverviewReplica
 * ────────────────────────────────────────────────────────────────────────
 * Static visual replica of the Refinea platform's /home/[website]/overview
 * page (top-of-fold). Replicates the real components below by copying their
 * inline styles verbatim from the platform source:
 *
 *   - OverviewMetrics (sticky Liquid Glass nav bar + section header)
 *   - KpiCard (white surface wrapper, border 1px, radius 6, padding 22)
 *   - AviLeaderboard (3:1 flex layout, hero metric, SVG line chart,
 *     ranked competitors panel with rank header + carousel tabs)
 *
 * Data: Gucci + luxury fashion competitors. All numbers + chart series are
 * fabricated but plausible for the category. No API calls, no Redux, no
 * interactivity — pure presentation.
 *
 * Source files used as ground truth:
 *   /tmp/platform-reference/src/lib/theme.ts
 *   /tmp/platform-reference/src/components/home/KpiCard.tsx
 *   /tmp/platform-reference/src/components/home/AviLeaderboard.tsx
 *   /tmp/platform-reference/src/components/home/RankedCompetitorsPanel.tsx
 *   /tmp/platform-reference/src/components/home/OverviewMetrics.tsx
 *   /tmp/platform-reference/src/components/ds/ModelsToggle.tsx
 *   /tmp/platform-reference/src/components/ds/LayerScopeToggle.tsx
 *   /tmp/platform-reference/src/components/ds/TimeRangeSelect.tsx
 */

/* ─── Platform theme tokens (copied verbatim from /lib/theme.ts) ─────── */
const brand = {
  color: "#6c47ff",
  text: "rgba(0,0,0,0.75)",
  muted: "rgba(0,0,0,0.5)",
  border: "rgba(0,0,0,0.06)",
  bg: "#ffffff",
  subtle: "#f5f6f7",
  accentSoft: "rgba(108,71,255,0.08)",
  accentBorder: "rgba(108,71,255,0.15)",
} as const;

const MONO =
  "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', 'Roboto Mono', 'Fira Code', monospace";

/* ─── Chart geometry (matches AviLeaderboard.tsx exactly: W=520, H=220) ─ */
const W = 520;
const H = 220;
const PAD = { l: 48, r: 16, t: 20, b: 32 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;

const Y_MAX = 0.55;
const Y_TICKS = [0, 0.1375, 0.275, 0.4125, 0.55];

/* ─── Time series generation (deterministic seeded random) ──────────── */
type Point = { x: number; y: number };
const DAYS = 90;

function makeSeries(start: number, end: number, jitter: number, seed: number): Point[] {
  const out: Point[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < DAYS; i++) {
    const t = i / (DAYS - 1);
    const eased = t * t * (3 - 2 * t);
    const base = start + (end - start) * eased;
    const noise = (rand() - 0.5) * 2 * jitter;
    out.push({ x: i, y: Math.max(0, Math.min(Y_MAX * 0.95, base + noise)) });
  }
  return out;
}

const GUCCI = makeSeries(0.28, 0.464, 0.018, 7);
const LV    = makeSeries(0.35, 0.307, 0.014, 13);
const PRADA = makeSeries(0.20, 0.186, 0.010, 23);
const DIOR  = makeSeries(0.135, 0.122, 0.008, 31);

// Pin last points to match leaderboard final values
GUCCI[DAYS - 1].y = 0.464;
LV[DAYS - 1].y    = 0.307;
PRADA[DAYS - 1].y = 0.186;
DIOR[DAYS - 1].y  = 0.122;

const sx = (i: number) => PAD.l + (i / (DAYS - 1)) * plotW;
const sy = (y: number) => PAD.t + (1 - y / Y_MAX) * plotH;

function toPath(points: Point[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
    .join(" ");
}

const X_TICKS: { i: number; label: string }[] = [
  { i: 0,  label: "Feb 13" },
  { i: 22, label: "Mar 7" },
  { i: 45, label: "Mar 30" },
  { i: 67, label: "Apr 21" },
  { i: 89, label: "May 13" },
];

/* ─── Competitor color palette (matches AviLeaderboard PALETTE) ───────── */
const PALETTE = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F"];

/* ─── Ranked competitors data (Gucci + luxury fashion) ───────────────── */
type RankEntry = {
  name: string;
  domain: string;
  initials: string;
  value: number;     // 0-1
  delta: number | null; // pp change
  color: string;
  isTarget: boolean;
};

const RANK_IDENTIFIED: RankEntry[] = [
  { name: "Gucci",          domain: "gucci.com",          initials: "G",  value: 0.464, delta: 12.3, color: brand.color, isTarget: true  },
  { name: "Louis Vuitton",  domain: "louisvuitton.com",   initials: "LV", value: 0.307, delta: -4.2, color: PALETTE[0],  isTarget: false },
  { name: "Prada",          domain: "prada.com",          initials: "P",  value: 0.186, delta: -1.8, color: PALETTE[1],  isTarget: false },
  { name: "Dior",           domain: "dior.com",           initials: "D",  value: 0.122, delta: -0.9, color: PALETTE[2],  isTarget: false },
  { name: "Saint Laurent",  domain: "ysl.com",            initials: "SL", value: 0.115, delta: 0.4,  color: PALETTE[3],  isTarget: false },
];

/* ─── Triangle delta indicator (copied from AviLeaderboard) ──────────── */
function DeltaTriangle({ delta, size = 10 }: { delta: number | null; size?: number }) {
  if (delta === null) return null;
  const color = delta >= 0 ? "#2d8a56" : "#c0392b";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      style={{ transform: delta < 0 ? "rotate(180deg)" : "none", color, display: "inline-block" }}
    >
      <path d="M5 1.5L8.5 6.5H1.5L5 1.5Z" fill="currentColor" />
    </svg>
  );
}

/* ─── BrandIcon ─── uses real favicons via DuckDuckGo */
import { Favicon } from "./Favicon";

/* ─── Trigger button (matches ModelsToggle/LayerScopeToggle/TimeRangeSelect closed state) ── */
function TriggerButton({ label, filtered = false }: { label: string; filtered?: boolean }) {
  return (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px",
        fontSize: 14,
        fontWeight: 500,
        fontFamily: "inherit",
        color: brand.text,
        background: brand.bg,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: filtered ? brand.color : brand.border,
        borderRadius: 6,
        cursor: "default",
        whiteSpace: "nowrap",
        lineHeight: 1.2,
        outline: "none",
        boxShadow: filtered ? `0 0 0 1.5px ${brand.accentSoft}` : "none",
      }}
    >
      <span>{label}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5 }}>
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ─── Ranked row (matches RankedCompetitorsPanel.tsx Row exactly) ────── */
function RankedRow({ entry, rank }: { entry: RankEntry; rank: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 6,
        background: entry.isTarget ? brand.accentSoft : "transparent",
        cursor: "default",
        flex: 1,
        minHeight: 36,
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11,
          fontWeight: 500,
          color: "rgba(0,0,0,0.25)",
          width: 18,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {rank}
      </span>
      <Favicon domain={entry.domain} initials={entry.initials} color={entry.color} isOwner={entry.isTarget} />
      <span
        style={{
          flex: 1,
          fontSize: 13,
          fontWeight: entry.isTarget ? 600 : 500,
          color: brand.text,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {entry.name}
        {entry.isTarget && (
          <span
            style={{
              marginLeft: 4,
              fontSize: 9,
              fontWeight: 700,
              color: brand.color,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            you
          </span>
        )}
      </span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 13,
          fontWeight: 600,
          color: brand.text,
          flexShrink: 0,
        }}
      >
        {(entry.value * 100).toFixed(1)}%
      </span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11,
          fontWeight: 500,
          flexShrink: 0,
          minWidth: 44,
          textAlign: "right",
          color: entry.delta === null ? "rgba(0,0,0,0.2)" : entry.delta >= 0 ? "#2d8a56" : "#c0392b",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 3,
        }}
      >
        {entry.delta !== null && <DeltaTriangle delta={entry.delta} size={8} />}
        {entry.delta === null
          ? ""
          : `${entry.delta >= 0 ? "+" : ""}${entry.delta.toFixed(1)}%`}
      </span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function PlatformOverviewReplica() {
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
      {/* ── Overview page content (matches OverviewMetrics.tsx layout) ── */}
      <div style={{ padding: "0 32px 24px", background: brand.subtle }}>
        {/* Liquid Glass nav bar — exactly as in OverviewMetrics.tsx line 1364-1428 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "0 -32px",
            padding: "14px 32px 12px",
            minHeight: 60,
            background: "rgba(245,246,247,0.72)",
            backdropFilter: "blur(20px) saturate(1.4)",
            borderBottom: "0.5px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 12px rgba(0,0,0,0.03)",
            marginBottom: 24,
          }}
        >
          {/* Left: brand favicon + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Favicon domain="gucci.com" initials="G" color="#000" size={26} />
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: brand.text,
                letterSpacing: "-0.02em",
              }}
            >
              Gucci
            </span>
          </div>

          {/* Right: filter triggers (static closed state) */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <TriggerButton label="All Models" />
            <TriggerButton label="Generic Only" filtered />
            <TriggerButton label="Last 90 Days" />
          </div>
        </div>

        {/* Section header — matches OverviewMetrics.tsx line 1431-1439 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: brand.text,
              letterSpacing: "-0.02em",
            }}
          >
            AI Visibility Index
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 500,
              color: "rgba(0,0,0,0.35)",
              letterSpacing: "-0.01em",
            }}
          >
            Mapping Gucci&apos;s influence on AI-Decision Makers
          </p>
        </div>

        {/* KpiCard wrapper — matches KpiCard.tsx */}
        <section
          style={{
            background: brand.bg,
            border: `1px solid ${brand.border}`,
            borderRadius: 6,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* ── AviLeaderboard internal layout — matches AviLeaderboard.tsx line 1247+ ── */}
          <div style={{ display: "flex", gap: 0, minHeight: 320 }}>
            {/* ── LEFT: hero metric + chart ── */}
            <div style={{ flex: 3, display: "flex", flexDirection: "column", minWidth: 0 }}>
              {/* Hero metric */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  paddingLeft: "5%",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(0,0,0,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    AI Visibility Index
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "1px solid rgba(0,0,0,0.15)",
                      color: "rgba(0,0,0,0.35)",
                      fontSize: 9,
                      fontWeight: 600,
                    }}
                  >
                    ?
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 32,
                      fontWeight: 700,
                      color: brand.text,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    46.4%
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#2d8a56",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <DeltaTriangle delta={12.3} />
                    +12.3%
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div style={{ position: "relative" }}>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  width="100%"
                  style={{ display: "block", overflow: "visible" }}
                >
                  {/* Y gridlines (dashed) */}
                  {Y_TICKS.map((t, i) => (
                    <line
                      key={`yg-${i}`}
                      x1={PAD.l - 4}
                      x2={W - PAD.r}
                      y1={sy(t)}
                      y2={sy(t)}
                      stroke="rgba(0,0,0,0.06)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {/* Y labels */}
                  {Y_TICKS.map((t, i) => (
                    <text
                      key={`yl-${i}`}
                      x={PAD.l - 8}
                      y={sy(t) + 4}
                      textAnchor="end"
                      fontSize={10}
                      fontWeight="400"
                      fill="rgba(0,0,0,0.3)"
                      fontFamily={MONO}
                    >
                      {(t * 100).toFixed(0)}%
                    </text>
                  ))}
                  {/* X labels */}
                  {X_TICKS.map((tk, i) => (
                    <text
                      key={`xl-${i}`}
                      x={sx(tk.i)}
                      y={H - 6}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight="400"
                      fill="rgba(0,0,0,0.3)"
                      fontFamily={MONO}
                    >
                      {tk.label}
                    </text>
                  ))}

                  {/* Competitor lines — no dots */}
                  {[
                    { series: LV,    color: PALETTE[0] },
                    { series: PRADA, color: PALETTE[1] },
                    { series: DIOR,  color: PALETTE[2] },
                  ].map(({ series, color }) => (
                    <path
                      key={color}
                      d={toPath(series)}
                      fill="none"
                      stroke={color}
                      strokeWidth={1}
                      opacity={0.9}
                    />
                  ))}

                  {/* Brand line — no dots */}
                  <path d={toPath(GUCCI)} fill="none" stroke={brand.color} strokeWidth={2} />
                </svg>
              </div>

              {/* Tracking since */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "6px 0 0 4px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(0,0,0,0.25)",
                    fontFamily: MONO,
                    fontWeight: 400,
                  }}
                >
                  Tracking since Feb 13
                </span>
              </div>
            </div>

            {/* ── Divider — matches AviLeaderboard line 1460 ── */}
            <div
              style={{
                width: 1,
                background: brand.border,
                margin: "0 16px",
                flexShrink: 0,
              }}
            />

            {/* ── RIGHT: RankedCompetitorsPanel — matches its line 231+ ── */}
            <div
              style={{
                flex: "0 0 300px",
                display: "flex",
                flexDirection: "column",
                minWidth: 300,
              }}
            >
              {/* Rank hero */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginBottom: 16,
                  paddingLeft: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(0,0,0,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Your Rank
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 32,
                      fontWeight: 700,
                      color: brand.text,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    #1
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#2d8a56",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <DeltaTriangle delta={1} />
                    +1
                  </span>
                </div>
              </div>

              {/* Carousel tabs (Identified · Comparable) */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginBottom: 8,
                  paddingLeft: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: brand.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "4px 8px",
                    background: brand.accentSoft,
                    borderRadius: 4,
                  }}
                >
                  Identified
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "4px 8px",
                  }}
                >
                  Comparable
                </span>
              </div>

              {/* Ranked rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {RANK_IDENTIFIED.map((entry, i) => (
                  <RankedRow key={entry.name} entry={entry} rank={i + 1} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
