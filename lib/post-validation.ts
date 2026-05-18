/**
 * Post validation — SEO/GEO lint rules that the CMS runs on every save.
 *
 * Each rule is rooted in a documented 2026 best practice:
 *   - Title 30-65 chars   → Google SERP truncates ~60-65, AI engines weigh
 *                            shorter headlines more for citation hooks.
 *   - Description 120-160 → meta description sweet spot; Atom feed summary;
 *                            below 120 underperforms, above 160 truncates.
 *   - Slug ≤ 60 chars     → URL length is a known soft ranking signal and
 *                            citation friction (long URLs get truncated in
 *                            ChatGPT/Perplexity citations).
 *   - Body ≥ 400 words    → below threshold = thin content (Google HCU
 *                            December 2025 explicitly demotes).
 *   - At least one H2     → AI engines parse <h2> as answerable units;
 *                            articles without H2 underperform in citation.
 *   - Topics 1-3          → 0 = no entity anchor; 4+ = unfocused
 *                            (misleading markup risk on about[] schema).
 *   - Cover for non-glossary → article rich result requires image.
 *
 * Errors block publish. Warnings show in UI but don't block.
 */

import type { SectionSlug, TopicSlug } from "./blog-taxonomy";
import type { AuthorSlug } from "./authors";

export type ReviewCycle = "monthly" | "quarterly" | "evergreen";
export type Severity = "error" | "warning";

export type ValidationIssue = {
  field:
    | "title"
    | "description"
    | "slug"
    | "body"
    | "topics"
    | "section"
    | "author"
    | "cover"
    | "date"
    | "locale"
    | "reviewCycle"
    | "general";
  severity: Severity;
  message: string;
};

export type PostInput = {
  title: string;
  description: string;
  slug: string;
  body: string;
  section: SectionSlug | "";
  topics: TopicSlug[];
  author: AuthorSlug | "";
  locale: "en" | "it";
  date: string;
  modified?: string;
  reviewCycle: ReviewCycle | "";
  cover?: string;
  translationKey?: string;
};

const TITLE_MIN = 30;
const TITLE_MAX = 65;
const DESC_MIN = 120;
const DESC_MAX = 160;
const SLUG_MAX = 60;
const BODY_MIN_WORDS = 400;

