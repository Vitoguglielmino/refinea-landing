/**
 * /api/avi — server-side proxy for the marketing AVI endpoint.
 *
 * The client RefineaAnalysisView calls this when the user changes the
 * industry or window-days toggles. We can't call the marketing API
 * directly from the browser because `MARKETING_API_KEY` is server-only,
 * so the route handler injects the auth header and returns the JSON
 * verbatim.
 *
 * Caching: the heavy 24h cache lives on the upstream `fetch` inside
 * `getAviForIndustry` (tagged `avi-data`, so POST /api/revalidate can
 * flush it on demand). This handler itself only revalidates hourly —
 * it is a thin proxy, cheap to re-run, and a short window here means a
 * tag flush is reflected to clients quickly instead of being masked by
 * a stale 24h route response.
 */
import { NextRequest, NextResponse } from "next/server";
import { getAviForIndustry } from "@/lib/marketing-api";
import { getIndustry } from "@/lib/industries";

export const revalidate = 3600;

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
