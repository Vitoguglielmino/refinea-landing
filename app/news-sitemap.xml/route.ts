/**
 * Google News sitemap at /news-sitemap.xml.
 *
 * Only includes posts with section: "news" published in the last 2 days
 * (Google's News sitemap freshness window). This is the eligibility gate
 * for the Top Stories carousel — broken sitemap = no Top Stories at all.
 *
 * Linked from app/robots.ts to be discoverable.
 */

import { getAllPostMetas } from "@/lib/mdx";

const SITE_URL = "https://refinea.io";
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function postUrl(slug: string, locale: "en" | "it"): string {
  return locale === "it"
    ? `${SITE_URL}/it/blog/${slug}`
    : `${SITE_URL}/blog/${slug}`;
}

export async function GET() {
  const now = Date.now();
  const recent = getAllPostMetas()
    .filter((p) => p.section === "news")
    .filter((p) => now - new Date(p.date).getTime() <= TWO_DAYS_MS);

  const entries = recent
    .map((p) => {
      const url = postUrl(p.slug, p.locale);
      const language = p.locale === "it" ? "it" : "en";
      const publication =
        p.locale === "it" ? "Refinea Blog (IT)" : "Refinea Blog";
      const pubDate = new Date(p.date).toISOString();
      return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(publication)}</news:name>
        <news:language>${language}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${xmlEscape(p.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