export function validatePost(post: PostInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // ─── Title ─────────────────────────────────────────────────────────────────
  if (!post.title.trim()) {
    issues.push({
      field: "title",
      severity: "error",
      message: "Title is required.",
    });
  } else {
    const len = post.title.length;
    if (len < TITLE_MIN) {
      issues.push({
        field: "title",
        severity: "warning",
        message: `Title is ${len} chars; aim for ${TITLE_MIN}-${TITLE_MAX} for SERP and AI citation.`,
      });
    } else if (len > TITLE_MAX) {
      issues.push({
        field: "title",
        severity: "error",
        message: `Title is ${len} chars; Google truncates at ~${TITLE_MAX}. Shorten to publish.`,
      });
    }
  }

  // ─── Description ───────────────────────────────────────────────────────────
  if (!post.description.trim()) {
    issues.push({
      field: "description",
      severity: "error",
      message: "Description is required (used as meta description and Atom feed summary).",
    });
  } else {
    const len = post.description.length;
    if (len < DESC_MIN) {
      issues.push({
        field: "description",
        severity: "warning",
        message: `Description is ${len} chars; aim for ${DESC_MIN}-${DESC_MAX} for SERP snippet completeness.`,
      });
    } else if (len > DESC_MAX) {
      issues.push({
        field: "description",
        severity: "error",
        message: `Description is ${len} chars; Google truncates at ~${DESC_MAX}. Shorten to publish.`,
      });
    }
  }

  // ─── Slug ──────────────────────────────────────────────────────────────────
  if (!post.slug.trim()) {
    issues.push({ field: "slug", severity: "error", message: "Slug is required." });
  } else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
      issues.push({
        field: "slug",
        severity: "error",
        message: "Slug must be lowercase, alphanumeric, hyphen-separated (e.g. how-chatgpt-cites-sources).",
      });
    }
    if (post.slug.length > SLUG_MAX) {
      issues.push({
        field: "slug",
        severity: "warning",
        message: `Slug is ${post.slug.length} chars; shorter URLs (<${SLUG_MAX}) rank and get cited more often.`,
      });
    }
    // Stop-word heuristic — flag obvious filler words in slugs.
    const stopwords = ["the", "a", "an", "of", "for", "to", "in", "on", "is", "and", "or"];
    const parts = post.slug.split("-");
    const stopHits = parts.filter((p) => stopwords.includes(p));
    if (stopHits.length >= 2) {
      issues.push({
        field: "slug",
        severity: "warning",
        message: `Slug contains stop words (${stopHits.join(", ")}). Strip them for tighter keyword targeting.`,
      });
    }
  }

  // ─── Section ───────────────────────────────────────────────────────────────
  if (!post.section) {
    issues.push({ field: "section", severity: "error", message: "Section is required." });
  }

  // ─── Topics ────────────────────────────────────────────────────────────────
  if (post.topics.length === 0) {
    issues.push({
      field: "topics",
      severity: "error",
      message: "Pick 1-3 topics. Topics drive related posts, hub pages, and schema about[] anchors.",
    });
  } else if (post.topics.length > 3) {
    issues.push({
      field: "topics",
      severity: "error",
      message: `${post.topics.length} topics is too many. Max 3 — unfocused tagging hurts cluster signal.`,
    });
  }

  // ─── Author ────────────────────────────────────────────────────────────────
  if (!post.author) {
    issues.push({
      field: "author",
      severity: "error",
      message: "Author is required (drives Person schema + E-E-A-T signal).",
    });
  }

  // ─── Locale ────────────────────────────────────────────────────────────────
  if (post.locale !== "en" && post.locale !== "it") {
    issues.push({ field: "locale", severity: "error", message: "Locale must be 'en' or 'it'." });
  }

  // ─── Date ──────────────────────────────────────────────────────────────────
  if (!post.date) {
    issues.push({ field: "date", severity: "error", message: "Publish date is required." });
  } else if (!/^\d{4}-\d{2}-\d{2}/.test(post.date)) {
    issues.push({
      field: "date",
      severity: "error",
      message: "Date must be ISO format (YYYY-MM-DD).",
    });
  }

  // ─── Modified ──────────────────────────────────────────────────────────────
  if (post.modified) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(post.modified)) {
      issues.push({
        field: "date",
        severity: "error",
        message: "Modified date must be ISO format (YYYY-MM-DD).",
      });
    } else if (post.modified < post.date) {
      issues.push({
        field: "date",
        severity: "error",
        message: "Modified date cannot be earlier than publish date.",
      });
    }
  }

  // ─── Review cycle ──────────────────────────────────────────────────────────
  if (!post.reviewCycle) {
    issues.push({
      field: "reviewCycle",
      severity: "error",
      message: "Review cycle is required — drives staleness flagging.",
    });
  }

  // ─── Body ──────────────────────────────────────────────────────────────────
  const wordCount = countWords(post.body);
  if (wordCount === 0) {
    issues.push({ field: "body", severity: "error", message: "Body cannot be empty." });
  } else if (post.section === "glossary") {
    // Glossary entries are atomic definitions, 300-800 words is typical.
    if (wordCount < 250) {
      issues.push({
        field: "body",
        severity: "warning",
        message: `Glossary entry is ${wordCount} words; aim for 300-800 for citation depth.`,
      });
    }
  } else if (wordCount < BODY_MIN_WORDS) {
    issues.push({
      field: "body",
      severity: "warning",
      message: `Body is ${wordCount} words; <${BODY_MIN_WORDS} risks thin-content demotion under Google HCU.`,
    });
  }

  // ─── H2 presence ───────────────────────────────────────────────────────────
  const h2Count = (post.body.match(/^##\s+\S/gm) ?? []).length;
  if (post.section !== "glossary" && wordCount >= 400 && h2Count === 0) {
    issues.push({
      field: "body",
      severity: "warning",
      message: "No H2 headings found. AI engines parse <h2> as answerable units — add 2-4 H2s every 150-250 words.",
    });
  }

  // ─── H1 in body (forbidden — title comes from frontmatter) ────────────────
  if (/^#\s+\S/m.test(post.body)) {
    issues.push({
      field: "body",
      severity: "error",
      message: "Do not use H1 (# Heading) in the body — the title is already rendered as the page H1.",
    });
  }

  // ─── Cover (required for non-glossary, recommended for everything else) ───
  if (!post.cover && post.section !== "glossary") {
    issues.push({
      field: "cover",
      severity: "warning",
      message: "No cover image. Required for Article rich results and Open Graph previews.",
    });
  }

  return issues;
}

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((i) => i.severity === "error");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countWords(s: string): number {
  // Strip code fences, HTML tags, frontmatter-ish syntax, then word-tokenize.
  const stripped = s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~|\-]/g, " ")
    .replace(/\[(.+?)\]\([^)]+\)/g, "$1");
  const words = stripped.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/**
 * Generate a SEO-clean slug from a title. Same hygiene as image sanitizer
 * but tuned for URL slugs: strips accents, lowercases, hyphen-separates,
 * strips stopwords, caps at 60 chars.
 */
export function slugifyTitle(title: string): string {
  const stopwords = new Set([
    "the", "a", "an", "of", "for", "to", "in", "on", "is", "and", "or", "with",
    "il", "la", "lo", "le", "gli", "i", "un", "una", "di", "da", "del", "della", "che", "e",
  ]);
  const tokens = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w && !stopwords.has(w));
  const joined = tokens.join("-").slice(0, 60);
  return joined.replace(/-+$/, "");
}
