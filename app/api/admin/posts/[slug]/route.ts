/**
 * GET    /api/admin/posts/[slug]   → read single post (frontmatter + body + sha)
 * PUT    /api/admin/posts/[slug]   → update post (commits to GitHub)
 * DELETE /api/admin/posts/[slug]   → delete post
 *
 * PUT requires the `sha` of the parent blob in the body. If GitHub rejects
 * with 409, the post was edited concurrently — UI should re-fetch and let
 * the editor decide.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import {
  readPostFile,
  writePost,
  deletePost,
  type CommitAuthor,
} from "@/lib/github-cms";
import { deserializePost, serializePost } from "@/lib/post-serializer";
import {
  validatePost,
  hasErrors,
  type PostInput,
} from "@/lib/post-validation";

type RouteCtx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: RouteCtx) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const file = await readPostFile(slug);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let data;
  try {
    data = deserializePost(file.content);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Parse failed";
    return NextResponse.json({ error: msg, raw: file.content }, { status: 500 });
  }
  return NextResponse.json({ ...data, slug, sha: file.sha });
}

export async function PUT(req: Request, { params }: RouteCtx) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;

  let body: PostInput & { sha?: string };
  try {
    body = (await req.json()) as PostInput & { sha?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.sha) {
    return NextResponse.json(
      { error: "Missing sha (required to detect concurrent edits)" },
      { status: 400 },
    );
  }

  // Editor cannot change the slug via PUT — slug is the file identity.
  // Renaming = delete + create (a future feature, not now).
  if (body.slug !== slug) {
    return NextResponse.json(
      { error: "Slug change not allowed via PUT. Use delete + create to rename." },
      { status: 400 },
    );
  }

  const issues = validatePost(body);
  if (hasErrors(issues)) {
    return NextResponse.json(
      { error: "Validation failed", issues },
      { status: 422 },
    );
  }

  const author: CommitAuthor = {
    name: user.name ?? user.email,
    email: user.email,
  };

  const content = serializePost(body);
  try {
    const result = await writePost({
      slug,
      content,
      message: `blog: update ${slug}`,
      sha: body.sha,
      author,
    });
    return NextResponse.json({
      ok: true,
      slug,
      sha: result.sha,
      commitSha: result.commitSha,
      issues,
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      (err as { status: number }).status === 409
    ) {
      return NextResponse.json(
        {
          error: "This post was edited elsewhere since you opened it. Reload to see the latest version.",
        },
        { status: 409 },
      );
    }
    const msg = err instanceof Error ? err.message : "GitHub write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteCtx) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const file = await readPostFile(slug);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const author: CommitAuthor = {
    name: user.name ?? user.email,
    email: user.email,
  };

  try {
    await deletePost({
      slug,
      sha: file.sha,
      message: `blog: delete ${slug}`,
      author,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "GitHub delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
