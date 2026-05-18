/**
 * Blog schema dispatcher — emits the correct Schema.org markup for each
 * post based on its `section`. Built to be 2026-compliant:
 *
 *   - HowTo deprecated (2023) — never used.
 *   - FAQPage rich result killed (May 7, 2026) — schema still valid; we
 *     add it only when the post actually contains a "Common Questions"
 *     section, never speculatively.
 *   - Misleading markup is an enforcement category (March 2026). We pick
 *     the schema type that genuinely matches content (BlogPosting for
 *     opinion, NewsArticle only for hard news, TechArticle for product/
 *     guides, DefinedTerm for glossary entries).
 *   - Person schema with sameAs LinkedIn is the highest-leverage entity
 *     signal — built from lib/authors.ts on every BlogPosting.
 *
 * `topics` from the post frontmatter feed Article.about[] as DefinedTerm
 * references, giving LLMs explicit entity anchors for the article's
 * subject.
 */

import type { Post, PostMeta } from "./mdx";
import { getTranslationSibling } from "./mdx";
import { getAuthor, authorJsonLd, type Author } from "./authors";
import { getSection, getTopic, type Section, type Topic } from "./blog-taxonomy";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://refinea.io";

function articleUrl(post: Post): string {
  return post.locale === "it"
    ? `${SITE_URL}/it/blog/${post.slug}`
    : `${SITE_URL}/blog/${post.slug}`;
}

function publisherNode() {
  return {
    "@type": "Organization",
    "@id": "https://refinea.io/#organization",
    name: "Refinea",
    url: "https://refinea.io",
    logo: {
      "@type": "ImageObject",
      url: "https://refinea.io/logos/refinea%20viola.svg",
      width: 512,
      height: 512,
    },
  };
}

function aboutNodes(post: Post) {
  return post.topics
    .map((topicSlug) => {
      const topic = getTopic(topicSlug);
      if (!topic) return null;
      return {
        "@type": "DefinedTerm",
        name: topic.name,
        description: topic.about,
        url: `${SITE_URL}/blog/topic/${topic.slug}`,
      };
    })
    .filter(Boolean);
}

/**
 * Strip Markdown to plain text for word counting. Keeps the count close to
 * what a reader (or LLM tokenizer) would see — strips code blocks, HTML
 * tags, link syntax, frontmatter-style chars.
 */
function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~|\-]+/g, " ");
}

function countWordsFromMarkdown(md: string): number {
  return plainText(md).trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Extract authoritative citations from the article body. We pick:
 *   - Internal /blog/* links (Refinea cluster: signal "this article is
 *     part of our knowledge graph")
 *   - External links to .gov / .edu / known reference domains
 *     (signal "this article is grounded in authoritative sources")
 *
 * Skips boilerplate links: refinea.io homepage, platform.refinea.io,
 * social profiles. Dedupes by URL.
 */
const AUTHORITY_DOMAINS = /\.(gov|edu|ac\.uk|europa\.eu)$|^(?:www\.)?(?:wikipedia\.org|britannica\.com|statista\.com|nature\.com|sciencedirect\.com|arxiv\.org|developers\.google\.com|schema\.org|w3\.org|nytimes\.com|wsj\.com|economist\.com|ft\.com|searchengineland\.com|searchenginejournal\.com|ahrefs\.com|moz\.com|backlinko\.com|hbr\.org|mit\.edu|sloan\.mit\.edu)/i;

function extractCitations(body: string): { "@type": "CreativeWork"; url: string }[] {
  const linkRegex = /\[[^\]]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const seen = new Set<string>();
  const out: { "@type": "CreativeWork"; url: string }[] = [];

  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(body)) !== null) {
    let href = match[1].trim();
    if (!href) continue;

    // Resolve relative to absolute (for citation@id consistency)
    if (href.startsWith("/")) href = `${SITE_URL}${href}`;
    if (!/^https?:\/\//i.test(href)) continue;

    let hostname: string;
    try {
      hostname = new URL(href).hostname.toLowerCase();
    } catch {
      continue;
    }

    // Skip site chrome links (homepage, platform, social).
    if (
      hostname === "refinea.io" ||
      hostname === "www.refinea.io"
    ) {
      const path = new URL(href).pathname;
      // Only keep /blog/* and /blog/glossary/*; drop /, /pricing, /team etc.
      if (!path.startsWith("/blog")) continue;
    } else if (
      hostname === "platform.refinea.io" ||
      hostname.includes("linkedin.com") ||
      hostname.includes("youtube.com") ||
      hostname.includes("calendly.com")
    ) {
      continue;
    } else if (!AUTHORITY_DOMAINS.test(hostname)) {
      // External domain not in our authority allowlist — skip.
      continue;
    }

    if (seen.has(href)) continue;
    seen.add(href);
    out.push({ "@type": "CreativeWork", url: href });
  }

  return out;
}

