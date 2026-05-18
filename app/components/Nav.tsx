"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

/* Language toggle: shows the *other* locale's code (EN ↔ IT) and switches
   to it on click, keeping the current pathname.

   The two directions are deliberately asymmetric:
   - EN → IT: uses next-intl `<Link locale="it">` for a soft client-side
     RSC navigation (no full document reload, no JS chunks re-fetched).
     next-intl writes the URL as `/it/<path>`.
   - IT → EN: uses a native `<a href="/<path>">` because next-intl's
     `<Link>` with `locale="en"` would emit `/en/<path>` under our
     `localePrefix: "as-needed"` config, forcing a middleware redirect
     hop. The plain anchor goes directly to the prefix-free URL and
     triggers a full document load — slower than soft nav, but only
     ~50–80 ms on a fully-static page and avoids the visible /en
     URL in the link.

   Query string is intentionally NOT preserved — `useSearchParams` would
   force the toggle subtree to deopt to client-only rendering on static
   pages, making it invisible to crawlers and during initial paint. */
function LanguageToggle({ onClick }: { onClick?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const className =
    "text-sm text-black/60 hover:text-black transition-colors whitespace-nowrap font-medium";
  const style = { padding: "7px 10px" };

  if (locale === "en") {
    // EN → IT: soft client-side navigation.
    return (
      <Link href={pathname} locale="it" onClick={onClick} className={className} style={style}>
        IT
      </Link>
    );
  }
  // IT → EN: native anchor to the prefix-free URL.
  // `pathname` from next-intl's usePathname() does NOT include the locale
  // segment, so `/team` is what we want here.
  const href = pathname === "/" ? "/" : pathname;
  return (
    <a href={href} onClick={onClick} className={className} style={style}>
      EN
    </a>
  );
}

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

/* Mega-menu icons — copied 1:1 from the platform sidebar (Sidebar.tsx
   getIcon switch). Same stroke width and viewBox so the visual identity
   between marketing site and product stays consistent. */
import { SidebarIcon } from "./SidebarIcons";

const Icon = {
  personas:    <SidebarIcon seg="personas"       size={16} />,
  visibility:  <SidebarIcon seg="overview"       size={16} />,
  citations:   <SidebarIcon seg="sources"        size={16} />,
  content:     <SidebarIcon seg="improve"        size={16} />,
  workflows:   <SidebarIcon seg="audit"          size={16} />,
  brandMemory: <SidebarIcon seg="brand-memory"   size={16} />,
};

/* Resources mega-menu items. Blog is live; the other two are placeholders
   for content we'll publish later — marked "Coming soon" and disabled. */
type ResourcesItem = {
  icon: React.ReactNode;
  key: "blog" | "docs" | "analysis";
  href: string;
  disabled?: boolean;
};

const RESOURCES_ITEMS: ResourcesItem[] = [
  { icon: <SidebarIcon seg="lightbulb" size={16} />, key: "blog",     href: "/blog" },
  { icon: <SidebarIcon seg="docs" size={16} />,      key: "docs",     href: "/docs" },
  { icon: <SidebarIcon seg="axes" size={16} />,      key: "analysis", href: "/refinea-analysis" },
];

/* Mega-menu items, each links to a section ID inside the landing page. */
type PlatformItem = {
  icon: React.ReactNode;
  key: "personas" | "visibility" | "citations" | "content" | "workflows" | "brandMemory";
  href: string;
};

const PLATFORM_ITEMS: PlatformItem[] = [
  { icon: Icon.personas,    key: "personas",    href: "/#intelligence" },
  { icon: Icon.visibility,  key: "visibility",  href: "/#monitoring" },
  { icon: Icon.citations,   key: "citations",   href: "/#sources" },
  { icon: Icon.content,     key: "content",     href: "/#content" },
  { icon: Icon.workflows,   key: "workflows",   href: "/#workflows" },
  { icon: Icon.brandMemory, key: "brandMemory", href: "/#brand-memory" },
];

export default function Nav() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformMobileOpen, setPlatformMobileOpen] = useState(false);
  const [resourcesMobileOpen, setResourcesMobileOpen] = useState(false);

  const linkClass =
    "text-sm text-black/50 hover:text-black transition-colors whitespace-nowrap";

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-[#6400ca]/[0.08] safe-px">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/refinea%20grigio.svg"
            alt="Refinea logo"
            style={{ height: 36, width: 36, objectFit: "contain", marginRight: -5 }}
          />
          <span className="text-base font-bold tracking-tight text-black">
            Refinea
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Locale toggle sits at the left of the nav group — separate
             from the auth CTAs on the right, where it lived before. */}
          <LanguageToggle />
          {/* Platform mega-menu */}
          <div className="relative group">
            <button className={`${linkClass} flex items-center gap-1`}>
              {t("platform")}
              <ChevronDown />
            </button>
            <div
              className="absolute top-full left-1/2 pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150 z-50"
              style={{ transform: "translateX(-50%)" }}
            >
              <div
                className="bg-white rounded-xl border border-black/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-2"
                style={{
                  width: 620,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  columnGap: 4,
                  rowGap: 2,
                }}
              >
                {PLATFORM_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="rounded-lg hover:bg-black/[0.03] transition-colors"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "10px 12px",
                      minWidth: 0,
                    }}
                  >
                    <span
                      className="text-accent"
                      style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      {item.icon}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
                      <span className="text-sm font-semibold text-black leading-tight">
                        {t(`platformItems.${item.key}.title`)}
                      </span>
                      <span className="text-xs text-black/50 leading-snug">
                        {t(`platformItems.${item.key}.desc`)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/pricing" className={linkClass}>{t("pricing")}</Link>

          {/* Resources mega-menu */}
          <div className="relative group">
            <button className={`${linkClass} flex items-center gap-1`}>
              {t("resources")}
              <ChevronDown />
            </button>
            <div
              className="absolute top-full left-1/2 pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150 z-50"
              style={{ transform: "translateX(-50%)" }}
            >
              <div
                className="bg-white rounded-xl border border-black/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-2"
                style={{ width: 280, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {RESOURCES_ITEMS.map((item) =>
                  item.disabled ? (
                    <div
                      key={item.key}
                      aria-disabled
                      className="rounded-lg cursor-default"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        opacity: 0.55,
                      }}
                    >
                      <span
                        className="bg-black/[0.04] text-black/40"
                        style={{
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium text-black/55 leading-tight flex-1 min-w-0">
                        {t(`resourcesItems.${item.key}`)}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "rgba(0,0,0,0.05)",
                          color: "rgba(0,0,0,0.45)",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t("resourcesItems.soonBadge")}
                      </span>
                    </div>
                  ) : (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="rounded-lg hover:bg-black/[0.03] transition-colors"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                      }}
                    >
                      <span
                        className="text-accent"
                        style={{
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium text-black leading-tight">
                        {t(`resourcesItems.${item.key}`)}
                      </span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          <Link href="/team" className={linkClass}>{t("team")}</Link>

          {/* Auth actions — visually separated from the nav links */}
          <div className="flex items-center gap-2 ml-4 pl-5 border-l border-black/[0.08]">
            <a
              href="https://platform.refinea.io"
              className="text-sm text-black/60 hover:text-black transition-colors whitespace-nowrap"
              style={{ padding: "7px 10px" }}
            >
              {t("logIn")}
            </a>
            <a
              href="https://platform.refinea.io"
              className="inline-flex items-center text-white bg-accent hover:bg-accent/90 active:scale-[0.98] transition-all"
              style={{
                padding: "7px 14px",
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid transparent",
                borderRadius: 6,
                whiteSpace: "nowrap",
                lineHeight: 1.2,
              }}
            >
              {t("signUp")}
            </a>
          </div>
        </div>

        {/* Mobile right side: CTA + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <a
            href="https://platform.refinea.io"
            className="inline-flex items-center justify-center text-white bg-accent hover:bg-accent/90 transition-colors shrink-0"
            style={{
              minHeight: 40,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 500,
              border: "1px solid transparent",
              borderRadius: 8,
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}
          >
            {t("signUp")}
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex flex-col justify-center items-center w-11 h-11 gap-[5px] -mr-1.5"
            aria-label={t("toggleMenu")}
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-black/[0.05] max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <nav className="mx-auto max-w-[1100px] px-4 py-4 flex flex-col gap-1 safe-pb">
            {/* Platform collapsible */}
            <button
              onClick={() => setPlatformMobileOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors"
            >
              {t("platform")}
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className={`transition-transform duration-200 ${platformMobileOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {platformMobileOpen && (
              <div className="pl-3 pb-2 flex flex-col gap-0.5">
                {PLATFORM_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-black/70 hover:text-black hover:bg-black/[0.03] transition-colors"
                  >
                    <span className="shrink-0 w-6 h-6 text-accent flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span className="leading-snug">{t(`platformItems.${item.key}.title`)}</span>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors"
            >
              {t("pricing")}
            </Link>
            {/* Resources collapsible (mirrors Platform) */}
            <button
              onClick={() => setResourcesMobileOpen((v) => !v)}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors"
            >
              {t("resources")}
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className={`transition-transform duration-200 ${resourcesMobileOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {resourcesMobileOpen && (
              <div className="pl-3 pb-2 flex flex-col gap-0.5">
                {RESOURCES_ITEMS.map((item) =>
                  item.disabled ? (
                    <div
                      key={item.key}
                      aria-disabled
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-black/40"
                    >
                      <span className="shrink-0 w-6 h-6 rounded-md bg-black/[0.04] text-black/35 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="leading-snug inline-flex items-center gap-2">
                        {t(`resourcesItems.${item.key}`)}
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            padding: "1px 5px",
                            borderRadius: 3,
                            background: "rgba(0,0,0,0.05)",
                            color: "rgba(0,0,0,0.45)",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t("resourcesItems.soonBadge")}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-black/70 hover:text-black hover:bg-black/[0.03] transition-colors"
                    >
                      <span className="shrink-0 w-6 h-6 text-accent flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span className="leading-snug">{t(`resourcesItems.${item.key}`)}</span>
                    </Link>
                  )
                )}
              </div>
            )}
            <Link
              href="/team"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/[0.03] transition-colors"
            >
              {t("team")}
            </Link>
            <div className="pt-2 mt-1 border-t border-black/[0.05] flex flex-col gap-2">
              <div className="flex justify-center">
                <LanguageToggle onClick={() => setMobileOpen(false)} />
              </div>
              <a
                href="https://platform.refinea.io"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full bg-white hover:border-black/15 transition-colors"
                style={{
                  minHeight: 44,
                  padding: "12px 14px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.75)",
                  border: "1px solid rgba(0,0,0,0.09)",
                  borderRadius: 8,
                  lineHeight: 1.2,
                }}
              >
                {t("logIn")}
              </a>
              <a
                href="https://platform.refinea.io"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full bg-accent text-white hover:bg-accent/90 transition-colors"
                style={{
                  minHeight: 44,
                  padding: "12px 14px",
                  fontSize: 14,
                  fontWeight: 500,
                  border: "1px solid transparent",
                  borderRadius: 8,
                  lineHeight: 1.2,
                }}
              >
                {t("signUp")}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
