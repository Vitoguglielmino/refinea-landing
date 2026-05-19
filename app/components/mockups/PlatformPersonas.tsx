/**
 * PlatformPersonas
 * ────────────────────────────────────────────────────────────────────────
 * Static replica of the Refinea platform's /home/[website]/personas page.
 *
 * Source files used as ground truth:
 *   /tmp/platform-reference/src/lib/theme.ts
 *   /tmp/platform-reference/src/app/home/[website]/personas/page.tsx
 *     - PersonaCard (line 1139-1297)
 *     - Section header (line 1590-1601)
 *     - Source filter chips (line 1621-1681)
 *     - Card grid (line 1711-1730)
 *     - Liquid Glass nav (line 1548-1588)
 *     - AVATAR_COLORS palette (line 18-29)
 *
 * Data: Gucci luxury fashion buyer personas. All info fabricated but
 * plausible for the category. Pure presentation — no Redux, no API calls.
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
  accentBorder: "rgba(108,71,255,0.15)",
} as const;

const MONO =
  "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', 'Roboto Mono', 'Fira Code', monospace";

/* ─── Avatar palette (copied verbatim from personas/page.tsx line 18-29) ── */
const AVATAR_COLORS = [
  { bg: "rgba(108, 71, 255, 0.10)", fg: "#6c47ff" },
  { bg: "rgba(16, 185, 129, 0.12)", fg: "#059669" },
  { bg: "rgba(245, 158, 11, 0.12)", fg: "#d97706" },
  { bg: "rgba(239, 68, 68, 0.10)", fg: "#dc2626" },
  { bg: "rgba(6, 182, 212, 0.12)", fg: "#0891b2" },
  { bg: "rgba(168, 85, 247, 0.10)", fg: "#7c3aed" },
];

/* ─── Person icon (copied from personas/page.tsx PersonIcon) ─── */
function PersonIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

/* ─── Info row (matches InfoRow in personas/page.tsx) ─── */
function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center" }}>{icon}</span>
      <span
        style={{
          fontSize: 12,
          color: brand.muted,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ─── Industry / Environment / Location icons (copied from PersonaCard) ── */
function IndustryIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={brand.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
      <rect x="5" y="3" width="14" height="18" rx="1" />
    </svg>
  );
}
function EnvironmentIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={brand.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={brand.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ─── Persona Source Badge ─── */
function SourceBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: "rgba(16,185,129,0.10)",
        color: "#059669",
        border: "1px solid rgba(16,185,129,0.18)",
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
        <circle cx="4" cy="4" r="3" />
      </svg>
      From Your Data
    </span>
  );
}

/* ─── Header toggle (matches HeroAVITimeSeries TriggerButton) ─── */
function HeaderToggle({ label, active = false }: { label: string; active?: boolean }) {
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
        borderColor: active ? brand.color : brand.border,
        borderRadius: 6,
        cursor: "default",
        whiteSpace: "nowrap",
        lineHeight: 1.2,
        outline: "none",
        boxShadow: active ? `0 0 0 1.5px ${brand.accentSoft}` : "none",
      }}
    >
      <span>{label}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5 }}>
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ─── Status Badge (StatusBadge.tsx replica) ─── */
function StatusBadge({ status }: { status: "active" | "draft" }) {
  const isActive = status === "active";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 7px",
        borderRadius: 10,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: isActive ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.02)",
        color: isActive ? brand.text : brand.muted,
        border: `1px solid ${brand.border}`,
      }}
    >
      {isActive ? "Active" : "Draft"}
    </span>
  );
}

/* ─── Gucci buyer personas (fabricated, plausible for luxury fashion) ── */
type Persona = {
  name: string;
  status: "active" | "draft";
  industry: string;
  environment: string;
  location: string;
};

const PERSONAS: Persona[] = [
  {
    name: "Creative Professional",
    status: "active",
    industry: "Fashion & Design",
    environment: "Mid-market, Independent",
    location: "Milan, Italy",
  },
  {
    name: "Affluent Parent",
    status: "active",
    industry: "Luxury Retail",
    environment: "Family household, HNW",
    location: "Global cities",
  },
  {
    name: "Style-Conscious Professional",
    status: "active",
    industry: "Finance & Consulting",
    environment: "Corporate, Senior role",
    location: "New York, NY",
  },
  {
    name: "Young Trendsetter",
    status: "active",
    industry: "Media & Lifestyle",
    environment: "Social-first, Gen Z",
    location: "Los Angeles, CA",
  },
  {
    name: "Luxury Gift Buyer",
    status: "active",
    industry: "Cross-category",
    environment: "Occasion-driven",
    location: "Worldwide",
  },
  {
    name: "Vintage Collector",
    status: "draft",
    industry: "Fashion Archive",
    environment: "Specialty buyer",
    location: "Tokyo, Japan",
  },
];

/* ─── Single Persona Card (matches PersonaCard line 1139-1297) ─── */
function PersonaCard({ persona, ac }: { persona: Persona; ac: { bg: string; fg: string } }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "20px 22px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(8px)",
        border: `0.5px solid ${brand.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      {/* Top row: avatar + name + badges */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            flexShrink: 0,
            background: ac.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonIcon color={ac.fg} size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: brand.text,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {persona.name}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <SourceBadge />
            <StatusBadge status={persona.status} />
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <InfoRow icon={<IndustryIcon />} text={persona.industry} />
        <InfoRow icon={<EnvironmentIcon />} text={persona.environment} />
        <InfoRow icon={<LocationIcon />} text={persona.location} />
      </div>
    </div>
  );
}

/* ─── Main mockup ─── */
export default function PlatformPersonas() {
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
      <div style={{ padding: "0 32px 24px", background: brand.subtle }}>
        {/* Liquid Glass nav — matches HeroAVITimeSeries: logo + toggles right */}
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Favicon domain="gucci.com" initials="G" color="#000" size={26} />
            <span style={{ fontSize: 15, fontWeight: 700, color: brand.text, letterSpacing: "-0.02em" }}>
              Gucci
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HeaderToggle label="All Sources" />
            <HeaderToggle label="Active" active />
            <HeaderToggle label="Sorted by Activity" />
          </div>
        </div>

        {/* Section header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: brand.text, letterSpacing: "-0.02em" }}>
            Personas
          </h2>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.35)", letterSpacing: "-0.01em" }}>
            Gucci&apos;s audience generated from your real data
          </p>
        </div>

        {/* Card grid — 3×2 on desktop to match widescreen mockups */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
            padding: "0 4px",
          }}
        >
          {PERSONAS.map((p, i) => (
            <PersonaCard key={p.name} persona={p} ac={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
          ))}
        </div>
      </div>
    </div>
  );
}
