/**
 * /api/avi — server-side proxy for the marketing AVI endpoint.
 *
 * The client RefineaAnalysisView calls this when the user changes the
 * industry or window-days toggles. We can't call the marketing API
 * directly from the browser because `MARKETING_API_KEY` is server-only,
 * so the route handler injects the auth header and returns the JSON
 * verbatim.
 *
 * Caching matches the page-level ISR: 24h. Every `(slug, days)`
 * combination is its own cache key on Vercel's edge — first user pays
 * the latency, everyone else hits the cache.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAviForIndustry } from "@/lib/marketing-api";
import { getIndustry } from "@/lib/industries";

export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const daysRaw = req.nextUrl.searchParams.get("days");
  const days = daysRaw ? Number(daysRaw) : 7;

  if (!slug) {
    return NextResponse.json({ error: "missing slug" }, { status: 400 });
  }
  // Reject slugs that aren't in the registry — keeps stray ?slug=foo
  // probes from spinning up unnecessary upstream traffic.
  const industry = getIndustry(slug);
  if (!industry || industry.status !== "active") {
    return NextResponse.json(
      { error: `industry "${slug}" is not active` },
      { status: 404 },
    );
  }
  if (!Number.isFinite(days) || days < 1 || days > 90) {
    return NextResponse.json(
      { error: "days must be between 1 and 90" },
      { status: 400 },
    );
  }

  const data = await getAviForIndustry(slug, { days, includeSeries: true });
  return NextResponse.json(data);
}