/**
 * Article-family schema (BlogPosting, NewsArticle, TechArticle). Author is
 * always a Person built from lib/authors.ts (never falls back to
 * Organization — every post must have a named human for E-E-A-T).
 */
export function buildArticleJsonLd(post: Post) {
  const section = getSection(post.section);
  const author = getAuthor(post.author);
  if (!author) {
    throw new Error(
      `Post "${post.slug}" has unknown author "${post.author}". Add to lib/authors.ts.`,
    );
  }

  const schemaType = section?.schemaType ?? "BlogPosting";
  // DefinedTerm is handled by buildDefinedTermJsonLd — don't reach here.
  const articleType =
    schemaType === "DefinedTerm" ? "BlogPosting" : schemaType;

  const url = articleUrl(post);
  const about = aboutNodes(post);
  const wordCount = countWordsFromMarkdown(post.contentHtml);
  const citations = extractCitations(post.contentHtml);
  const sibling = getTranslationSibling(post);
  // The work–translation relationship is directional: schema.org expects
  // `translationOfWork` on the translation pointing to the original. We
  // can't reliably tell which post is "the original" — so we pick the
  // older date as the source of truth. If both have the same date or are
  // ambiguous, we use `workTranslation` (the inverse) on both, which is
  // still valid and unambiguous to LLMs.
  const translationRel = sibling
    ? (() => {
        const sourceUrl =
          sibling.locale === "it"
            ? `${SITE_URL}/it/blog/${sibling.slug}`
            : `${SITE_URL}/blog/${sibling.slug}`;
        const node = {
          "@type": "CreativeWork" as const,
          "@id": `${sourceUrl}#article`,
          url: sourceUrl,
          inLanguage: sibling.locale === "it" ? "it-IT" : "en-US",
          headline: sibling.title,
        };
        const postIsOlder = post.date <= sibling.date;
        return postIsOlder
          ? { workTranslation: node }
          : { translationOfWork: node };
      })()
    : null;

  return {
    "@context": "https://schema.org",
    "@type": articleType,
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.modified ?? post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: authorJsonLd(author),
    publisher: publisherNode(),
    ...(post.cover
      ? {
          image: {
            "@type": "ImageObject",
            url: post.cover.startsWith("http")
              ? post.cover
              : `${SITE_URL}${post.cover}`,
          },
        }
      : {}),
    ...(about.length > 0 ? { about } : {}),
    ...(section ? { articleSection: section.name } : {}),
    ...(wordCount > 0 ? { wordCount } : {}),
    ...(citations.length > 0 ? { citation: citations } : {}),
    ...(translationRel ?? {}),
    // Speakable spec — flags BLUF paragraph + H2 headings as the parts a
    // voice assistant (Google Assistant, ChatGPT voice) should read aloud.
    // CSS selectors target what rehype-slug + rehype-autolink-headings
    // emit on the rendered page.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".prose > p:first-of-type", ".prose h2"],
    },
    isPartOf: { "@id": "https://refinea.io/#website" },
    inLanguage: post.locale === "it" ? "it-IT" : "en-US",
  };
}

/**
 * DefinedTerm schema for glossary entries. Each entry is part of the
 * "Refinea GEO Glossary" DefinedTermSet, giving LLMs an authoritative
 * canonical definition that can be cited atomically.
 */
export function buildDefinedTermJsonLd(post: Post) {
  const url = articleUrl(post);
  const author = getAuthor(post.author);
  const wordCount = countWordsFromMarkdown(post.contentHtml);
  const sibling = getTranslationSibling(post);
  const sameAs = sibling
    ? [
        sibling.locale === "it"
          ? `${SITE_URL}/it/blog/${sibling.slug}`
          : `${SITE_URL}/blog/${sibling.slug}`,
      ]
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${url}#term`,
    name: post.title,
    description: post.description,
    url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/blog/glossary#set`,
      name: "Refinea GEO Glossary",
      url: `${SITE_URL}/blog/glossary`,
    },
    ...(author ? { creator: authorJsonLd(author) } : {}),
    ...(wordCount > 0 ? { wordCount } : {}),
    ...(sameAs ? { sameAs } : {}),
    inLanguage: post.locale === "it" ? "it-IT" : "en-US",
  };
}

/**
 * Top-level dispatcher — call this from the post page.
 */
