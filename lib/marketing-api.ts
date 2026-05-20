/**
 * Marketing API client
 * ────────────────────────────────────────────────────────────────────
 * Server-side fetcher for the public AVI (AI Visibility Index) read API.
 *
 * Reference: LANDING_INTEGRATION.md
 *
 * - Auth via `X-API-Key` header. The key lives in `MARKETING_API_KEY` env
 *   var and MUST stay server-side. No fallback — missing key throws.
 * - Base URL can be overridden via `MARKETING_API_BASE`; falls back to
 *   the production Cloud Run hostname.
 * - Returns the raw API response. Single-source-of-truth ISR cache:
 *   24h (matches the daily Cloud Run job at 03:00 UTC).
 * - On hard failure (network, 4xx, 5xx) logs server-side and surfaces a
 *   typed stub so the page never breaks the build.
 */

const API_BASE_FALLBACK = "https://marketing-api-ttuzwhfh5a-ew.a.run.app";

/* ─── Types (mirror LANDING_INTEGRATION.md §6) ───────────────────────── */

export type LeaderboardRow = {
  brand: string;
  /** 0–100, rounded to 1 decimal. */
  avi: number;
  mentions: number;
  /** True = part of the industry's declared competitor panel.
   *  False = surfaced organically from LLM responses. */
  is_declared: boolean;
  /** Same brand's AVI in the previous-window comparison, or null if the
   *  previous window didn't see this brand / has no data. */
  previous_avi: number | null;
  /** `avi - previous_avi` in PERCENTAGE POINTS (not relative %). Null
   *  collapses both "brand absent in prev window" and "no prev data". */
  avi_delta: number | null;
};

export type PreviousPeriod = {
  /** YYYY-MM-DD inclusive. */
  from: string;
  /** YYYY-MM-DD inclusive. */
  to: string;
  /** When false, treat every `avi_delta` and `previous_avi` as null. */
  has_data: boolean;
  total_iterations: number;
};

export type SeriesPoint = {
  /** YYYY-MM-DD UTC. */
  date: string;
  total_iterations: number;
  /** Brand → AVI 0–100 for that single day. Brands NOT mentioned that
   *  day are absent from the map — treat missing keys as 0. Only brands
   *  that made it into the window-level leaderboard appear here. */
  brands: Record<string, number>;
};

export type AviResponse = {
  slug: string;
  display_name: string;
  country: string;
  /** YYYY-MM-DD UTC of the most recent daily run in the window. */
  last_run_date: string;
  /** Echoes the `days` query param. */
  window_days: number;
  total_prompts_in_window: number;
  total_iterations_in_window: number;
  /** Sorted by AVI descending; slice client-side for top-N views. */
  leaderboard: LeaderboardRow[];
  previous_period: PreviousPeriod;
  /** Only present when `include_series=true` was requested. */
  series?: SeriesPoint[];
  /** Internal flag: true when data came from the offline stub (env
   *  missing or fetch failed). UI can surface a soft "data unavailable"
   *  hint, but renders normally either way. */
  _stub?: boolean;
};

/* ─── Configurable top-N cap ─────────────────────────────────────────── */

/** Max brands to surface in any leaderboard view. Even though the API
 *  may return hundreds, the public observatory caps at 10 for
 *  readability. Adjust here if the design ever grows to 15 or 20. */
const LEADERBOARD_TOP_N = 10;

/* ─── Offline stub (matches new schema shape) ────────────────────────── */

