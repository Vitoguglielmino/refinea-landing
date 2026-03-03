// IndexNow - notify search engines of new/updated URLs
//
// Usage:
//   POST /api/indexnow
//   Header: x-secret: <REVALIDATION_SECRET>
//   Body (JSON): { "urls": ["https://refinea.io/blog/my-post"] }
//
// Or omit "urls" to submit all known pages (homepage + blog posts)

import { NextRequest, NextResponse } from "next/server";
import { getAllPostMetas } from "@/lib/mdx";

export const runtime = "nodejs";

const INDEXNOW_KEY = "72f1b07e14794359aa117eced1c5740b";
const HOST = "refinea.io";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(req: NextRequest) {
  /* ── Auth ── */
  const secret = req.headers.get("x-secret");
  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ── Build URL list ── */
  let urls: string[];

  try {
    const body = await req.json().catch(() => null);
    if (body?.urls && Array.isArray(body.urls) && body.urls.length > 0) {
      urls = body.urls;
    } else {
      // Default: submit all known pages
      const posts = getAllPostMetas();
      urls = [
        `https://${HOST}/`,
        `https://${HOST}/blog`,
        `https://${HOST}/pricing`,
        `https://${HOST}/team`,
        ...posts.map((p) => `https://${HOST}/blog/${p.slug}`),
      ];
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  /* ── Submit to IndexNow ── */
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({
    submitted: true,
    count: urls.length,
    urls,
    indexNowStatus: res.status,
  });
}
