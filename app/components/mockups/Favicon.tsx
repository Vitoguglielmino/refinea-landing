/**
 * Favicon
 * ────────────────────────────────────────────────────────────────────────
 * Reusable favicon component for mockups. Tries multiple sources in order:
 *
 *   1. Google s2 with sz=128 (high-res, sharp when scaled to 16-44px)
 *   2. DuckDuckGo ip3 (no logging, decent quality)
 *   3. Initials fallback (colored badge)
 *
 * Google is fetched at 128px so when the browser scales it down to 22-44px
 * it stays sharp. DDG often returns 16x16 ICOs which upscale blurry.
 *
 * Usage:
 *   <Favicon domain="gucci.com" initials="G" color="#000" size={22} isOwner />
 */

"use client";

import { useState } from "react";

type Props = {
  domain: string;
  initials: string;
  color: string;
  size?: number;
  isOwner?: boolean;
};

const SOURCES = [
  (d: string) => `https://www.google.com/s2/favicons?domain=${d}&sz=128`,
  (d: string) => `https://icons.duckduckgo.com/ip3/${d}.ico`,
];

export function Favicon({
  domain,
  initials,
  color,
  size = 22,
  isOwner = false,
}: Props) {
  const [sourceIdx, setSourceIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  const radius = Math.max(4, Math.round(size * 0.27));
  const ring = isOwner
    ? {
        outline: `2px solid rgba(108,71,255,0.2)`,
        outlineOffset: "1px",
      }
    : {};

  if (failed) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: color,
          color: "#fff",
          fontFamily:
            "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', monospace",
          fontSize: Math.round(size * 0.4),
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          ...ring,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SOURCES[sourceIdx](domain)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => {
        if (sourceIdx < SOURCES.length - 1) {
          setSourceIdx(sourceIdx + 1);
        } else {
          setFailed(true);
        }
      }}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: "#fff",
        flexShrink: 0,
        objectFit: "contain",
        ...ring,
      }}
    />
  );
}
