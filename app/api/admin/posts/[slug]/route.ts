/**
 * GET    /api/admin/posts/[slug]?locale=en|it  → read single post
 * PUT    /api/admin/posts/[slug]?locale=en|it  → update post (commits)
 * DELETE /api/admin/posts/[slug]?locale=en|it  → delete post
 *
 * Posts live in content/posts/<locale>/, so a slug alone is ambiguous —
 * every request carries a `locale` query param. PUT additionally
 * requires the parent blob `sha` in the body; a 409 from GitHub means
 * the post was edited concurrently.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import {
  readPostFile,
  writePost,
  deletePost,
  type CommitAuthor,
  type PostLocale,
} from "@/lib/github-cms";
import { deserializePost, serializePost } from "@/lib/post-serializer";
import {
  validatePost,
  hasErrors,
  type PostInput,
} from "@/lib/post-validation";

type RouteCtx = { params: Promise<{ slug: string }> };

/** Reads and validates the `locale` query param. Returns null if absent
 *  or invalid — callers turn that into a 400. */
function parseLocale(req: Request): PostLocale | null {
  const v = new URL(req.url).searchParams.get("locale");
  return v === "en" || v === "it" ? v : null;
}

export async function GET(req: Request, { params }: RouteCtx) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const locale = parseLocale(req);
  if (!locale) {
    return NextResponse.json(
      { error: "Missing or invalid 'locale' query param (en|it)" },
      { status: 400 },
    );
  }

  const { slug } = await params;
  const file = await readPostFile(slug, locale);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let data;
  try {
    data = deserializePost(file.content);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Parse failed";
    return NextResponse.json({ error: msg, raw: file.content }, { status: 500 });
  }
  return NextResponse.json({ ...data, slug, locale, sha: file.sha });
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

  // Slug and locale together are the file identity — neither can change
  // via PUT. Renaming or moving locale = delete + create.
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
      locale: body.locale,
      content,
      message: `blog: update ${body.locale}/${slug}`,
      sha: body.sha,
      author,
    });
    return NextResponse.json({
      ok: true,
      slug,
      locale: body.locale,
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

  const locale = parseLocale(req);
  if (!locale) {
    return NextResponse.json(
      { error: "Missing or invalid 'locale' query param (en|it)" },
      { status: 400 },
    );
  }

  const { slug } = await params;
  const file = await readPostFile(slug, locale);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const author: CommitAuthor = {
    name: user.name ?? user.email,
    email: user.email,
  };

  try {
    await deletePost({
      slug,
      locale,
      sha: file.sha,
      message: `blog: delete ${locale}/${slug}`,
      author,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "GitHub delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
