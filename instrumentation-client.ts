import posthog from 'posthog-js'

/**
 * PostHog init for the marketing site (refinea.io).
 *
 * Configured for GDPR-friendly anonymous tracking:
 * - `cookieless_mode: 'always'` — never sets a cookie, never writes to
 *   localStorage. Anonymous visitors are tracked via a privacy-preserving
 *   rotating hash that can't be tied back to an individual.
 * - `ip: false` — IP addresses are not captured or stored.
 * - `person_profiles: 'identified_only'` — person profiles are created
 *   ONLY when we explicitly call `posthog.identify()` (i.e. inside the
 *   authenticated platform at app.refinea.io). The landing never
 *   identifies users, so it never creates a profile.
 *
 * Because of these three settings, the marketing site collects no
 * personal data from anonymous visitors and does not require a cookie
 * consent banner under the ePrivacy Directive.
 *
 * Host is already EU Cloud (eu.i.posthog.com) via env — data stays in
 * the EEA, no cross-border transfer to flag.
 */
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2026-01-30',
  cookieless_mode: 'always',
  ip: false,
  person_profiles: 'identified_only',
  // `defaults: '2026-01-30'` sets capture_pageview to 'history_change',
  // which only fires on SPA navigations (pushState/replaceState/popstate).
  // The marketing site has multiple full-page routes, so we need a real
  // pageview on every load too — force it back to `true`.
  capture_pageview: true,
})
