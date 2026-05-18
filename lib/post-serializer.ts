/**
 * Post serializer — round-trip between PostInput (CMS form state) and the
 * raw MDX file format (frontmatter + body).
 *
 * Keeps frontmatter shape deterministic: same key order, same quoting, same
 * indentation every time. Stable serialization = clean Git diffs, easier
 * code review.
 */

import matter from "gray-matter";
import type { PostInput, ReviewCycle } from "./post-validation";
import type { SectionSlug, TopicSlug } from "./blog-taxonomy";
import type { AuthorSlug } from "./authors";

/**
 * Frontmatter key order — written in this exact order on every save so
 * Git diffs only show real changes, never key shuffling.
 */
const KEY_ORDER = [
  "title",
  "description",
  "date",
  "modified",
  "section",
  "topics",
  "author",
  "reviewCycle",
  "locale",
  "translationKey",
  "cover",
  "persona",
  "entity",
] as const;

export function serializePost(input: PostInput): string {
  const fm: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    date: input.date,
    ...(input.modified ? { modified: input.modified } : {}),
    section: input.section,
    topics: input.topics,
    author: input.author,
    reviewCycle: input.reviewCycle,
    locale: input.locale,
    ...(input.translationKey ? { translationKey: input.translationKey } : {}),
    ...(input.cover ? { cover: input.cover } : {}),
  };

  // Emit YAML by hand to control key order and quoting style. gray-matter's
  // stringify can't enforce ordering and tends to over-quote.
  const lines: string[] = ["---"];
  for (const key of KEY_ORDER) {
    if (!(key in fm)) continue;
    const value = fm[key];
    if (value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - "${escapeYaml(String(item))}"`);
    } else {
      lines.push(`${key}: "${escapeYaml(String(value))}"`);
    }
  }
  lines.push("---", "");
  lines.push(input.body.trim(), "");
  return lines.join("\n");
}

export function deserializePost(raw: string): PostInput {
  const { data, content } = matter(raw);
  return {
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    slug: "", // slug comes from filename, set by caller
    body: content.trim(),
    section: (data.section as SectionSlug) ?? "",
    topics: Array.isArray(data.topics) ? (data.topics as TopicSlug[]) : [],
    author: (data.author as AuthorSlug) ?? "",
    locale: data.locale === "it" ? "it" : "en",
    date: String(data.date ?? ""),
    modified: data.modified ? String(data.modified) : undefined,
    reviewCycle: (data.reviewCycle as ReviewCycle) ?? "",
    cover: data.cover ? String(data.cover) : undefined,
    translationKey: data.translationKey ? String(data.translationKey) : undefined,
  };
}

function escapeYaml(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
