"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/mdx";

// ─── AI Deep Links ─────────────────────────────────────────────────────────────

function buildAiLinks(articleUrl: string) {
  const prompt = encodeURIComponent(
    `Read from ${articleUrl} so I can ask questions about it. Analyze the key findings regarding AI visibility for my brand.`
  );
  return {
    chatgpt: `https://chatgpt.com/?q=${prompt}`,
    claude: `https://claude.ai/new?q=${prompt}`,
  };
}

// ─── TOC ───────────────────────────────────────────────────────────────────────

function TableOfContents({
  headings,
  activeId,
}: {
  headings: Heading[];
  activeId: string | null;
}) {
  if (headings.length === 0) return null;

  return (
    <nav>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30 mb-3">
        Contents
      </p>
      <ul className="space-y-0.5">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block leading-snug py-[3px] pl-3 text-[13px] border-l-2 transition-all duration-200 ${
                  isActive
                    ? "border-accent font-medium"
                    : "border-transparent hover:border-black/15"
                }`}
                style={{
                  color: isActive ? "#6c47ff" : "#666",
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Mobile TOC toggle ─────────────────────────────────────────────────────────

export function MobileTOC({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;

  return (
    <div className="lg:hidden mb-8 rounded-xl border border-black/[0.07] bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-black"
      >
        <span className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 3h12M1 7h8M1 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Contents
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-black/[0.05]">
          <ul className="space-y-0.5 pt-3">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-1 hover:text-black transition-colors ${
                    false && h.level === 3
                      ? "pl-4 text-[12px] text-black/35"
                      : "text-[13px] text-black/55"
                  }`}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main sidebar ──────────────────────────────────────────────────────────────

export default function ArticleSidebar({
  headings,
  articleUrl,
}: {
  headings: Heading[];
  articleUrl: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const links = buildAiLinks(articleUrl);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  return (
    <aside className="hidden lg:flex flex-col gap-8 sticky top-24 self-start">
      {/* TOC */}
      <TableOfContents headings={headings} activeId={activeId} />

      {/* Divider */}
      {headings.length > 0 && (
        <div className="h-px bg-black/[0.06]" />
      )}

      {/* Explore with AI */}
      <div className="rounded-xl border border-black/[0.07] bg-[#F9FAFB] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/30 mb-3">
          Explore with AI
        </p>
        <div className="space-y-2">
          <a
            href={links.chatgpt}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-black/[0.07] bg-white text-[13px] font-medium text-black/70 hover:text-black hover:border-black/[0.15] hover:shadow-sm transition-all duration-150 group"
          >
            <span className="flex items-center gap-2">
              {/* ChatGPT icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4.5 9C4.5 7.343 5.343 6.5 7 6.5S9.5 7.343 9.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="4.5" r="0.75" fill="currentColor" />
              </svg>
              Open in ChatGPT
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href={links.claude}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg border border-black/[0.07] bg-white text-[13px] font-medium text-black/70 hover:text-black hover:border-black/[0.15] hover:shadow-sm transition-all duration-150 group"
          >
            <span className="flex items-center gap-2">
              {/* Claude icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L12.5 10.5H1.5L7 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M7 6v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="10" r="0.5" fill="currentColor" />
              </svg>
              Open in Claude
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="opacity-40 group-hover:opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <p className="text-[11px] text-black/25 mt-3 leading-relaxed font-mono">
          {">"} pre-fills a research prompt
        </p>
      </div>
    </aside>
  );
}
