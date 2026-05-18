/**
 * PlatformShareOfVoice — AstraOrb version (current platform)
 * ────────────────────────────────────────────────────────────────────────
 * Static replica of the current SoV card from /home/[website]/overview.
 *
 * The chart is an "AstraOrb" — a 360° donut ring with neon-palette arcs,
 * 1.5° gaps between segments, drop shadow + solid color core + white
 * filament, target brand uses thicker stroke for dominance.
 *
 * Source files used as ground truth:
 *   /tmp/platform-reference/src/components/home/SovLeaderboard.tsx
 *     - Orb constants (line 226-238)
 *     - NEON palette (line 240-249)
 *     - computeArcs / describeArc (line 266-308)
 *     - AstraOrb 3-layer rendering (line 315-410)
 *     - Hero metric + Astra-Orb + legend + ranked panel layout (line 1040-1141)
 *   /tmp/platform-reference/src/components/home/RankedCompetitorsPanel.tsx
 *     - Right-side ranked rows
 *
 * Data: Gucci luxury fashion SoV. Fabricated but plausible.
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

/* ─── Orb constants (verbatim from SovLeaderboard.tsx line 226-238) ──── */
const ORB_SIZE = 300;
const ORB_CENTER = ORB_SIZE / 2;
const ORB_RADIUS = 108;
const ARC_W = 20;
const BRAND_W = 22;
const OTHERS_W = 10;
const GAP_DEG = 1.5;
const PX_PER_DEG = (ORB_RADIUS * Math.PI) / 180;

/* ─── Neon palette (verbatim from line 240-249) ───────────────────── */
const NEON = ["#7c3aed", "#4ade80", "#22d3ee", "#f97316", "#f43f5e", "#fbbf24"] as const;
const BRAND_COLOR = "#7c3aed";

function slotColor(idx: number, isTarget: boolean): string {
  if (isTarget) return BRAND_COLOR;
  return NEON[(idx % (NEON.length - 1)) + 1];
}

/* ─── Gucci SoV data ─────────────────────────────────────────────── */
type Entry = { name: string; domain: string; initials: string; sov: number; isTarget: boolean; delta: number | null };

const ENTRIES: Entry[] = [
  { name: "Gucci",          domain: "gucci.com",        initials: "G",  sov: 0.243, isTarget: true,  delta:  3.1 },
  { name: "Louis Vuitton",  domain: "louisvuitton.com", initials: "LV", sov: 0.187, isTarget: false, delta: -1.2 },
  { name: "Prada",          domain: "prada.com",        initials: "P",  sov: 0.142, isTarget: false, delta:  0.4 },
  { name: "Dior",           domain: "dior.com",         initials: "D",  sov: 0.114, isTarget: false, delta: -0.7 },
  { name: "Saint Laurent",  domain: "ysl.com",          initials: "SL", sov: 0.098, isTarget: false, delta:  0.9 },
];
const OTHERS_SOV = 1 - ENTRIES.reduce((a, e) => a + e.sov, 0);

/* ─── Arc geometry (matches computeArcs / describeArc) ────────────── */
type Arc = { name: string; sov: number; startAngle: number; endAngle: number; color: string; isTarget: boolean };

const slices: { name: string; sov: number; isTarget: boolean; color: string }[] = ENTRIES.map((e, i) => ({
  name: e.name,
  sov: e.sov,
  isTarget: e.isTarget,
  color: slotColor(i, e.isTarget),
}));
slices.push({ name: "Others", sov: OTHERS_SOV, isTarget: false, color: "others" });

const totalSOV = slices.reduce((a, s) => a + s.sov, 0) || 1;
const usableDeg = 360 - GAP_DEG * slices.length;
const startOffset = 90;

