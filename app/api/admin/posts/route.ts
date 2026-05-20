/**
 * GET  /api/admin/posts     → list all post slugs + frontmatter (from Git)
 * POST /api/admin/posts     → create a new post (commits to GitHub main)
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import {
  listPosts,
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

  const refs = await listPosts();
  const posts = await Promise.all(
    refs.map(async ({ slug, locale }) => {
      const file = await readPostFile(slug, locale);
      if (!file) return null;
      try {
        const data = deserializePost(file.content);
        return { ...data, slug, locale, sha: file.sha };
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

  // Reject if a file with this slug already exists in this locale —
  // a collision would silently overwrite the existing post. The same
  // slug in the OTHER locale is fine (a translated pair).
  const existing = await readPostFile(body.slug, body.locale);
  if (existing) {
    return NextResponse.json(
      {
        error: `A ${body.locale.toUpperCase()} post with slug "${body.slug}" already exists. Pick a different slug or edit the existing post.`,
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
      locale: body.locale,
      content,
      message: `blog: add ${body.locale}/${body.slug}`,
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
