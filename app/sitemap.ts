import type { MetadataRoute } from "next";
import { getAllPostMetas } from "@/lib/mdx";
import { getAllSections, getAllTopics } from "@/lib/blog-taxonomy";
import { getAllAuthors } from "@/lib/authors";

/**
 * Multilingual sitemap.
 *
 * Static pages (/, /pricing, /team, /blog) exist in both EN and IT, so each
 * gets two entries — the EN copy at /<path> and the IT copy at /it/<path> —
 * and each entry advertises both as `alternates.languages` (hreflang). This
 * is the shape Next.js converts into `<xhtml:link rel="alternate" />` tags
 * inside the generated XML.
 *
 * Blog posts are single-locale (no parallel translations). IT posts are
 * detected by the `servizi-` slug prefix and emitted only under /it/blog;
 * all other posts go under /blog. Neither side gets `alternates` because no
 * translated counterpart exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://refinea.io";

  type StaticPage = {
    path: string;
    changeFrequency: "weekly" | "daily" | "monthly" | "yearly";
    priority: number;
  };

  const staticPaths: StaticPage[] = [
    { path: "",         changeFrequency: "weekly",  priority: 1.0 },
    { path: "/pricing", changeFrequency: "weekly",  priority: 0.9 },
    { path: "/blog",    changeFrequency: "daily",   priority: 0.8 },
    { path: "/team",              changeFrequency: "monthly", priority: 0.5 },
    { path: "/refinea-analysis",  changeFrequency: "daily",   priority: 0.7 },
    { path: "/docs",              changeFrequency: "weekly",  priority: 0.6 },
    { path: "/privacy",           changeFrequency: "yearly",  priority: 0.3 },
    { path: "/terms",             changeFrequency: "yearly",  priority: 0.3 },
    { path: "/cookie-policy",     changeFrequency: "yearly",  priority: 0.3 },
  ];

  const lastModified = new Date();

  // Two entries per static page (EN at `/<path>`, IT at `/it/<path>`), each
  // pointing to both as language alternates so search engines render the
  // hreflang group correctly.
  const staticPages: MetadataRoute.Sitemap = staticPaths.flatMap((p) => {
    const enUrl = `${baseUrl}${p.path}`;
    const itUrl = `${baseUrl}/it${p.path}`;
    const languages = { en: enUrl, it: itUrl, "x-default": enUrl };

    return [
      {
        url: enUrl,
        lastModified,
        changeFrequency: p.changeFrequency,
        priority: p.priority,
        alternates: { languages },
      },
      {
        url: itUrl,
        lastModified,
        changeFrequency: p.changeFrequency,
        priority: p.priority,
        alternates: { languages },
      },
    ];
  });

  // Blog posts. Each post is single-locale unless it has a translationKey
  // pointing to a sibling in the other locale — in that case both posts
  // emit reciprocal `alternates.languages` so search engines render a
  // proper hreflang group. `images` extension surfaces the cover to
  // Google Image search and signals "this URL has primary visual content"
  // (a soft ranking signal for article rich results).
  const posts = getAllPostMetas();
  const postUrl = (p: { locale: string; slug: string }) =>
    p.locale === "it"
      ? `${baseUrl}/it/blog/${p.slug}`
      : `${baseUrl}/blog/${p.slug}`;

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => {
    const url = postUrl(post);
    const images = post.cover
      ? [post.cover.startsWith("http") ? post.cover : `${baseUrl}${post.cover}`]
      : undefined;

    // If this post has a sibling translation, emit hreflang group.
    const sibling = post.translationKey
      ? posts.find(
          (p) =>
            p.slug !== post.slug &&
            p.locale !== post.locale &&
            p.translationKey === post.translationKey,
        )
      : null;

    const alternates = sibling
      ? {
          languages: {
            en: post.locale === "en" ? url : postUrl(sibling),
            it: post.locale === "it" ? url : postUrl(sibling),
            "x-default": post.locale === "en" ? url : postUrl(sibling),
          },
        }
      : undefined;

    return {
      url,
      lastModified: new Date(post.modified || post.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(images ? { images } : {}),
      ...(alternates ? { alternates } : {}),
    };
  });

  // Blog hub pages (sections, topics, authors, glossary index). Each
  // exists in both locales with hreflang.
  const hubPaths: string[] = [
    "/blog/glossary",
    ...getAllSections().map((s) => `/blog/section/${s.slug}`),
    ...getAllTopics().map((t) => `/blog/topic/${t.slug}`),
    ...getAllAuthors().map((a) => `/blog/author/${a.slug}`),
  ];

  const hubPages: MetadataRoute.Sitemap = hubPaths.flatMap((path) => {
    const enUrl = `${baseUrl}${path}`;
    const itUrl = `${baseUrl}/it${path}`;
    const languages = { en: enUrl, it: itUrl, "x-default": enUrl };
    return [
      {
        url: enUrl,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
        alternates: { languages },
      },
      {
        url: itUrl,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
        alternates: { languages },
      },
    ];
  });

  return [...staticPages, ...hubPages, ...blogPages];
}
