// ─── MDX Blog Engine ───────────────────────────────────────────────────────────
//
// Reads .mdx files from content/posts/ and returns structured data.
//
// Markdown is processed through the unified/remark/rehype pipeline (industry
// standard, used by Astro/Docusaurus/Next docs). This gives us GFM tables,
// smart typography, auto-id'd headings with anchor links, external-link
// hardening, and a foundation for footnotes, definitions, and figure
// captions — all of which carry semantic weight for AI engines parsing
// the page.
//
// To create a new post:
//   1. Create content/posts/<slug>.mdx
//   2. Add frontmatter (see PostMeta below)
//   3. Write Markdown / HTML / MDX below the ---
//   4. git push → live in 30 seconds

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeStringify from "rehype-stringify";
import type { AuthorSlug } from "./authors";
import type { SectionSlug, TopicSlug } from "./blog-taxonomy";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PostLocale = "en" | "it";
export type ReviewCycle = "monthly" | "quarterly" | "evergreen";

export type PostMeta = {
  slug: string;
  /** Source language. Drives blog index filtering, hreflang, and the
   *  wrong-locale redirect. Falls back to `it` for the legacy `servizi-`
   *  prefix or `en` otherwise. */
  locale: PostLocale;
  /** One section per post — drives schema dispatch and the
   *  /blog/section/<slug> index. */
  section: SectionSlug;
  /** 1..3 topics — drives clusters, related posts, about[] schema, and
   *  the /blog/topic/<slug> page. */
  topics: TopicSlug[];
  /** Author slug — resolves to lib/authors.ts. Required: every post must
   *  have a named human author for E-E-A-T. */
  author: AuthorSlug;
  /** How often this post should be re-reviewed. Drives the staleness flag
   *  on the internal /proof/blog-health dashboard. */
  reviewCycle: ReviewCycle;
  title: string;
  date: string;
  modified?: string;
  description: string;
  cover?: string;
  persona?: "Research" | "Purchase" | "Comparison" | "Awareness";
  entity?: string;
  /** Optional per-post JSON-LD override. Most posts should NOT set this —
   *  the schema dispatcher generates the right shape automatically. */
  jsonLd?: string;
  /** Links this post to its sibling translation in the other locale. When
   *  two posts share the same translationKey, the system emits reciprocal
   *  hreflang, links them in the article header, and groups them in the
   *  sitemap. Optional — single-locale posts (the common case) leave this
   *  unset. */
  translationKey?: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

export type Heading = { id: string; text: string; level: 2 | 3 };

// ─── Markdown → HTML (unified pipeline) ────────────────────────────────────────

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm) // tables, strikethrough, task lists, autolinks
  .use(remarkSmartypants) // “smart quotes”, em-dashes, ellipses
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug) // adds id="..." to every heading
  .use(rehypeAutolinkHeadings, {
    behavior: "wrap",
    properties: { className: ["heading-anchor"] },
  })
  .use(rehypeExternalLinks, {
    target: "_blank",
    rel: ["noopener", "noreferrer"],
    // Only treat absolute http(s) URLs as external; root-relative stays
    // in-app so internal links don't open in new tabs.
    test: (node) => {
      const href = (node.properties?.href ?? "") as string;
      return /^https?:\/\//.test(href) && !href.includes("refinea.io");
    },
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

function markdownToHtml(md: string): string {
  return String(processor.processSync(md));
}

// ─── Heading extraction ────────────────────────────────────────────────────────

export function extractHeadings(html: string): Heading[] {
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h2>/gi;
  const headings: Heading[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    // Strip anchor wrapper + any inline tags rehype-autolink-headings adds.
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    headings.push({ id, text, level: 2 });
  }
  return headings;
}

// ─── File readers ──────────────────────────────────────────────────────────────

function isValidSection(s: unknown): s is SectionSlug {
  return s === "product" || s === "news" || s === "guides" || s === "glossary";
}

function isValidAuthor(s: unknown): s is AuthorSlug {
  return s === "vito" || s === "giorgio";
}

function isValidReviewCycle(s: unknown): s is ReviewCycle {
  return s === "monthly" || s === "quarterly" || s === "evergreen";
}

function isValidTopic(s: unknown): s is TopicSlug {
  return (
    s === "generative-engine-optimization" ||
    s === "ai-search-strategy" ||
    s === "llm-citations" ||
    s === "ai-brand-visibility" ||
    s === "marketing-measurement"
  );
}

function readPost(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const contentHtml = markdownToHtml(content);

  const locale: PostLocale =
    data.locale === "en" || data.locale === "it"
      ? data.locale
      : slug.startsWith("servizi-")
      ? "it"
      : "en";

  // Defensive defaults — frontmatter may be missing fields during the
  // migration. Sensible defaults so a half-migrated post still renders.
  const section: SectionSlug = isValidSection(data.section)
    ? data.section
    : "news";
  const author: AuthorSlug = isValidAuthor(data.author) ? data.author : "vito";
  const reviewCycle: ReviewCycle = isValidReviewCycle(data.reviewCycle)
    ? data.reviewCycle
    : "quarterly";
  const topics: TopicSlug[] = Array.isArray(data.topics)
    ? (data.topics.filter(isValidTopic) as TopicSlug[])
    : [];

  return {
    slug,
    locale,
    section,
    topics,
    author,
    reviewCycle,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    modified: data.modified,
    description: data.description ?? "",
    cover: data.cover,
    persona: data.persona,
    entity: data.entity,
    jsonLd: data.jsonLd ? JSON.stringify(data.jsonLd) : undefined,
    translationKey:
      typeof data.translationKey === "string" && data.translationKey.trim()
        ? data.translationKey.trim()
        : undefined,
    contentHtml,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files
    .map((f) => readPost(f.replace(/\.mdx$/, "")))
    .filter((p): p is Post => p !== null);

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getAllPostMetas(): PostMeta[] {
  return getAllPosts().map(({ contentHtml: _contentHtml, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post | null {
  return readPost(slug);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getSlugsByLocale(locale: PostLocale): string[] {
  return getAllPostMetas()
    .filter((p) => p.locale === locale)
    .map((p) => p.slug);
}

/** Posts filtered by section, current-locale only. */
export function getPostsBySection(
  section: SectionSlug,
  locale: PostLocale,
): PostMeta[] {
  return getAllPostMetas().filter(
    (p) => p.section === section && p.locale === locale,
  );
}

/** Posts filtered by topic, current-locale only. */
export function getPostsByTopic(
  topic: TopicSlug,
  locale: PostLocale,
): PostMeta[] {
  return getAllPostMetas().filter(
    (p) => p.topics.includes(topic) && p.locale === locale,
  );
}

/** Posts by a given author, current-locale only. */
export function getPostsByAuthor(
  author: AuthorSlug,
  locale: PostLocale,
): PostMeta[] {
  return getAllPostMetas().filter(
    (p) => p.author === author && p.locale === locale,
  );
}

/**
 * Sibling translation lookup. Given a post, returns its counterpart in
 * the OTHER locale (if any). Single-locale posts return null.
 *
 * Two posts are siblings iff they share the same translationKey AND
 * differ in locale. We deliberately ignore matches in the same locale —
 * those would be a content duplication mistake.
 */
export function getTranslationSibling(post: PostMeta): PostMeta | null {
  if (!post.translationKey) return null;
  return (
    getAllPostMetas().find(
      (p) =>
        p.slug !== post.slug &&
        p.locale !== post.locale &&
        p.translationKey === post.translationKey,
    ) ?? null
  );
}

/** Related posts: same topics, same locale, excluding self. Ranked by
 *  topic overlap count (more shared topics = more related). */
export function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  if (post.topics.length === 0) return [];
  return getAllPostMetas()
    .filter((p) => p.slug !== post.slug && p.locale === post.locale)
    .map((p) => ({
      post: p,
      overlap: p.topics.filter((t) => post.topics.includes(t)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ post: p }) => p);
}

// ─── Date formatting ──────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
