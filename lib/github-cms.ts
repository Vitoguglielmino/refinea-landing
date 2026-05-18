/**
 * GitHub CMS wrapper — reads/writes MDX posts and blog images directly to
 * the repo via the GitHub Contents API. No database, no admin server: posts
 * live as files in Git, the CMS is just a UI on top of `git commit`.
 *
 * Why this pattern:
 *   - Versioning, blame, rollback come free with Git.
 *   - AI engines crawl the published site, not the CMS — so CMS internals
 *     can change without SEO impact.
 *   - Vercel rebuilds in ~30s on push, so the publish loop stays fast.
 *
 * Required env vars (see .env.local.example):
 *   GITHUB_TOKEN          fine-grained PAT with Contents:RW on this repo
 *   GITHUB_REPO_OWNER     github username or org
 *   GITHUB_REPO_NAME      refinea-landing
 */

import { Octokit } from "@octokit/rest";

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_REPO_OWNER;
const REPO = process.env.GITHUB_REPO_NAME;
const BRANCH = process.env.GITHUB_BRANCH ?? "main";

function ensureConfigured() {
  if (!TOKEN || !OWNER || !REPO) {
    throw new Error(
      "GitHub CMS not configured. Set GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME in .env.local.",
    );
  }
}

let _octokit: Octokit | null = null;
function octokit(): Octokit {
  ensureConfigured();
  if (!_octokit) _octokit = new Octokit({ auth: TOKEN });
  return _octokit;
}

const POSTS_DIR = "content/posts";
const IMAGES_DIR = "public/blog";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type GitFile = {
  path: string;
  sha: string;
  content: string;
};

export type CommitAuthor = {
  name: string;
  email: string;
};

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Reads a single file from the repo. Returns null if 404. The `sha` is
 * needed for updates (GitHub requires the parent blob SHA to detect
 * concurrent edits — a manual write between our read and our write).
 */
export async function getFile(path: string): Promise<GitFile | null> {
  try {
    const res = await octokit().repos.getContent({
      owner: OWNER!,
      repo: REPO!,
      path,
      ref: BRANCH,
    });
    if (Array.isArray(res.data) || res.data.type !== "file") return null;
    const content = Buffer.from(res.data.content, "base64").toString("utf-8");
    return { path: res.data.path, sha: res.data.sha, content };
  } catch (err: unknown) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/**
 * Lists all MDX post filenames in content/posts/. Returns slugs without
 * the `.mdx` extension.
 */
export async function listPostSlugs(): Promise<string[]> {
  try {
    const res = await octokit().repos.getContent({
      owner: OWNER!,
      repo: REPO!,
      path: POSTS_DIR,
      ref: BRANCH,
    });
    if (!Array.isArray(res.data)) return [];
    return res.data
      .filter((entry) => entry.type === "file" && entry.name.endsWith(".mdx"))
      .map((entry) => entry.name.replace(/\.mdx$/, ""));
  } catch (err: unknown) {
    if (isNotFound(err)) return [];
    throw err;
  }
}

export async function readPostFile(slug: string): Promise<GitFile | null> {
  return getFile(`${POSTS_DIR}/${slug}.mdx`);
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Creates or updates a file on the configured branch. If `sha` is provided
 * (i.e. updating), GitHub will reject the write if the file changed
 * upstream — caller should propagate the 409 to the UI for resolution.
 */
export async function putFile(opts: {
  path: string;
  content: string;
  message: string;
  sha?: string;
  author?: CommitAuthor;
}): Promise<{ sha: string; commitSha: string }> {
  ensureConfigured();
  const res = await octokit().repos.createOrUpdateFileContents({
    owner: OWNER!,
    repo: REPO!,
    path: opts.path,
    message: opts.message,
    content: Buffer.from(opts.content, "utf-8").toString("base64"),
    branch: BRANCH,
    sha: opts.sha,
    ...(opts.author
      ? {
          author: opts.author,
          committer: opts.author,
        }
      : {}),
  });
  return {
    sha: res.data.content?.sha ?? "",
    commitSha: res.data.commit.sha ?? "",
  };
}

/**
 * Uploads a binary image (already base64-encoded by the caller) to
 * public/blog/. The returned URL is the public-facing path the post
 * frontmatter should reference (e.g. /blog/my-cover.jpg).
 */
export async function putImage(opts: {
  filename: string;
  base64: string;
  message: string;
  author?: CommitAuthor;
}): Promise<{ url: string; sha: string }> {
  ensureConfigured();
  const safe = sanitizeFilename(opts.filename);
  const path = `${IMAGES_DIR}/${safe}`;
  const res = await octokit().repos.createOrUpdateFileContents({
    owner: OWNER!,
    repo: REPO!,
    path,
    message: opts.message,
    content: opts.base64,
    branch: BRANCH,
    ...(opts.author
      ? {
          author: opts.author,
          committer: opts.author,
        }
      : {}),
  });
  return {
    url: `/blog/${safe}`,
    sha: res.data.content?.sha ?? "",
  };
}

export async function writePost(opts: {
  slug: string;
  content: string;
  message: string;
  sha?: string;
  author?: CommitAuthor;
}): Promise<{ sha: string; commitSha: string }> {
  return putFile({
    path: `${POSTS_DIR}/${opts.slug}.mdx`,
    content: opts.content,
    message: opts.message,
    sha: opts.sha,
    author: opts.author,
  });
}

export async function deletePost(opts: {
  slug: string;
  sha: string;
  message: string;
  author?: CommitAuthor;
}): Promise<void> {
  ensureConfigured();
  await octokit().repos.deleteFile({
    owner: OWNER!,
    repo: REPO!,
    path: `${POSTS_DIR}/${opts.slug}.mdx`,
    message: opts.message,
    sha: opts.sha,
    branch: BRANCH,
    ...(opts.author
      ? {
          author: opts.author,
          committer: opts.author,
        }
      : {}),
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isNotFound(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    (err as { status: number }).status === 404
  );
}

/**
 * Filename hygiene for images: lowercase, ASCII only, replace whitespace
 * and special chars with `-`, collapse repeats, keep extension. Prevents
 * URL-encoding issues we already hit with "refinea grigio.svg".
 */
export function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot >= 0 ? name.slice(0, dot) : name;
  const ext = dot >= 0 ? name.slice(dot).toLowerCase() : "";
  const cleanBase = base
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${cleanBase || "image"}${ext}`;
}
