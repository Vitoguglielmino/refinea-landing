"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MockupShell — responsive container for fixed-width platform mockups.
 *
 * Desktop (≥ md / 768px): renders children at natural width, no scaling.
 * Mobile (< 768px): measures available width and applies `transform: scale()`
 *   so the entire mockup fits the viewport without horizontal scroll.
 *   The wrapper height is reduced proportionally so layout flows naturally.
 *
 * Pattern: Linear / Vercel / Resend preview frames.
 */
export default function MockupShell({
  children,
  minWidth = 980,
}: {
  children: React.ReactNode;
  minWidth?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [innerHeight, setInnerHeight] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const update = () => {
      const containerWidth = container.clientWidth;
      // Above md (768px) we don't scale — natural rendering.
      if (window.innerWidth >= 768) {
        setScale(1);
        setInnerHeight(null);
        return;
      }
      const next = Math.min(1, containerWidth / minWidth);
      setScale(next);
      // Read natural height of inner content and apply scaled height to
      // the outer wrapper so flow below is correct.
      const naturalH = inner.scrollHeight;
      setInnerHeight(naturalH * next);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    // Re-measure once children paint (charts, fonts).
    const t = window.setTimeout(update, 50);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.clearTimeout(t);
    };
  }, [minWidth]);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        height: innerHeight ?? "auto",
        overflow: "hidden",
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: minWidth,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
