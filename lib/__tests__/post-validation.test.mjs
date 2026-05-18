// Quick smoke test for post-validation and post-serializer.
// Run with: node lib/__tests__/post-validation.test.mjs

import assert from "node:assert/strict";
import { validatePost, hasErrors, slugifyTitle } from "../post-validation.ts";
import { serializePost, deserializePost } from "../post-serializer.ts";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  ${err.message}`);
    failed++;
  }
}

// ─── slugifyTitle ─────────────────────────────────────────────────────────────

test("slugifyTitle: basic title", () => {
  assert.equal(
    slugifyTitle("How ChatGPT Cites Sources"),
    "how-chatgpt-cites-sources",
  );
});

test("slugifyTitle: strips stopwords (EN)", () => {
  assert.equal(
    slugifyTitle("The Complete Guide to AI Visibility"),
    "complete-guide-ai-visibility",
  );
});

test("slugifyTitle: strips stopwords (IT)", () => {
  assert.equal(
    slugifyTitle("Il Futuro della Visibilità AI"),
    "futuro-visibilita-ai",
  );
});

test("slugifyTitle: handles accents", () => {
  assert.equal(
    slugifyTitle("Visibilità è strategia"),
    "visibilita-strategia",
  );
});

test("slugifyTitle: caps at 60 chars", () => {
  const long = "a".repeat(100);
  assert.ok(slugifyTitle(long).length <= 60);
});

// ─── validatePost: errors block ───────────────────────────────────────────────

const validPost = {
  title: "How ChatGPT decides which brands to recommend in answers",
  description:
    "ChatGPT cites brands based on retrieval signals, source authority, and structural cues. Here is how the citation pipeline really works.",
  slug: "how-chatgpt-decides-brand-citations",
  body: `## First section header\n\n${"This is a paragraph with enough content to pass the word count threshold. ".repeat(60)}\n\n## Second header\n\n${"More content here to keep things realistic and over four hundred words. ".repeat(20)}`,
  section: "guides",
  topics: ["llm-citations", "generative-engine-optimization"],
  author: "vito",
  locale: "en",
  date: "2026-05-18",
  reviewCycle: "quarterly",
  cover: "/blog/cover.jpg",
};

test("validatePost: valid post passes with no errors", () => {
  const issues = validatePost(validPost);
  assert.equal(hasErrors(issues), false, `Unexpected errors: ${JSON.stringify(issues.filter(i => i.severity === "error"))}`);
});

test("validatePost: missing title → error", () => {
  const issues = validatePost({ ...validPost, title: "" });
  assert.ok(issues.some((i) => i.field === "title" && i.severity === "error"));
});

test("validatePost: title >65 chars → error", () => {
  const issues = validatePost({
    ...validPost,
    title: "A title that is way too long for SERP and gets truncated by Google so it must be flagged as error",
  });
  assert.ok(issues.some((i) => i.field === "title" && i.severity === "error"));
});

test("validatePost: description >160 chars → error", () => {
  const issues = validatePost({
    ...validPost,
    description:
      "This description is intentionally very long so that it exceeds the one hundred sixty character limit imposed by Google SERP snippets and should therefore trigger a hard error in the validation pipeline of the CMS.",
  });
  assert.ok(
    issues.some((i) => i.field === "description" && i.severity === "error"),
  );
});

test("validatePost: malformed slug → error", () => {
  const issues = validatePost({ ...validPost, slug: "How_ChatGPT_Cites" });
  assert.ok(issues.some((i) => i.field === "slug" && i.severity === "error"));
});

test("validatePost: slug with stopwords → warning", () => {
  const issues = validatePost({
    ...validPost,
    slug: "the-complete-guide-to-the-future-of-ai",
  });
  assert.ok(
    issues.some((i) => i.field === "slug" && i.severity === "warning"),
  );
});

test("validatePost: empty topics → error", () => {
  const issues = validatePost({ ...validPost, topics: [] });
  assert.ok(issues.some((i) => i.field === "topics" && i.severity === "error"));
});

test("validatePost: 4 topics → error", () => {
  const issues = validatePost({
    ...validPost,
    topics: [
      "llm-citations",
      "generative-engine-optimization",
      "ai-search-strategy",
      "ai-brand-visibility",
    ],
  });
  assert.ok(issues.some((i) => i.field === "topics" && i.severity === "error"));
});

