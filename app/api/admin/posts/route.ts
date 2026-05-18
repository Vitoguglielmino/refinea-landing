/**
 * GET  /api/admin/posts     → list all post slugs + frontmatter (from Git)
 * POST /api/admin/posts     → create a new post (commits to GitHub main)
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import {
  listPostSlugs,
  readPostFile,
  writePost,
  type CommitAuthor,
} from "@/lib/github-cms";
import { deserializePost, serializePost } from "@/lib/post-serializer";
import {
  validatePost,
  hasErrors,
  type PostInput,
} from "@/lib/post-validation";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slugs = await listPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const file = await readPostFile(slug);
      if (!file) return null;
      try {
        const data = deserializePost(file.content);
        return { ...data, slug, sha: file.sha };
      } catch {
        return null;
      }
    }),
  );
  const sorted = posts
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return NextResponse.json({ posts: sorted });
}

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: PostInput;
  try {
    body = (await req.json()) as PostInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const issues = validatePost(body);
  if (hasErrors(issues)) {
    return NextResponse.json(
      { error: "Validation failed", issues },
      { status: 422 },
    );
  }

  // Reject if a file with this slug already exists — slug collision would
  // overwrite the existing post silently.
  const existing = await readPostFile(body.slug);
  if (existing) {
    return NextResponse.json(
      {
        error: `A post with slug "${body.slug}" already exists. Pick a different slug or edit the existing post.`,
      },
      { status: 409 },
    );
  }

  const author: CommitAuthor = {
    name: user.name ?? user.email,
    email: user.email,
  };

  const content = serializePost(body);
  try {
    const result = await writePost({
      slug: body.slug,
      content,
      message: `blog: add ${body.slug}`,
      author,
    });
    return NextResponse.json({
      ok: true,
      slug: body.slug,
      sha: result.sha,
      commitSha: result.commitSha,
      issues,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "GitHub write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
