// ─── MDX Blog Engine ───────────────────────────────────────────────────────────
//
// Reads .mdx files from content/posts/ and returns structured data.
// Zero dependencies beyond gray-matter (frontmatter parsing).
//
// To create a new post:
//   1. Create content/posts/your-slug.mdx
//   2. Add frontmatter (title, date, description, cover, etc.)
//   3. Write Markdown below the ---
//   4. git push → live in 30 seconds

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  modified?: string;
  description: string;
  cover?: string;
  persona?: "Research" | "Purchase" | "Comparison" | "Awareness";
  entity?: string;
  jsonLd?: string;
};

export type Post = PostMeta & {
  contentHtml: string;
};

export type Heading = { id: string; text: string; level: 2 | 3 };

// ─── Markdown → HTML ───────────────────────────────────────────────────────────
// Minimal Markdown-to-HTML converter. Handles the subset we need without
// adding a heavy dependency like remark/rehype.

function markdownToHtml(md: string): string {
  let html = md;

  // Fenced code blocks (```...```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code class="language-${lang || "text"}">${escaped.trimEnd()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Tables
  html = html.replace(
    /^(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/gm,
    (_, headerRow: string, _separator: string, bodyRows: string) => {
      const headers = headerRow
        .split("|")
        .filter((c: string) => c.trim())
        .map((c: string) => `<th>${c.trim()}</th>`)
        .join("");
      const rows = bodyRows
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .filter((c: string) => c.trim())
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("\n");
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    },
  );

  // Headings (### before ## before #)
  html = html.replace(/^### (.+)$/gm, (_, t) => {
    const id = slugify(t);
    return `<h3 id="${id}">${inlineFormat(t)}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_, t) => {
    const id = slugify(t);
    return `<h2 id="${id}">${inlineFormat(t)}</h2>`;
  });
  html = html.replace(/^# (.+)$/gm, (_, t) => `<h1>${inlineFormat(t)}</h1>`);

  // Unordered lists
  html = html.replace(
    /^(- .+(?:\n- .+)*)/gm,
    (block) => {
      const items = block
        .split("\n")
        .map((line) => `<li>${inlineFormat(line.replace(/^- /, ""))}</li>`)
        .join("\n");
      return `<ul>${items}</ul>`;
    },
  );

  // Paragraphs: lines that aren't already HTML tags
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^</.test(trimmed)) return trimmed; // already HTML
      return `<p>${inlineFormat(trimmed.replace(/\n/g, " "))}</p>`;
    })
    .join("\n\n");

  return html;
}

function inlineFormat(text: string): string {
  // Bold + italic
  let out = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Links [text](url)
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return out;
}

function slugify(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/\*+/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9àèéìòù]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Heading extraction ────────────────────────────────────────────────────────

export function extractHeadings(html: string): Heading[] {
  const regex = /<(h2)[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi;
  const headings: Heading[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    headings.push({ id, text, level: 2 });
  }
  return headings;
}

// ─── File readers ──────────────────────────────────────────────────────────────

function readPost(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const contentHtml = markdownToHtml(content);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    modified: data.modified,
    description: data.description ?? "",
    cover: data.cover,
    persona: data.persona,
    entity: data.entity,
    jsonLd: data.jsonLd ? JSON.stringify(data.jsonLd) : undefined,
    contentHtml,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files
    .map((f) => readPost(f.replace(/\.mdx$/, "")))
    .filter((p): p is Post => p !== null);

  // Sort by date descending (newest first)
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export function getAllPostMetas(): PostMeta[] {
  return getAllPosts().map(({ contentHtml: _, ...meta }) => meta);
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