test("validatePost: missing author → error", () => {
  const issues = validatePost({ ...validPost, author: "" });
  assert.ok(issues.some((i) => i.field === "author" && i.severity === "error"));
});

test("validatePost: H1 in body → error", () => {
  const issues = validatePost({
    ...validPost,
    body: `# This is an H1\n\n${validPost.body}`,
  });
  assert.ok(issues.some((i) => i.field === "body" && i.severity === "error"));
});

test("validatePost: body without H2 → warning (when long enough)", () => {
  // ≥400 words so the H2 check kicks in (gated to avoid noise on stubs).
  const noH2 = "Just a paragraph with words enough. ".repeat(80);
  const issues = validatePost({ ...validPost, body: noH2 });
  assert.ok(
    issues.some(
      (i) => i.field === "body" && i.severity === "warning" && i.message.includes("H2"),
    ),
  );
});

test("validatePost: thin content <400 words → warning", () => {
  const thin = "Short. ".repeat(20);
  const issues = validatePost({ ...validPost, body: `## Heading\n\n${thin}` });
  assert.ok(
    issues.some(
      (i) =>
        i.field === "body" &&
        i.severity === "warning" &&
        i.message.toLowerCase().includes("thin"),
    ),
  );
});

test("validatePost: glossary entries get relaxed word threshold", () => {
  // 300+ words is fine for glossary, but should warn at <250
  const body = "Word ".repeat(280);
  const issues = validatePost({
    ...validPost,
    section: "glossary",
    body,
    cover: undefined,
  });
  // Should NOT have the thin-content warning we'd see for non-glossary
  assert.ok(
    !issues.some(
      (i) => i.field === "body" && i.message.includes("thin-content"),
    ),
  );
});

test("validatePost: missing cover (non-glossary) → warning", () => {
  const issues = validatePost({ ...validPost, cover: undefined });
  assert.ok(
    issues.some((i) => i.field === "cover" && i.severity === "warning"),
  );
});

test("validatePost: missing cover (glossary) → no warning", () => {
  const issues = validatePost({
    ...validPost,
    section: "glossary",
    cover: undefined,
    body: "Word ".repeat(400),
  });
  assert.ok(!issues.some((i) => i.field === "cover"));
});

test("validatePost: modified date earlier than publish date → error", () => {
  const issues = validatePost({
    ...validPost,
    date: "2026-05-18",
    modified: "2026-05-17",
  });
  assert.ok(issues.some((i) => i.field === "date" && i.severity === "error"));
});

// ─── serializePost ↔ deserializePost ─────────────────────────────────────────

test("serialize: produces valid YAML with deterministic key order", () => {
  const mdx = serializePost(validPost);
  // Title should appear before description; description before date.
  const titleIdx = mdx.indexOf("title:");
  const descIdx = mdx.indexOf("description:");
  const dateIdx = mdx.indexOf("date:");
  assert.ok(titleIdx < descIdx && descIdx < dateIdx);
  assert.ok(mdx.startsWith("---\n"));
});

test("serialize: omits optional empty fields", () => {
  const post = { ...validPost, cover: undefined, translationKey: undefined };
  const mdx = serializePost(post);
  assert.ok(!mdx.includes("cover:"));
  assert.ok(!mdx.includes("translationKey:"));
});

test("serialize → deserialize roundtrip preserves data", () => {
  const mdx = serializePost(validPost);
  const restored = deserializePost(mdx);
  assert.equal(restored.title, validPost.title);
  assert.equal(restored.description, validPost.description);
  assert.equal(restored.section, validPost.section);
  assert.deepEqual(restored.topics, validPost.topics);
  assert.equal(restored.author, validPost.author);
  assert.equal(restored.reviewCycle, validPost.reviewCycle);
  assert.equal(restored.locale, validPost.locale);
  assert.equal(restored.date, validPost.date);
  assert.equal(restored.cover, validPost.cover);
  assert.equal(restored.body.trim(), validPost.body.trim());
});

test("serialize: includes translationKey when set", () => {
  const post = { ...validPost, translationKey: "chatgpt-citations" };
  const mdx = serializePost(post);
  assert.ok(mdx.includes('translationKey: "chatgpt-citations"'));
});

test("serialize: escapes quotes in strings", () => {
  const post = { ...validPost, title: 'Title with "quotes" inside' };
  const mdx = serializePost(post);
  const restored = deserializePost(mdx);
  assert.equal(restored.title, 'Title with "quotes" inside');
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
