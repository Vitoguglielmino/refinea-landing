/**
 * SidebarIcons
 * ────────────────────────────────────────────────────────────────────────
 * Icon set copied verbatim from the platform sidebar (Sidebar.tsx
 * `getIcon` switch). Used across the marketing site (Nav mega-menu, Action
 * cards) so the visual identity stays consistent with the product.
 *
 * Source: /tmp/platform-reference/src/components/navigation/Sidebar.tsx
 *         lines 78-178
 *
 * Stroke is currentColor so the parent can control color via Tailwind
 * `text-*` utilities or inline `color`. Default strokeWidth: 1.8.
 */

export type SidebarSegment =
  | "overview"
  | "personas"
  | "lightbulb"
  | "axes"
  | "sources"
  | "improve"
  | "audit"
  | "brand-memory"
  | "settings"
  | "docs";

export function SidebarIcon({
  seg,
  size = 20,
  strokeWidth = 1.8,
}: {
  seg: SidebarSegment;
  size?: number;
  strokeWidth?: number;
}) {
  const stroke = "currentColor";
  const sw = strokeWidth;

  switch (seg) {
    case "overview":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke={stroke} strokeWidth={sw} />
          <line x1="3" y1="9" x2="21" y2="9" stroke={stroke} strokeWidth={sw} />
          <circle cx="7" cy="7" r="1" fill="currentColor" />
          <circle cx="11" cy="7" r="1" fill="currentColor" />
          <circle cx="15" cy="7" r="1" fill="currentColor" />
        </svg>
      );
    case "personas":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="9" cy="8.5" r="3" stroke={stroke} strokeWidth={sw} />
          <path d="M4.5 18c0-2.5 2.5-4.5 5.5-4.5s5.5 2 5.5 4.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="17" cy="9.5" r="2.5" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case "lightbulb":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 21h6M12 3a6 6 0 0 1 4 10.47V17a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-3.53A6 6 0 0 1 12 3z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "axes":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          {/* Y-axis (vertical, with arrow at top) */}
          <path d="M5 21V4m0 0l-2 2m2-2l2 2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          {/* X-axis (horizontal, with arrow at right) */}
          <path d="M3 19h17m0 0l-2-2m2 2l-2 2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "sources":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke={stroke} strokeWidth={sw} />
          <path d="M14 3v5h5" stroke={stroke} strokeWidth={sw} />
          <line x1="9" y1="12" x2="15" y2="12" stroke={stroke} strokeWidth={sw} />
          <line x1="9" y1="16" x2="15" y2="16" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    case "improve":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="16 7 22 7 22 13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "audit":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="5" r="2.5" stroke={stroke} strokeWidth={sw} />
          <circle cx="6" cy="19" r="2.5" stroke={stroke} strokeWidth={sw} />
          <circle cx="18" cy="19" r="2.5" stroke={stroke} strokeWidth={sw} />
          <path d="M12 7.5v4.5m0 0l-4.5 4.5m4.5-4.5l4.5 4.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "docs":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "settings":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={sw} />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "brand-memory":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          {/* Left hemisphere */}
          <path
            d="M12 5.2c-.7-1.3-2-2.2-3.6-2.2-2.2 0-4 1.7-4 3.9 0 .4.1.8.2 1.2-1 .6-1.6 1.6-1.6 2.8 0 .9.4 1.7 1 2.3-.4.5-.6 1.1-.6 1.8 0 1.4 1 2.5 2.3 2.8.1 1.6 1.4 2.8 3 2.8 1 0 1.9-.5 2.5-1.3"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right hemisphere */}
          <path
            d="M12 5.2c.7-1.3 2-2.2 3.6-2.2 2.2 0 4 1.7 4 3.9 0 .4-.1.8-.2 1.2 1 .6 1.6 1.6 1.6 2.8 0 .9-.4 1.7-1 2.3.4.5.6 1.1.6 1.8 0 1.4-1 2.5-2.3 2.8-.1 1.6-1.4 2.8-3 2.8-1 0-1.9-.5-2.5-1.3"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central fissure */}
          <path d="M12 5.2v14.3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          {/* Left fold */}
          <path d="M8.5 9c.6.4 1 1.1 1 1.9" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          {/* Right fold */}
          <path d="M15.5 9c-.6.4-1 1.1-1 1.9" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
  }
}
