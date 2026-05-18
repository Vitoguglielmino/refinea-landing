"use client";

/**
 * AviIndexCard — vertical layout.
 *
 *  ┌────────────────────────────────────────────────────────────────┐
 *  │  AI VISIBILITY INDEX — leader                                  │
 *  │  37.5%   Aruba                                                 │
 *  │                                                                │
 *  │  ┌────────────────────────────────────────────────────────────┐│
 *  │  │  [ line chart, 5 brands, hover tooltip with date + values ]││
 *  │  └────────────────────────────────────────────────────────────┘│
 *  │  ─ Aruba   ─ TeamSystem   ─ Fatture in Cloud   ─ …             │
 *  │  · Simulated time series · live snapshot only       Last run …│
 *  ├────────────────────────────────────────────────────────────────┤
 *  │  Company                                  Visibility Score     │
 *  │  ─────────────────────────────────────────────────────────────│
 *  │  1  ◆ Aruba                                   37.5%            │
 *  │  2  ◆ TeamSystem                              36.0%            │
 *  │  …                                                             │
 *  └────────────────────────────────────────────────────────────────┘
 *
 * Replicates the platform's AviLeaderboard layout but stacked vertically:
 * chart on top, full-width ranking table below.
 *
 * The chart ALWAYS shows the top 5 brands (leader + 4 competitors). On
 * hover, a tooltip pops up with the snapped date and every visible
 * brand's value at that date, matching the platform's behavior. The full
 * ranking table below the chart is independent and always shows the top
 * 10 brands from the API.
 *
 * The line chart is *simulated*. Our marketing API exposes the daily
 * snapshot only; until it ships historical series we generate a smoothed
 * 90-day curve per brand ending at the live AVI. The "simulated" label
 * in the chart footer keeps this transparent.
 *
 * Client component: hover tooltip requires local state for cursor
 * tracking. The rendered subtree is small (one SVG + two lists) so the
 * JS cost is negligible.
 */
import { useRef, useState } from "react";
import type { AviResponse, LeaderboardRow } from "@/lib/marketing-api";
import { formatDelta, deltaTone } from "@/lib/marketing-api";
import { Favicon } from "../../components/mockups/Favicon";
import { MetricTooltip, AVI_METRIC_INFO } from "./MetricTooltip";

/** Max number of lines the time-series chart can render at once, leader
 *  included. Keeps the chart legible even when the API returns many
 *  competitors — anything beyond this still lives in the ranking table
 *  below. */
const CHART_MAX_BRANDS = 5;

/** Snap distance (in SVG px) for the hover tooltip. Cursor positions
 *  further than this from any data point fall off the tooltip. */
const HOVER_SNAP_PX = 60;

/* ─── Theme tokens (mirror /tmp/platform-reference/src/lib/theme.ts) ── */
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

/* ─── Chart geometry (full-width now, wider than the old 3:1 split) ─── */
const W = 920;
const H = 260;
const PAD = { l: 56, r: 20, t: 20, b: 36 };
const plotW = W - PAD.l - PAD.r;
const plotH = H - PAD.t - PAD.b;
/** Synthetic-series fallback length, used only when the API hasn't
 *  returned a real `series[]` (e.g. early-stage industries with <2 days
 *  of history). When real data is present, the chart uses
 *  `data.series.length` instead. */
const DAYS_FALLBACK = 90;

/* ─── Line palette (top brand uses accent, rest cycle through this) ─── */
const PALETTE = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F",
                 "#EDC948", "#B07AA1", "#FF9DA7", "#9C755F"];

/* ─── Deterministic synthetic time series ──────────────────────────────
   The marketing API returns today's snapshot only; we draw a smoothed
   curve ending at the live AVI so the card matches the platform's
   "AVI over time" visual. Labelled "Simulated" below the chart. */
