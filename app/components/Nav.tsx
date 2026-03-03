"use client";

import { useState } from "react";
import Link from "next/link";

const ChevronDown = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-transform group-hover:rotate-180 duration-200"
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass =
    "text-sm text-black/50 hover:text-black transition-colors whitespace-nowrap";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-[#6400ca]/[0.08]">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/logos/refinea%20grigio.svg"
            alt="Refinea logo"
            style={{ height: 36, width: 36, objectFit: "contain", marginRight: -5 }}
          />
          <span className="text-base font-bold tracking-tight text-black">
            Refinea
          </span>
        </Link>

        {/* Desktop nav - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/pricing" className={linkClass}>Pricing</a>

          {/* Resources dropdown */}
          <div className="relative group">
            <button className={`${linkClass} flex items-center gap-1`}>
              Resources
              <ChevronDown />
            </button>
            <div className="absolute top-full right-0 pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150 z-50">
              <div className="bg-white rounded-xl border border-black/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-1.5 min-w-[160px]">
                <span className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-black/30 rounded-lg cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/10 shrink-0" />
                  Documentation
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-black/25 bg-black/[0.04] px-1.5 py-0.5 rounded-full">Soon</span>
                </span>
                <Link href="/blog" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-black/60 hover:text-black hover:bg-black/[0.03] rounded-lg transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
                  Blog
                </Link>
              </div>
            </div>
          </div>

          <a href="/team" className={linkClass}>Team</a>

          <a
            href="/pricing"
            className="h-10 px-6 rounded-full bg-accent text-white text-[13px] font-semibold whitespace-nowrap hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center"
          >
            Start Now
          </a>
        </div>

        {/* Mobile right side: CTA + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <a
            href="/pricing"
            className="text-xs font-semibold text-white bg-accent hover:bg-accent/90 transition-colors h-11 px-5 rounded-full flex items-center shrink-0"
          >
            Start Now
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex flex-col justify-center items-center w-11 h-11 gap-[5px] -mr-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[1.5px] w-5 bg-black transition-all duration-200 origin-center ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-black transition-all duration-200 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-black transition-all duration-200 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-black/[0.05]">
          <nav className="mx-auto max-w-[1100px] px-4 py-4 flex flex-col gap-1">
            <a
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors"
            >
              Blog
            </Link>
            <span className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-black/25">
              Documentation
              <span className="text-[10px] font-semibold uppercase tracking-wide text-black/20 bg-black/[0.04] px-2 py-0.5 rounded-full">Soon</span>
            </span>
            <a
              href="/team"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors"
            >
              Team
            </a>
            <div className="pt-2 mt-1 border-t border-black/[0.05]">
              <a
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
              >
                Start Now
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
