/**
 * Atom 1.0 feed at /blog/feed.xml.
 *
 * Atom is preferred over RSS 2.0: required IDs, proper i18n, strict
 * date formats, and well-defined update semantics. Mixed-locale feed
 * (EN + IT) — each entry declares its own xml:lang so clients render
 * correctly.
 */

import { getAllPostMetas } from "@/lib/mdx";
import { getAuthor } from "@/lib/authors";

const SITE_URL = "https://refinea.io";

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
  const posts = getAllPostMetas();
  const updated =
    posts.length > 0
      ? new Date(posts[0].modified ?? posts[0].date).toISOString()
      : new Date().toISOString();

  const entries = posts
    .map((p) => {
      const url = postUrl(p.slug, p.locale);
      const author = getAuthor(p.author);
      const published = new Date(p.date).toISOString();
      const updatedAt = new Date(p.modified ?? p.date).toISOString();
      return `  <entry>
    <id>${url}</id>
    <title>${xmlEscape(p.title)}</title>
    <link href="${url}" rel="alternate" type="text/html" />
    <published>${published}</published>
    <updated>${updatedAt}</updated>
    <summary type="text">${xmlEscape(p.description)}</summary>
    <author>
      <name>${xmlEscape(author?.name ?? "Refinea")}</name>${
        author?.email ? `\n      <email>${xmlEscape(author.email)}</email>` : ""
      }${
        author?.linkedin ? `\n      <uri>${xmlEscape(author.linkedin)}</uri>` : ""
      }
    </author>
    <category term="${xmlEscape(p.section)}" />${p.topics
      .map((t) => `\n    <category term="${xmlEscape(t)}" scheme="topic" />`)
      .join("")}
    <content type="text" xml:lang="${p.locale}">${xmlEscape(p.description)}</content>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${SITE_URL}/blog/feed.xml</id>
  <title>Refinea Blog — AI Visibility &amp; GEO Insights</title>
  <subtitle>Research, guides, product updates and analysis on Generative Engine Optimization.</subtitle>
  <link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/atom+xml" />
  <link href="${SITE_URL}/blog" rel="alternate" type="text/html" />
  <updated>${updated}</updated>
  <author>
    <name>Refinea</name>
    <uri>${SITE_URL}</uri>
  </author>
  <generator uri="${SITE_URL}">Refinea</generator>
  <rights>© ${new Date().getFullYear()} Refinea S.r.l.</rights>
${entries}
</feed>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
