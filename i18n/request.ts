import { getRequestConfig } from "next-intl/server";

/**
 * Resolves the active locale for the incoming request.
 *
 * `requestLocale` comes from the next-intl middleware (or from
 * `setRequestLocale` in a layout/page). If it isn't a supported locale,
 * we fall back to the default (`en`) so the app never crashes.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !["en", "it"].includes(locale)) {
    locale = "en";
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
