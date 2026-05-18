import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * i18n routing configuration.
 *
 * `localePrefix: "as-needed"` means the default locale (en) has no prefix
 * (refinea.io/pricing), while other locales do (refinea.io/it/pricing).
 */
export const routing = defineRouting({
  locales: ["en", "it"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Don't auto-redirect based on Accept-Language. Default locale (en) is shown
  // unless the user explicitly visits /it/...
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