type Point = { x: number; y: number };

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeSeries(end: number, seed: number, days: number): Point[] {
  const start = end * 0.7;
  const jitter = end * 0.05;
  const rand = seededRand(seed);
  const out: Point[] = [];
  const total = Math.max(2, days);
  for (let i = 0; i < total; i++) {
    const t = i / (total - 1);
    const eased = t * t * (3 - 2 * t);
    const base = start + (end - start) * eased;
    const noise = (rand() - 0.5) * 2 * jitter;
    out.push({ x: i, y: Math.max(0, base + noise) });
  }
  out[total - 1].y = end; // pin to exact live value
  return out;
}

function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Build 5 evenly-spaced x-axis tick positions for a series of `days`
 *  length. The series ends on `endDateIso` (= `last_run_date`). */
function makeXTicks(endDateIso: string, days: number): { i: number; label: string }[] {
  const end = new Date(endDateIso + "T00:00:00Z");
  if (Number.isNaN(end.getTime())) return [];
  const total = Math.max(2, days);
  const ticks: { i: number; label: string }[] = [];
  // 5 ticks: first, ~25%, ~50%, ~75%, last
  const fractions = total <= 5 ? Array.from({ length: total }, (_, i) => i / Math.max(1, total - 1))
                                : [0, 0.25, 0.5, 0.75, 1];
  const seen = new Set<number>();
  for (const f of fractions) {
    const i = Math.round(f * (total - 1));
    if (seen.has(i)) continue;
    seen.add(i);
    const d = new Date(end);
    d.setUTCDate(d.getUTCDate() - (total - 1 - i));
    ticks.push({ i, label: shortDate(d) });
  }
  return ticks;
}

/** Format a single day index (0..days-1) into a short label, used by the
 *  hover tooltip. The last point is the API's `last_run_date`. */
function xTickLabel(i: number, endDateIso: string, days: number): string {
  const end = new Date(endDateIso + "T00:00:00Z");
  if (Number.isNaN(end.getTime())) return String(i);
  const total = Math.max(2, days);
  const d = new Date(end);
  d.setUTCDate(d.getUTCDate() - (total - 1 - i));
  return shortDate(d);
}

/* ─── Brand → favicon domain heuristic ───────────────────────────────── */
function brandDomain(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "");
  const overrides: Record<string, string> = {
    // ── saas-gestionali-italia ──────────────────────────────────────
    teamsystem: "teamsystem.com",
    zucchetti: "zucchetti.it",
    aruba: "aruba.it",
    fatturaincloud: "fattureincloud.it",
    fattureincloud: "fattureincloud.it",
    fiscozen: "fiscozen.it",
    danea: "danea.it",
    // ── fintech-italia ──────────────────────────────────────────────
    // Italian fintech brands use mostly .it TLDs; the generic .com
    // fallback either points to the wrong company (Hype Energy Drinks)
    // or returns no favicon at all (Banca Mediolanum, Poste, etc).
    fineco: "fineco.it",
    finecobank: "fineco.it",
    unicredit: "unicredit.it",
    poste: "poste.it",
    posteitaliane: "poste.it",
    bancamediolanum: "bancamediolanum.it",
    mediolanum: "bancamediolanum.it",
    hype: "hype.it",
  };
  return overrides[slug] ?? `${slug}.com`;
}

function brandInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

type RankEntry = {
  name: string;
  domain: string;
  initials: string;
  avi: number; // 0–100
  mentions: number;
  is_declared: boolean;
  /** Percentage-point delta vs the previous window. Null when no
   *  comparison is possible (early-stage industry, brand absent from
   *  previous window). */
  avi_delta: number | null;
  color: string;
};

function toRankEntries(rows: LeaderboardRow[]): RankEntry[] {
  return rows.map((r, i) => ({
    name: r.brand,
    domain: brandDomain(r.brand),
    initials: brandInitials(r.brand),
    avi: r.avi,
    mentions: r.mentions,
    is_declared: r.is_declared,
    avi_delta: r.avi_delta,
    color: i === 0 ? brand.color : PALETTE[(i - 1) % PALETTE.length],
  }));
}

