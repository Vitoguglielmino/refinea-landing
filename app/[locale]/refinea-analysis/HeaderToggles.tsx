"use client";

/**
 * HeaderToggles — three platform-style trigger dropdowns living in the
 * AVI section header (above the chart). Mirrors the closed state of the
 * product's <ModelsToggle/>, <LayerScopeToggle/>, and <TimeRangeSelect/>.
 *
 * State today:
 *   1. Model    → Gemini active, ChatGPT/Claude/Perplexity locked behind
 *                  a "Contact sales" upsell.
 *   2. Region   → Italy active, other regions locked behind a separate
 *                  "Contact sales" upsell.
 *   3. Time range → Last 7 / 30 / 90 days, freely selectable. Wired
 *                    locally so the user can play with the UI, but does
 *                    not yet drive the chart (the marketing API exposes
 *                    only today's snapshot; the chart is simulated).
 *
 * Implemented from scratch (~250 lines) rather than pulling in Radix.
 * Same look & feel as the product, zero new deps.
 */
import { useEffect, useRef, useState } from "react";

const brand = {
  color: "#6c47ff",
  text: "rgba(0,0,0,0.75)",
  muted: "rgba(0,0,0,0.5)",
  border: "rgba(0,0,0,0.08)",
  bg: "#ffffff",
  accentSoft: "rgba(108,71,255,0.08)",
} as const;

/* ─── Shared trigger button (matches the platform's closed-state look) ── */
function Trigger({
  label,
  open,
  filtered = false,
  leading,
  onClick,
}: {
  label: string;
  open: boolean;
  filtered?: boolean;
  /** Optional leading element rendered to the left of the label
   *  (favicon, flag, etc). */
  leading?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-haspopup="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "inherit",
        color: brand.text,
        background: brand.bg,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: open || filtered ? brand.color : brand.border,
        borderRadius: 6,
        cursor: "pointer",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        whiteSpace: "nowrap",
        lineHeight: 1.2,
        outline: "none",
        boxShadow:
          open ? `0 0 0 2px ${brand.accentSoft}` :
          filtered ? `0 0 0 1.5px ${brand.accentSoft}` :
          "none",
      }}
    >
      {leading}
      <span>{label}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        style={{
          opacity: 0.5,
          transition: "transform 0.2s ease",
          transform: open ? "rotate(180deg)" : "none",
        }}
      >
        <path
          d="M4 6L8 10L12 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ─── Leading icons ───────────────────────────────────────────────────
   Gemini logo (the "spark" mark used by Google), and the Italian flag
   as a 3-vertical-stripe SVG. Both 14×14 to sit cleanly inside the
   trigger button row. */
function GeminiLogo({ size = 14 }: { size?: number }) {
  // Spark glyph — Google Gemini mark, monochrome accent so it reads
  // alongside the violet border in the filtered trigger state.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M8 1.5c.4 2.4 1.3 4.1 2.7 5.1 1 .8 2.3 1.2 3.8 1.4-1.5.2-2.8.6-3.8 1.4-1.4 1-2.3 2.7-2.7 5.1-.4-2.4-1.3-4.1-2.7-5.1-1-.8-2.3-1.2-3.8-1.4 1.5-.2 2.8-.6 3.8-1.4C6.7 5.6 7.6 3.9 8 1.5z"
        fill="#6c47ff"
      />
    </svg>
  );
}

function ItalianFlag({ width = 16, height = 11 }: { width?: number; height?: number }) {
  // Three equal vertical stripes — green, white, red. Tiny grey border
  // so the white stripe doesn't disappear against the white button bg.
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 11"
      aria-hidden
      style={{
        borderRadius: 1,
        border: "1px solid rgba(0,0,0,0.08)",
        display: "block",
      }}
    >
      <rect x="0"     y="0" width="5.33" height="11" fill="#008C45" />
      <rect x="5.33"  y="0" width="5.34" height="11" fill="#F4F5F0" />
      <rect x="10.67" y="0" width="5.33" height="11" fill="#CD212A" />
    </svg>
  );
}