export function buildPostJsonLd(post: Post) {
  const section = getSection(post.section);
  if (section?.schemaType === "DefinedTerm") {
    return buildDefinedTermJsonLd(post);
  }
  return buildArticleJsonLd(post);
}

// ─── Collection / index page schemas ───────────────────────────────────────────

function itemListFromPosts(posts: PostMeta[], locale: "en" | "it") {
  return posts.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url:
      locale === "it"
        ? `${SITE_URL}/it/blog/${p.slug}`
        : `${SITE_URL}/blog/${p.slug}`,
    name: p.title,
  }));
}

/**
 * CollectionPage schema for /blog/section/<slug> and /blog/topic/<slug>.
 * Emits an ItemList of posts in the collection — gives LLMs an explicit
 * inventory of the cluster and lets Google understand depth-of-coverage.
 */
export function buildCollectionPageJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  locale: "en" | "it";
  posts: PostMeta[];
  about?: { name: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${opts.url}#collection`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.locale === "it" ? "it-IT" : "en-US",
    isPartOf: { "@id": "https://refinea.io/#website" },
    publisher: publisherNode(),
    ...(opts.about && opts.about.length > 0
      ? {
          about: opts.about.map((a) => ({
            "@type": "DefinedTerm",
            name: a.name,
            description: a.description,
          })),
        }
      : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.posts.length,
      itemListElement: itemListFromPosts(opts.posts, opts.locale),
    },
  };
}

/**
 * Section CollectionPage — wraps buildCollectionPageJsonLd with the section
 * metadata. about[] uses the section description.
 */
export function buildSectionPageJsonLd(
  section: Section,
  posts: PostMeta[],
  locale: "en" | "it",
) {
  const url =
    locale === "it"
      ? `${SITE_URL}/it/blog/section/${section.slug}`
      : `${SITE_URL}/blog/section/${section.slug}`;
  return buildCollectionPageJsonLd({
    url,
    name: `${section.name} — Refinea Blog`,
    description: section.description,
    locale,
    posts,
  });
}

/**
 * Topic CollectionPage — about[] emits the topic as a DefinedTerm, which
 * is the cleanest entity anchor LLMs can read for "this hub page is the
 * canonical Refinea resource for entity X".
 */
export function buildTopicPageJsonLd(
  topic: Topic,
  posts: PostMeta[],
  locale: "en" | "it",
) {
  const url =
    locale === "it"
      ? `${SITE_URL}/it/blog/topic/${topic.slug}`
      : `${SITE_URL}/blog/topic/${topic.slug}`;
  return buildCollectionPageJsonLd({
    url,
    name: `${topic.name} — Refinea Blog`,
    description: topic.description,
    locale,
    posts,
    about: [{ name: topic.name, description: topic.about }],
  });
}

/**
 * ProfilePage + Person for /blog/author/<slug>. ProfilePage with embedded
 * Person is the canonical pattern Google documents for author pages —
 * combined with sameAs:LinkedIn it's the strongest E-E-A-T signal we can
 * emit programmatically.
 */
export function buildAuthorPageJsonLd(
  author: Author,
  posts: PostMeta[],
  locale: "en" | "it",
) {
  const url =
    locale === "it"
      ? `${SITE_URL}/it/blog/author/${author.slug}`
      : `${SITE_URL}/blog/author/${author.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profile`,
    url,
    inLanguage: locale === "it" ? "it-IT" : "en-US",
    isPartOf: { "@id": "https://refinea.io/#website" },
    mainEntity: authorJsonLd(author),
    hasPart: itemListFromPosts(posts, locale),
  };
}

/**
 * DefinedTermSet for /blog/glossary index page. Each term becomes a
 * hasDefinedTerm entry; Perplexity and other AI engines pick this up as
 * a citable atomic dataset.
 */
export function buildGlossaryIndexJsonLd(
  posts: PostMeta[],
  locale: "en" | "it",
) {
  const url =
    locale === "it"
      ? `${SITE_URL}/it/blog/glossary`
      : `${SITE_URL}/blog/glossary`;
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${url}#set`,
    name: "Refinea GEO Glossary",
    description:
      locale === "it"
        ? "Definizioni canoniche dei termini che modellano la AI search, la GEO e la AEO."
        : "Canonical definitions of the terms shaping AI search, GEO, and AEO.",
    url,
    inLanguage: locale === "it" ? "it-IT" : "en-US",
    publisher: publisherNode(),
    hasDefinedTerm: posts.map((p) => ({
      "@type": "DefinedTerm",
      name: p.title,
      description: p.description,
      url:
        locale === "it"
          ? `${SITE_URL}/it/blog/${p.slug}`
          : `${SITE_URL}/blog/${p.slug}`,
    })),
  };
}
