"use client";

/**
 * CookiePrefsButton — Footer link that re-opens the cookie preferences
 * modal. The modal is owned by CookieBanner, which exposes a global
 * `window.refineaOpenCookiePrefs()` handle. We avoid importing the
 * cookieconsent library here to keep the Footer bundle small.
 */
export default function CookiePrefsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.refineaOpenCookiePrefs?.()}
      className="block text-sm text-white/60 hover:text-white transition-colors text-left bg-transparent border-0 cursor-pointer py-1.5 -my-1.5"
    >
      {label}
    </button>
  );
}