/* ─── Popover wrapper handling outside click + Escape ──────────────── */
function Popover({
  open,
  onClose,
  children,
  triggerRef,
  align = "left",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  align?: "left" | "right";
}) {
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        [align]: 0,
        minWidth: 220,
        background: brand.bg,
        border: `1px solid ${brand.border}`,
        borderRadius: 8,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        zIndex: 20,
        padding: 6,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Row inside a popover ────────────────────────────────────────────
   `locked` rows look disabled (greyed out, padlock icon). Clicking them
   does nothing; the sales CTA appears as a footer on the popover. */
function PopoverRow({
  label,
  selected,
  locked = false,
}: {
  label: string;
  selected: boolean;
  locked?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        borderRadius: 5,
        cursor: locked ? "not-allowed" : "default",
        opacity: locked ? 0.5 : 1,
      }}
    >
      {/* Selected/check radio */}
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          background: selected ? brand.color : "transparent",
          border: `1.5px solid ${selected ? brand.color : "rgba(0,0,0,0.18)"}`,
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden
      >
        {selected && (
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: 13,
          fontWeight: selected ? 600 : 500,
          color: brand.text,
        }}
      >
        {label}
      </span>
      {locked && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: brand.muted, flexShrink: 0 }}
          aria-hidden
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )}
    </div>
  );
}

/* ─── Sales CTA footer (used in locked popovers) ──────────────────── */
function SalesCtaRow({ message }: { message: string }) {
  return (
    <div
      style={{
        marginTop: 4,
        padding: "10px 10px 8px",
        borderTop: `1px solid ${brand.border}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 11,
          color: brand.muted,
          lineHeight: 1.45,
          marginBottom: 6,
        }}
      >
        {message}
      </p>
      <a
        href="https://calendly.com/vito-guglielmino-refinea/30min"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 600,
          color: brand.color,
          textDecoration: "none",
        }}
      >
        Contact sales →
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MODEL TOGGLE — Gemini active, others locked behind sales CTA.
   ═══════════════════════════════════════════════════════════════════ */
function ModelToggle() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <Trigger
        label="Gemini"
        open={open}
        filtered
        leading={<GeminiLogo />}
        onClick={() => setOpen((v) => !v)}
      />
      <Popover open={open} onClose={() => setOpen(false)} triggerRef={ref}>
        <PopoverRow label="Gemini" selected />
        <PopoverRow label="ChatGPT" selected={false} locked />
        <PopoverRow label="Claude" selected={false} locked />
        <PopoverRow label="Perplexity" selected={false} locked />
        <SalesCtaRow message="Other models are tracked on the Refinea platform — contact sales to unlock them in the public observatory." />
      </Popover>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REGION TOGGLE — Italy active, other regions locked.
   ═══════════════════════════════════════════════════════════════════ */
function RegionToggle() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <Trigger
        label="Italy"
        open={open}
        filtered
        leading={<ItalianFlag />}
        onClick={() => setOpen((v) => !v)}
      />
      <Popover open={open} onClose={() => setOpen(false)} triggerRef={ref}>
        <PopoverRow label="Italy" selected />
        <PopoverRow label="Spain" selected={false} locked />
        <PopoverRow label="France" selected={false} locked />
        <PopoverRow label="Germany" selected={false} locked />
        <PopoverRow label="United Kingdom" selected={false} locked />
        <SalesCtaRow message="More regions are coming to Refinea Analysis — contact sales to unlock a new market." />
      </Popover>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TIME RANGE TOGGLE — controlled by the parent view, drives the AVI
   fetch (`?days=7|30|90`). The previous-period delta in the response
   auto-resizes to match this window (see LANDING_INTEGRATION.md §3.3).
   ═══════════════════════════════════════════════════════════════════ */
const TIME_RANGES = [
  { value: 7,  label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 90, label: "Last 90 Days" },
] as const;

export type TimeRangeValue = (typeof TIME_RANGES)[number]["value"];

function TimeRangeToggle({
  value,
  onChange,
}: {
  value: TimeRangeValue;
  onChange: (v: TimeRangeValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = TIME_RANGES.find((r) => r.value === value) ?? TIME_RANGES[0];

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <Trigger
        label={current.label}
        open={open}
        onClick={() => setOpen((v) => !v)}
      />
      <Popover open={open} onClose={() => setOpen(false)} triggerRef={ref} align="right">
        {TIME_RANGES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => {
              onChange(r.value);
              setOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 10px",
              borderRadius: 5,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              font: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = brand.accentSoft)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: `1.5px solid ${
                  r.value === value ? brand.color : "rgba(0,0,0,0.18)"
                }`,
                background: r.value === value ? brand.color : "transparent",
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {r.value === value && (
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
              )}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: r.value === value ? 600 : 500,
                color: brand.text,
              }}
            >
              {r.label}
            </span>
          </button>
        ))}
      </Popover>
    </div>
  );
}

/* ─── Public assembly ──────────────────────────────────────────────── */
export function HeaderToggles({
  days,
  onChangeDays,
}: {
  days: TimeRangeValue;
  onChangeDays: (d: TimeRangeValue) => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
      }}
    >
      <ModelToggle />
      <RegionToggle />
      <TimeRangeToggle value={days} onChange={onChangeDays} />
    </div>
  );
}