/* ─── Main card ───────────────────────────────────────────────────────── */
type TooltipState = {
  x: number; // svg-space x of the snapped date
  date: string; // formatted x-axis label
  entries: { name: string; color: string; value: number; isLeader: boolean }[];
};

export function AviIndexCard({
  data,
  isLoading = false,
}: {
  data: AviResponse;
  /** Soft visual dim while a new window/industry is being fetched. */
  isLoading?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const entries = toRankEntries(data.leaderboard);
  const top = entries[0];

  // Chart always shows the top 5 brands (leader + 4 competitors). The
  // ranking table below is unaffected and always shows the full top 10
  // from the API.
  const chartEntries = entries.slice(0, CHART_MAX_BRANDS);

  // Y axis: auto-scaled to the highest AVI among the visible chart
  // brands (not just the leader — also covers the case where a non-top
  // brand spikes mid-window). 15% headroom over the peak, rounded UP
  // to the nearest 5%, floored at 10% (keeps a sane scale on quiet
  // markets), capped at 100% (the theoretical max).
  const chartPeak = Math.max(...chartEntries.map((e) => e.avi / 100), 0);
  const rawMax = chartPeak * 1.15;
  const Y_MAX = Math.min(
    1.0,
    Math.max(0.1, Math.ceil(rawMax * 20) / 20),
  );
  const Y_TICK_COUNT = 4;
  const Y_TICKS = Array.from(
    { length: Y_TICK_COUNT + 1 },
    (_, i) => (Y_MAX * i) / Y_TICK_COUNT,
  );

  // Series sourcing — prefer the real `data.series[]` (one point per
  // UTC day in the requested window). If the API hasn't returned it
  // (early-stage industry, fetch fallback), draw a smoothed synthetic
  // 90-day curve ending on the live AVI so the layout never collapses.
  const realSeries = data.series;
  const hasRealSeries = !!realSeries && realSeries.length >= 2;
  const chartDays = hasRealSeries ? realSeries!.length : DAYS_FALLBACK;

  const sx = (i: number) =>
    PAD.l + (i / Math.max(1, chartDays - 1)) * plotW;
  const sy = (y: number) => PAD.t + (1 - y / Y_MAX) * plotH;

  // Per-brand point arrays. With real data: read `point.brands[name]`
  // for each day (missing key = 0 per LANDING_INTEGRATION.md §3.5).
  // Otherwise the synthetic smooth fallback.
  const series = chartEntries.map((e, idx) => ({
    entry: e,
    points: hasRealSeries
      ? realSeries!.map((p, i) => ({
          x: i,
          y: (p.brands[e.name] ?? 0) / 100,
        }))
      : makeSeries(
          e.avi / 100,
          e.name.charCodeAt(0) * 31 + idx * 7 + 1,
          chartDays,
        ),
  }));

  // ── Hover handlers ────────────────────────────────────────────────
  // On mouse move, snap to the nearest day index and gather every visible
  // brand's value at that day. Mirrors AviLeaderboard.tsx:639+ (the
  // "compare mode" branch — same behavior, just without the toggle since
  // we always render all 5 brands).
  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgP = pt.matrixTransform(ctm.inverse());
    const mx = svgP.x;

    // Snap to nearest x-index on the leader's series (all series share
    // the same x grid).
    let nearestX: number | null = null;
    let nearestDist = Infinity;
    for (const p of series[0].points) {
      const d = Math.abs(sx(p.x) - mx);
      if (d < nearestDist) {
        nearestDist = d;
        nearestX = p.x;
      }
    }
    if (nearestX === null || nearestDist > HOVER_SNAP_PX) {
      setTooltip(null);
      return;
    }
    const xLocked = nearestX;
    const entriesAtX = series
      .map((s, i) => {
        const match = s.points.find((p) => p.x === xLocked);
        return match
          ? {
              name: s.entry.name,
              color: s.entry.color,
              value: match.y,
              isLeader: i === 0,
            }
          : null;
      })
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => b.value - a.value);

    setTooltip({
      x: sx(xLocked),
      // Prefer the real ISO date from the series when available; fall
      // back to the synthetic-grid label.
      date: hasRealSeries
        ? shortDate(new Date(realSeries![xLocked].date + "T00:00:00Z"))
        : xTickLabel(xLocked, data.last_run_date, chartDays),
      entries: entriesAtX,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  const toPath = (points: Point[]) =>
    points
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`,
      )
      .join(" ");

  // When we have real data, label the x-axis with actual ISO dates from
  // the series. Strategy:
  //   • ≤9 points (typical 7d window) → show every day, no thinning
  //   • >9 points (30d / 90d) → step-based sampling targeting ~8 ticks,
  //     always pinning the FIRST and LAST point so today is visible
  // Synthetic mode falls back to the helper that walks back from
  // `last_run_date`.
  const xTicks = hasRealSeries
    ? (() => {
        const total = chartDays;
        const labelAt = (i: number) => ({
          i,
          label: shortDate(new Date(realSeries![i].date + "T00:00:00Z")),
        });

        if (total <= 9) {
          return Array.from({ length: total }, (_, i) => labelAt(i));
        }

        const targetTicks = 8;
        const step = Math.max(1, Math.ceil((total - 1) / (targetTicks - 1)));
        const seen = new Set<number>();
        const out: { i: number; label: string }[] = [];
        for (let i = 0; i < total; i += step) {
          if (seen.has(i)) continue;
          seen.add(i);
          out.push(labelAt(i));
        }
        // Always include the last point so the most recent date is visible.
        if (!seen.has(total - 1)) out.push(labelAt(total - 1));
        return out;
      })()
    : makeXTicks(data.last_run_date, chartDays);

  return (
    <div
      style={{
        background: brand.bg,
        border: `1px solid ${brand.border}`,
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        // No `overflow: hidden` here — would clip the MetricTooltip popover
        // when the user hovers the ⓘ icon. The ranking table below uses
        // its own border-top instead of relying on this container's
        // rounded mask, so the visual seam between chart and table is
        // preserved without sacrificing tooltip positioning.
        opacity: isLoading ? 0.55 : 1,
        transition: "opacity 200ms ease",
      }}
    >
      {/* ═════════════════════ CHART SECTION ═════════════════════ */}
      <div style={{ padding: 24 }}>
        {/* Hero metric — small uppercase "AI VISIBILITY INDEX" label
            with an ⓘ tooltip glyph, then a horizontal row showing the
            top 3 brands with their rank, favicon, and AVI%. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
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
            <MetricTooltip info={AVI_METRIC_INFO} />
          </div>
          {/* Top 3 podium — three equally-wide columns sharing the
              same row height. Within each slot: rank + favicon + name
              on the left, AVI% pinned to the right. Long brand names
              wrap to a second line instead of truncating; `align-items:
              stretch` on the outer grid keeps all three slots the same
              height so the AVI numbers stay on the same baseline. */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              alignItems: "stretch",
              gap: 0,
            }}
          >
            {entries.slice(0, 3).map((e, i) => (
              <div
                key={e.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  paddingLeft: i === 0 ? 0 : 24,
                  paddingRight: i === 2 ? 0 : 24,
                  borderLeft:
                    i === 0 ? "none" : "1px solid rgba(0,0,0,0.08)",
                  minHeight: 64,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.4)",
                    letterSpacing: "-0.01em",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}°
                </span>
                <Favicon
                  domain={e.domain}
                  initials={e.initials}
                  color={e.color}
                  size={28}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontWeight: 600,
                    color: brand.text,
                    letterSpacing: "-0.01em",
                    // Wrap onto a second line when the name is long
                    // (e.g. "Fatture in Cloud") instead of truncating.
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    lineHeight: 1.2,
                    minWidth: 0,
                  }}
                >
                  {e.name}
                </span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 26,
                    fontWeight: 700,
                    color: brand.text,
                    letterSpacing: "-0.03em",
                    flexShrink: 0,
                  }}
                >
                  {e.avi.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart — full width. `position: relative` anchors the hover
            tooltip which is positioned in CSS px. */}
        <div style={{ position: "relative" }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            style={{ display: "block", overflow: "visible" }}
            role="img"
            aria-label="AVI time series chart"
          >
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
            {Y_TICKS.map((t, i) => (
              <text
                key={`yl-${i}`}
                x={PAD.l - 10}
                y={sy(t) + 4}
                textAnchor="end"
                fontSize={11}
                fontWeight="400"
                fill="rgba(0,0,0,0.3)"
                fontFamily={MONO}
              >
                {(t * 100).toFixed(0)}%
              </text>
            ))}
            {xTicks.map((tk, i) => (
              <text
                key={`xl-${i}`}
                x={sx(tk.i)}
                y={H - 8}
                textAnchor="middle"
                fontSize={11}
                fontWeight="400"
                fill="rgba(0,0,0,0.3)"
                fontFamily={MONO}
              >
                {tk.label}
              </text>
            ))}

            {/* Non-leader lines first */}
            {series.slice(1).map((s) => (
              <path
                key={s.entry.name}
                d={toPath(s.points)}
                fill="none"
                stroke={s.entry.color}
                strokeWidth={1.25}
                opacity={0.8}
              />
            ))}
            {/* Leader on top, thicker, accent color */}
            <path
              d={toPath(series[0].points)}
              fill="none"
              stroke={brand.color}
              strokeWidth={2}
            />

            {/* Hover decorations: vertical date line + one filled dot per
                series at the snapped x. */}
            {tooltip && (
              <g>
                <line
                  x1={tooltip.x}
                  x2={tooltip.x}
                  y1={PAD.t}
                  y2={PAD.t + plotH}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                {series.map((s) => {
                  const pt = s.points.find(
                    (p) => sx(p.x).toFixed(1) === tooltip.x.toFixed(1),
                  );
                  if (!pt) return null;
                  return (
                    <circle
                      key={s.entry.name}
                      cx={sx(pt.x)}
                      cy={sy(pt.y)}
                      r={3.5}
                      fill={s.entry.color}
                      stroke="#fff"
                      strokeWidth={1.5}
                    />
                  );
                })}
              </g>
            )}

            {/* Invisible overlay capturing the mouse for hover. Sits over
                the plot area only — labels/grid are untouched. */}
            <rect
              x={PAD.l}
              y={PAD.t}
              width={plotW}
              height={plotH}
              fill="transparent"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: "crosshair" }}
            />
          </svg>

          {tooltip && <ChartTooltip tooltip={tooltip} chartW={W} svgX={tooltip.x} />}
        </div>

        {/* Always-visible legend for the 5 brands on the chart, plus
            the "Last run" timestamp on the right. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "6px 14px",
            padding: "12px 4px 0",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
            {chartEntries.map((e) => (
              <span
                key={e.name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: brand.text,
                  fontWeight: 500,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 2,
                    background: e.color,
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
                {e.name}
              </span>
            ))}
          </div>
          <span
            style={{
              fontSize: 11,
              color: "rgba(0,0,0,0.25)",
              fontFamily: MONO,
              fontWeight: 400,
            }}
          >
            Last run: {data.last_run_date}
          </span>
        </div>

        {/* Data-source disclosure footer — honest about whether the
            chart is plotting real history or a smoothed synthetic curve
            ending on today's snapshot. */}
        {!hasRealSeries && (
          <div style={{ paddingTop: 10 }}>
            <span
              style={{
                fontSize: 10,
                color: "rgba(0,0,0,0.3)",
                fontFamily: MONO,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              · Simulated time series · live snapshot only
            </span>
          </div>
        )}
      </div>

      {/* ═════════════════════ RANKING TABLE ═════════════════════
          # · Company · AVI · Δ vs prev window. The delta column is
          driven by `leaderboard[].avi_delta` (in percentage points, not
          relative %). When `previous_period.has_data === false` (e.g.
          first 14 days of a new industry), every delta collapses to
          "—" — we don't suppress the column so the layout stays
          stable across windows. */}
      <div
        style={{
          borderTop: `1px solid ${brand.border}`,
          background: brand.bg,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr 100px 110px",
            alignItems: "center",
            padding: "12px 24px",
            background: "rgba(0,0,0,0.015)",
            borderBottom: `1px solid ${brand.border}`,
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(0,0,0,0.45)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontFamily: MONO,
          }}
        >
          <span>#</span>
          <span>Company</span>
          <span style={{ textAlign: "right" }}>AVI</span>
          <span style={{ textAlign: "right" }}>Δ vs prev</span>
        </div>

        {/* Rows */}
        {entries.map((e, i) => {
          const isLast = i === entries.length - 1;
          const hasPrev = data.previous_period.has_data;
          const deltaRaw = hasPrev ? e.avi_delta : null;
          const tone = deltaTone(deltaRaw);
          const deltaColor =
            tone === "up"
              ? "#16a34a"
              : tone === "down"
              ? "#dc2626"
              : "rgba(0,0,0,0.35)";
          return (
            <div
              key={e.name}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr 100px 110px",
                alignItems: "center",
                padding: "12px 24px",
                borderBottom: isLast ? "none" : "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.35)",
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <Favicon
                  domain={e.domain}
                  initials={e.initials}
                  color={e.color}
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: brand.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.name}
                </span>
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  fontWeight: 700,
                  color: brand.text,
                  textAlign: "right",
                }}
              >
                {e.avi.toFixed(1)}%
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  fontWeight: 600,
                  color: deltaColor,
                  textAlign: "right",
                }}
                title={
                  hasPrev
                    ? `vs ${data.previous_period.from} → ${data.previous_period.to}`
                    : "Comparison data not yet available — daily history is still accumulating."
                }
              >
                {formatDelta(deltaRaw)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── ChartTooltip — replica of /tmp/platform-reference/src/components/
       ds/ChartHoverTooltip.tsx. Positioned absolutely in CSS px relative
       to the chart wrapper; flips to the left when it would overflow the
       right edge of the SVG. ────────────────────────────────────────── */
function ChartTooltip({
  tooltip,
  chartW,
  svgX,
}: {
  tooltip: TooltipState;
  chartW: number;
  svgX: number;
}) {
  // Tooltip width estimate in SVG units. If the snapped x is too close to
  // the right edge, flip the tooltip to the left of the cursor.
  const ESTIMATED_W = 200;
  const flipLeft = svgX + ESTIMATED_W + 16 > chartW;
  const leftPct = (svgX / chartW) * 100;
  return (
    <div
      style={{
        position: "absolute",
        left: flipLeft ? "auto" : `calc(${leftPct}% + 12px)`,
        right: flipLeft ? `calc(${100 - leftPct}% + 12px)` : "auto",
        top: 8,
        pointerEvents: "none",
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 6,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
        padding: "8px 10px",
        minWidth: 160,
        zIndex: 5,
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(0,0,0,0.5)",
          letterSpacing: "-0.01em",
          marginBottom: 6,
        }}
      >
        {tooltip.date}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {tooltip.entries.map((e) => (
          <div
            key={e.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
            }}
          >
            <span
              style={{
                width: 3,
                height: 12,
                borderRadius: 2,
                background: e.color,
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span
              style={{
                flex: 1,
                color: "rgba(0,0,0,0.75)",
                fontWeight: e.isLeader ? 700 : 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 160,
              }}
            >
              {e.name}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontWeight: 600,
                color: "rgba(0,0,0,0.75)",
                fontSize: 12,
              }}
            >
              {(e.value * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
