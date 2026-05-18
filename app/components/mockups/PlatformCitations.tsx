/**
 * PlatformCitations — Deep-tech custom design
 * ────────────────────────────────────────────────────────────────────────
 * Original redesign (NOT a verbatim platform replica). The platform's
 * citation card was rejected for being "too literal" — this one is built
 * as a custom data-viz piece in a deep-tech aesthetic:
 *
 *   - Left:  terminal-style indexed source list (monospace, [###] prefix)
 *   - Right: radial citation graph with brand at center, sources orbiting
 *            and connected by weighted lines
 *   - Top:   tech-styled aggregate metrics (Total citations, Distinct
 *            domains, AI engines covered)
 *
 * Still in the existing landing design system (light surface, accent
 * #6c47ff, mono numbers, soft shadow). Just a more distinctive treatment
 * than a 1:1 platform copy.
 *
 * Data: Gucci luxury fashion citation sources.
 */

import { Favicon } from "./Favicon";

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

/* ─── Data ───────────────────────────────────────────────────────────── */
type Source = {
  hostname: string;
  share: number;
  citations: number;
  type: "media" | "encyclopedia" | "owner" | "industry";
};

const SOURCES: Source[] = [
  { hostname: "vogue.com",            share: 0.082, citations: 234, type: "media" },
  { hostname: "harpersbazaar.com",    share: 0.067, citations: 191, type: "media" },
  { hostname: "wikipedia.org",        share: 0.061, citations: 174, type: "encyclopedia" },
  { hostname: "gucci.com",            share: 0.057, citations: 162, type: "owner" },
  { hostname: "businessoffashion.com", share: 0.046, citations: 131, type: "industry" },
  { hostname: "wwd.com",              share: 0.038, citations: 108, type: "media" },
  { hostname: "highsnobiety.com",     share: 0.031, citations:  88, type: "media" },
];

const TYPE_COLOR: Record<Source["type"], string> = {
  media:         "#22d3ee",
  encyclopedia:  "#fbbf24",
  owner:         brand.color,
  industry:      "#4ade80",
};

const TYPE_LABEL: Record<Source["type"], string> = {
  media:         "MEDIA",
  encyclopedia:  "ENCYC",
  owner:         "OWNED",
  industry:      "TRADE",
};

/* ─── 3D pseudo-perspective graph geometry ──────────────────────────────
 * The orbital plane is tilted so it reads as an ellipse instead of a flat
 * circle. Nodes "behind" the hub (top half) are smaller + dimmer; nodes
 * "in front" (bottom half) are larger and have stronger shadows. This
 * fakes depth without WebGL — just SVG with depth-aware sizing/opacity. */
const GRAPH_W = 460;
const GRAPH_H = 360;
const CX = GRAPH_W / 2;
const CY = GRAPH_H / 2 + 6;
const HUB_R = 42;
const NODE_BASE_R = 13;
const ORBIT_RX = 180;          // horizontal orbit radius (wide)
const ORBIT_RY = 70;           // vertical orbit radius (squashed → tilt)

/* ─── Compute node positions with depth (z) ─────────────────────────── */
type Node = Source & {
  angle: number;
  x: number;
  y: number;
  r: number;
  z: number;        // 0 = far back, 1 = closest to viewer
  scale: number;    // size multiplier (perspective)
  depthAlpha: number;
};

const NODES: Node[] = SOURCES.map((s, i) => {
  // Distribute around full orbit
  const angle = (-Math.PI / 2) + (i / SOURCES.length) * Math.PI * 2 + 0.18;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // 3D position: x stays linear, y squashed by orbit tilt, z derived from sin
  const x = CX + ORBIT_RX * cosA;
  const y = CY + ORBIT_RY * sinA;
  // sinA > 0 means in front (bottom of ellipse), < 0 means behind (top)
  const z = (sinA + 1) / 2;        // 0..1

  // Perspective scale — front nodes ~1.25x, back nodes ~0.7x
  const scale = 0.7 + z * 0.55;
  // Depth alpha — back nodes fade slightly
  const depthAlpha = 0.55 + z * 0.45;
  // Node radius scales with share AND depth
  const r = (NODE_BASE_R + s.share * 70) * scale;

  return { ...s, angle, x, y, r, z, scale, depthAlpha };
});

// Render back-to-front so front nodes occlude back ones
const NODES_SORTED = [...NODES].sort((a, b) => a.z - b.z);

