// WordPress publish webhook - triggers ISR revalidation
//
// In WordPress:
//  1. Install "WP Webhooks" or use ACF + custom action
//  2. On post publish/update, send POST to:
//     https://refinea.io/api/revalidate?secret=<REVALIDATION_SECRET>
//  3. Set REVALIDATION_SECRET in .env.local + Vercel env vars

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("wp-posts", "max");

  return NextResponse.json({ revalidated: true, ts: Date.now() });
}