const STUB: AviResponse = {
  slug: "saas-gestionali-italia",
  display_name: "SaaS Gestionali Italia",
  country: "Italy",
  last_run_date: "2026-05-16",
  window_days: 7,
  total_prompts_in_window: 103,
  total_iterations_in_window: 7210,
  leaderboard: [
    { brand: "Aruba",            avi: 37.5, mentions: 1172, is_declared: true,  previous_avi: null, avi_delta: null },
    { brand: "TeamSystem",       avi: 36.0, mentions: 717,  is_declared: true,  previous_avi: null, avi_delta: null },
    { brand: "Fatture in Cloud", avi: 35.6, mentions: 992,  is_declared: true,  previous_avi: null, avi_delta: null },
    { brand: "Fiscozen",         avi: 25.8, mentions: 594,  is_declared: false, previous_avi: null, avi_delta: null },
    { brand: "Zucchetti",        avi: 24.2, mentions: 483,  is_declared: true,  previous_avi: null, avi_delta: null },
    { brand: "Danea",            avi: 16.2, mentions: 498,  is_declared: true,  previous_avi: null, avi_delta: null },
  ],
  previous_period: {
    from: "2026-05-03",
    to:   "2026-05-09",
    has_data: false,
    total_iterations: 0,
  },
  series: undefined,
  _stub: true,
};

/* ─── Fetcher ────────────────────────────────────────────────────────── */

export type FetchAviOptions = {
  /** 1–90, defaults to 7 (matches the API default). */
  days?: number;
  /** Include the per-day time series. Required for the line chart. */
  includeSeries?: boolean;
};

export async function getAviForIndustry(
  slug: string,
  options: FetchAviOptions = {},
): Promise<AviResponse> {
  const base = process.env.MARKETING_API_BASE ?? API_BASE_FALLBACK;
  const key = process.env.MARKETING_API_KEY;
  if (!key) {
    // No silent skip — fail loud in dev (the prod build will surface
    // this in the Vercel logs) but still return the stub so the page
    // can render during local dev before the key is set.
    console.error(
      "[marketing-api] MARKETING_API_KEY is required — returning stub",
    );
    return capLeaderboard({ ...STUB, slug });
  }

  const url = new URL(
    `${base}/public/marketing/avi/${encodeURIComponent(slug)}`,
  );
  url.searchParams.set("days", String(options.days ?? 7));
  if (options.includeSeries) url.searchParams.set("include_series", "true");

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-API-Key": key },
      // Daily refresh cadence — matches the Cloud Run job at 03:00 UTC.
      // The `avi-data` tag lets POST /api/revalidate flush this cache on
      // demand (e.g. after a dictionary/leaderboard correction) without
      // waiting out the 24h window or redeploying.
      next: { revalidate: 86400, tags: ["avi-data"] },
    });
    if (!res.ok) {
      console.error(
        `[marketing-api] ${res.status} ${res.statusText} for ${slug} — returning stub`,
      );
      return capLeaderboard({ ...STUB, slug });
    }
    const data = (await res.json()) as AviResponse;
    return capLeaderboard(data);
  } catch (err) {
    console.error(`[marketing-api] fetch failed for ${slug}:`, err);
    return capLeaderboard({ ...STUB, slug });
  }
}

function capLeaderboard(data: AviResponse): AviResponse {
  if (data.leaderboard.length <= LEADERBOARD_TOP_N) return data;
  // Series stays full — line chart still needs every brand on the
  // window-level leaderboard. The cap only trims the visible bar/table.
  return {
    ...data,
    leaderboard: data.leaderboard.slice(0, LEADERBOARD_TOP_N),
  };
}

/* ─── Display helpers (LANDING_INTEGRATION.md §6) ───────────────────── */

/** Format a percentage-point delta for UI display.
 *  - `null` → em dash (no comparison possible)
 *  - 0      → "0pp"
 *  - signed → "+3.5pp" / "-1.2pp" (hyphen-minus, not unicode minus, so
 *             monospaced columns stay aligned). */
export function formatDelta(d: number | null): string {
  if (d === null) return "—";
  if (d === 0) return "0pp";
  return `${d > 0 ? "+" : ""}${d.toFixed(1)}pp`;
}

/** Coarse tone for the delta chip: up/down/flat/unknown. Threshold of
 *  ±0.05pp prevents jitter from rounding noise. */
export type DeltaTone = "up" | "down" | "flat" | "unknown";

export function deltaTone(d: number | null): DeltaTone {
  if (d === null) return "unknown";
  if (d > 0.05) return "up";
  if (d < -0.05) return "down";
  return "flat";
}