/* ─── Component ─────────────────────────────────────────────────────── */
export default function PlatformCitations() {
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
            Citation Graph
          </h2>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.35)", letterSpacing: "-0.01em" }}>
            Which sources AI engines cite when answering about Gucci
          </p>
        </div>

        {/* Card wrapper */}
        <section
          style={{
            background: brand.bg,
            border: `1px solid ${brand.border}`,
            borderRadius: 6,
            padding: 0,
            overflow: "hidden",
          }}
        >
          {/* Main body: terminal list + 3D radial graph */}
          <div style={{ display: "flex", gap: 0, minHeight: 400 }}>
            {/* LEFT: terminal-style source list */}
            <div
              style={{
                flex: "0 0 320px",
                padding: 22,
                borderRight: `1px solid ${brand.border}`,
                background: "rgba(0,0,0,0.015)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(0,0,0,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Top Sources
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2, fontFamily: MONO }}>
                {SOURCES.map((s, i) => {
                  const isOwner = s.type === "owner";
                  return (
                    <div
                      key={s.hostname}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 10px",
                        borderRadius: 4,
                        background: isOwner ? brand.accentSoft : "transparent",
                        fontSize: 12,
                      }}
                    >
                      <span style={{ color: "rgba(0,0,0,0.3)", fontWeight: 500, width: 16, textAlign: "right" }}>
                        {i + 1}
                      </span>
                      <Favicon
                        domain={s.hostname}
                        initials={s.hostname.charAt(0).toUpperCase()}
                        color={TYPE_COLOR[s.type]}
                        size={16}
                        isOwner={isOwner}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontWeight: isOwner ? 700 : 500,
                          color: isOwner ? brand.color : brand.text,
                          fontFamily: MONO,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.hostname}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: TYPE_COLOR[s.type],
                          padding: "1px 5px",
                          borderRadius: 3,
                          background: "rgba(0,0,0,0.02)",
                          border: `1px solid ${brand.border}`,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {TYPE_LABEL[s.type]}
                      </span>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 12,
                          fontWeight: 700,
                          color: brand.text,
                          minWidth: 42,
                          textAlign: "right",
                        }}
                      >
                        {(s.share * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", paddingTop: 12, borderTop: `1px dashed ${brand.border}` }}>
                {(["media", "encyclopedia", "owner", "industry"] as const).map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, color: brand.muted, fontFamily: MONO }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: TYPE_COLOR[t] }} />
                    {TYPE_LABEL[t]}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT: 3D pseudo-perspective radial graph */}
            <div style={{ flex: 1, padding: 22, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <svg width="100%" height={GRAPH_H} viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`} style={{ display: "block" }}>
                <defs>
                  <radialGradient id="hubGrad" cx="50%" cy="45%" r="55%">
                    <stop offset="0%"  stopColor="#a78bfa" stopOpacity="1" />
                    <stop offset="60%" stopColor={brand.color} stopOpacity="1" />
                    <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.95" />
                  </radialGradient>
                  <radialGradient id="hubShadow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(108,71,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(108,71,255,0)" />
                  </radialGradient>
                  <filter id="hubGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  {/* Per-node soft drop shadow used only for front-plane nodes */}
                  <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feOffset in="b" dx="0" dy="2" result="o" />
                    <feColorMatrix in="o" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0" result="s" />
                    <feMerge>
                      <feMergeNode in="s" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Tilted orbital plane — two concentric ellipses */}
                <ellipse
                  cx={CX}
                  cy={CY}
                  rx={ORBIT_RX}
                  ry={ORBIT_RY}
                  fill="none"
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                />
                <ellipse
                  cx={CX}
                  cy={CY}
                  rx={ORBIT_RX * 0.65}
                  ry={ORBIT_RY * 0.65}
                  fill="none"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth={1}
                  strokeDasharray="2 5"
                />

                {/* Ground shadow ellipse under the hub for grounding */}
                <ellipse
                  cx={CX}
                  cy={CY + 4}
                  rx={ORBIT_RX * 0.95}
                  ry={ORBIT_RY * 0.95}
                  fill="url(#hubShadow)"
                  opacity={0.25}
                />

                {/* ── Render back-plane connections first (nodes z < 0.5) ── */}
                {NODES.filter((n) => n.z < 0.5).map((n) => (
                  <line
                    key={`back-l-${n.hostname}`}
                    x1={CX}
                    y1={CY}
                    x2={n.x}
                    y2={n.y}
                    stroke={n.type === "owner" ? brand.color : "rgba(0,0,0,0.10)"}
                    strokeWidth={(n.type === "owner" ? 1.5 : 0.8) * n.scale}
                    strokeOpacity={0.45}
                    strokeDasharray={n.type === "owner" ? "none" : "3 3"}
                  />
                ))}

                {/* ── Back-plane nodes (sorted by z, drawn first) ── */}
                {NODES_SORTED.filter((n) => n.z < 0.5).map((n) => {
                  const color = TYPE_COLOR[n.type];
                  const faviconSize = Math.max(8, n.r * 1.4);
                  return (
                    <g key={`back-n-${n.hostname}`} opacity={n.depthAlpha}>
                      <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" stroke={color} strokeWidth={1.5 * n.scale} />
                      <foreignObject
                        x={n.x - faviconSize / 2}
                        y={n.y - faviconSize / 2}
                        width={faviconSize}
                        height={faviconSize}
                      >
                        <Favicon
                          domain={n.hostname}
                          initials={n.hostname.charAt(0).toUpperCase()}
                          color={color}
                          size={faviconSize}
                        />
                      </foreignObject>
                    </g>
                  );
                })}

                {/* ── HUB (Gucci) — favicon + thin violet ring, no orb ── */}
                <circle
                  cx={CX}
                  cy={CY}
                  r={HUB_R}
                  fill="#fff"
                  stroke={brand.color}
                  strokeWidth={2.5}
                />
                <foreignObject
                  x={CX - HUB_R * 0.72}
                  y={CY - HUB_R * 0.72}
                  width={HUB_R * 1.44}
                  height={HUB_R * 1.44}
                >
                  <Favicon
                    domain="gucci.com"
                    initials="G"
                    color={brand.color}
                    size={HUB_R * 1.44}
                  />
                </foreignObject>
                <text
                  x={CX}
                  y={CY + HUB_R + 16}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize={9}
                  fontWeight={700}
                  fill={brand.muted}
                  letterSpacing="0.08em"
                >
                  gucci.com
                </text>

                {/* ── Front-plane connections (drawn after hub for depth) ── */}
                {NODES.filter((n) => n.z >= 0.5).map((n) => (
                  <line
                    key={`front-l-${n.hostname}`}
                    x1={CX}
                    y1={CY}
                    x2={n.x}
                    y2={n.y}
                    stroke={n.type === "owner" ? brand.color : "rgba(0,0,0,0.18)"}
                    strokeWidth={(n.type === "owner" ? 1.8 : 1) * n.scale}
                    strokeOpacity={0.8}
                    strokeDasharray={n.type === "owner" ? "none" : "3 3"}
                  />
                ))}

                {/* ── Front-plane nodes (with drop shadow) ── */}
                {NODES_SORTED.filter((n) => n.z >= 0.5).map((n) => {
                  const color = TYPE_COLOR[n.type];
                  const faviconSize = Math.max(10, n.r * 1.5);
                  const labelDist = n.r + 14;
                  // Label offset stays in the tilted plane direction
                  const lx = n.x + Math.cos(n.angle) * labelDist;
                  const ly = n.y + Math.sin(n.angle) * (labelDist * 0.45) + (n.r + 14);
                  const isLeft = Math.cos(n.angle) < -0.3;
                  const isRight = Math.cos(n.angle) > 0.3;
                  const anchor: "start" | "end" | "middle" = isLeft ? "end" : isRight ? "start" : "middle";

                  return (
                    <g key={`front-n-${n.hostname}`} opacity={n.depthAlpha}>
                      <g filter="url(#nodeShadow)">
                        <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" stroke={color} strokeWidth={2 * n.scale} />
                        <foreignObject
                          x={n.x - faviconSize / 2}
                          y={n.y - faviconSize / 2}
                          width={faviconSize}
                          height={faviconSize}
                        >
                          <Favicon
                            domain={n.hostname}
                            initials={n.hostname.charAt(0).toUpperCase()}
                            color={color}
                            size={faviconSize}
                          />
                        </foreignObject>
                      </g>
                      <text
                        x={anchor === "middle" ? n.x : lx}
                        y={ly}
                        textAnchor={anchor}
                        fontFamily={MONO}
                        fontSize={10}
                        fontWeight={600}
                        fill={brand.text}
                      >
                        {n.hostname}
                      </text>
                      <text
                        x={anchor === "middle" ? n.x : lx}
                        y={ly + 12}
                        textAnchor={anchor}
                        fontFamily={MONO}
                        fontSize={9}
                        fontWeight={500}
                        fill={brand.muted}
                      >
                        {(n.share * 100).toFixed(1)}% · {n.citations}
                      </text>
                    </g>
                  );
                })}

                {/* ── Labels for back-plane nodes (stacked well above the node) ── */}
                {NODES.filter((n) => n.z < 0.5).map((n) => {
                  // Lift labels well clear of the favicon: hostname at -r-26, pct at -r-14.
                  // This guarantees no overlap with the icon even at the smallest scale.
                  const hostnameY = n.y - n.r - 26;
                  const pctY      = n.y - n.r - 14;
                  return (
                    <g key={`back-lbl-${n.hostname}`} opacity={n.depthAlpha * 0.85}>
                      <text
                        x={n.x}
                        y={hostnameY}
                        textAnchor="middle"
                        fontFamily={MONO}
                        fontSize={9}
                        fontWeight={600}
                        fill={brand.text}
                      >
                        {n.hostname}
                      </text>
                      <text
                        x={n.x}
                        y={pctY}
                        textAnchor="middle"
                        fontFamily={MONO}
                        fontSize={8}
                        fontWeight={500}
                        fill={brand.muted}
                      >
                        {(n.share * 100).toFixed(1)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