const ARCS: Arc[] = [];
{
  let cursor = startOffset;
  slices.forEach((s) => {
    const sweep = (s.sov / totalSOV) * usableDeg;
    ARCS.push({
      name: s.name,
      sov: s.sov,
      startAngle: cursor,
      endAngle: cursor + sweep,
      color: s.color,
      isTarget: s.isTarget,
    });
    cursor += sweep + GAP_DEG;
  });
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

/* ─── AstraOrb component (static, no hover) ───────────────────────── */
function AstraOrb() {
  return (
    <div style={{ width: ORB_SIZE, height: ORB_SIZE, position: "relative", flexShrink: 0 }}>
      <svg width={ORB_SIZE} height={ORB_SIZE} viewBox={`0 0 ${ORB_SIZE} ${ORB_SIZE}`} style={{ display: "block" }}>
        <defs>
          <filter id="astra-ds" x="-10%" y="-5%" width="120%" height="130%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="sb" />
            <feOffset in="sb" dx="0" dy="1.5" result="so" />
            <feColorMatrix in="so" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" />
          </filter>
        </defs>

        {/* Ghost orbit track */}
        <circle cx={ORB_CENTER} cy={ORB_CENTER} r={ORB_RADIUS} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={ARC_W} />

        {ARCS.map((arc, i) => {
          const isOthers = arc.name === "Others";
          const isBrand = arc.isTarget;
          const w = isOthers ? OTHERS_W : isBrand ? BRAND_W : ARC_W;

          const sweep = arc.endAngle - arc.startAngle;
          const idealCapDeg = w / 2 / PX_PER_DEG;
          const capDeg = Math.min(idealCapDeg, Math.max(0, (sweep - 0.5) / 2));
          const insetStart = arc.startAngle + capDeg;
          const insetEnd = arc.endAngle - capDeg;
          const d = describeArc(ORB_CENTER, ORB_CENTER, ORB_RADIUS, insetStart, insetEnd);

          if (isOthers) {
            return <path key={`o-${i}`} d={d} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={OTHERS_W} strokeLinecap="round" />;
          }

          return (
            <g key={`g-${i}`}>
              {/* L0 — drop shadow */}
              <path d={d} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={w} strokeLinecap="round" filter="url(#astra-ds)" opacity={0.5} />
              {/* L1 — solid core */}
              <path d={d} fill="none" stroke={arc.color} strokeWidth={w} strokeLinecap="round" />
              {/* L2 — white filament */}
              <path d={d} fill="none" stroke="#ffffff" strokeWidth={isBrand ? 2.5 : 2} strokeLinecap="round" opacity={isBrand ? 0.7 : 0.5} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

import { Favicon } from "./Favicon";

function DeltaTriangle({ delta }: { delta: number | null }) {
  if (delta === null) return <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(0,0,0,0.2)", minWidth: 44, textAlign: "right" }} />;
  const color = delta >= 0 ? "#2d8a56" : "#c0392b";
  return (
    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, color, minWidth: 44, textAlign: "right", display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
      <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ transform: delta < 0 ? "rotate(180deg)" : "none", color }}>
        <path d="M5 1.5L8.5 6.5H1.5L5 1.5Z" fill="currentColor" />
      </svg>
      {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
    </span>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function PlatformShareOfVoice() {
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
            Share of Voice
          </h2>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.35)", letterSpacing: "-0.01em" }}>
            AI Share of Voice: Gucci vs. Competitors
          </p>
        </div>

        {/* KpiCard wrapper */}
        <section
          style={{
            background: brand.bg,
            border: `1px solid ${brand.border}`,
            borderRadius: 6,
            padding: 22,
          }}
        >
          <div style={{ display: "flex", gap: 0, minHeight: 360 }}>
            {/* LEFT: hero + AstraOrb + legend grid */}
            <div style={{ flex: 3, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0, gap: 2 }}>
              {/* Hero metric */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignSelf: "stretch", paddingLeft: "5%", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Share of Voice
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: MONO, fontSize: 32, fontWeight: 700, color: brand.text, letterSpacing: "-0.03em" }}>
                    24.3%
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: "#2d8a56", display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1.5L8.5 6.5H1.5L5 1.5Z" fill="currentColor" />
                    </svg>
                    +3.1%
                  </span>
                </div>
              </div>

              <AstraOrb />

              {/* Legend grid 3 cols */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, auto)",
                  gap: "4px 14px",
                  justifyContent: "center",
                  maxWidth: ORB_SIZE,
                  padding: "8px 4px 0",
                }}
              >
                {ARCS.map((arc) => {
                  const isOthers = arc.name === "Others";
                  const color = isOthers ? "rgba(0,0,0,0.18)" : arc.color;
                  return (
                    <div key={arc.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 0" }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          flexShrink: 0,
                          background: color,
                          border: `1.5px solid ${color}`,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          color: brand.text,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {arc.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: brand.border, margin: "0 16px", flexShrink: 0 }} />

            {/* RIGHT: ranked panel */}
            <div style={{ flex: "0 0 300px", display: "flex", flexDirection: "column", minWidth: 300 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16, paddingLeft: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Your Rank
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: MONO, fontSize: 32, fontWeight: 700, color: brand.text, letterSpacing: "-0.03em" }}>
                    #1
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: "#2d8a56", display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1.5L8.5 6.5H1.5L5 1.5Z" fill="currentColor" />
                    </svg>
                    +1
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 8, paddingLeft: 4 }}>
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

              {/* Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {ENTRIES.map((e, i) => (
                  <div
                    key={e.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 6,
                      background: e.isTarget ? brand.accentSoft : "transparent",
                      minHeight: 36,
                    }}
                  >
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 500, color: "rgba(0,0,0,0.25)", width: 18, textAlign: "right", flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <Favicon domain={e.domain} initials={e.initials} color={slotColor(i, e.isTarget)} isOwner={e.isTarget} />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: e.isTarget ? 600 : 500,
                        color: brand.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.name}
                      {e.isTarget && (
                        <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, color: brand.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          you
                        </span>
                      )}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: brand.text, flexShrink: 0 }}>
                      {(e.sov * 100).toFixed(1)}%
                    </span>
                    <DeltaTriangle delta={e.delta} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
