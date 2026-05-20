// ISR revalidation webhook.
//
// Two consumers:
//  - WordPress publish webhook → flushes the `wp-posts` blog cache.
//    POST https://refinea.io/api/revalidate?secret=<SECRET>
//  - Marketing AVI corrections → flushes the `avi-data` cache so the
//    /refinea-analysis leaderboards pick up dictionary/leaderboard
//    fixes without waiting out the 24h window.
//    POST https://refinea.io/api/revalidate?secret=<SECRET>&tag=avi-data
//
// `secret` must match REVALIDATION_SECRET (.env.local + Vercel env).
// `tag` is optional and defaults to `wp-posts` so the existing
// WordPress webhook keeps working unchanged.

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Only tags the app actually caches against may be flushed — an
// arbitrary ?tag= value would be a no-op at best and confusing at worst.
const ALLOWED_TAGS = new Set(["wp-posts", "avi-data"]);

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tag = req.nextUrl.searchParams.get("tag") || "wp-posts";
  if (!ALLOWED_TAGS.has(tag)) {
    return NextResponse.json(
      { error: `Unknown tag '${tag}'. Allowed: ${[...ALLOWED_TAGS].join(", ")}` },
      { status: 400 },
    );
  }

  revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tag, ts: Date.now() });
}
