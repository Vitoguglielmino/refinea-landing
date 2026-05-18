/**
 * GET /api/admin/sibling?key=<translationKey>&locale=<en|it>
 *   Returns the post in the OPPOSITE locale that shares this
 *   translationKey, or null if none. Used by the CMS Translation panel to
 *   show "linked to: <existing post>" so the editor knows the pair is
 *   already established.
 *
 * Reads via Octokit (not local fs) so the response reflects what is
 * actually committed to the branch, not the editor's in-memory state.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { listPostSlugs, readPostFile } from "@/lib/github-cms";
import { deserializePost } from "@/lib/post-serializer";

export async function GET(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const key = url.searchParams.get("key")?.trim();
  const locale = url.searchParams.get("locale");
  if (!key || (locale !== "en" && locale !== "it")) {
    return NextResponse.json({ sibling: null });
  }
  const otherLocale = locale === "it" ? "en" : "it";

  const slugs = await listPostSlugs();
  for (const slug of slugs) {
    const file = await readPostFile(slug);
    if (!file) continue;
    let parsed;
    try {
      parsed = deserializePost(file.content);
    } catch {
      continue;
    }
    if (parsed.translationKey === key && parsed.locale === otherLocale) {
      return NextResponse.json({
        sibling: {
          slug,
          locale: parsed.locale,
          title: parsed.title,
        },
      });
    }
  }
  return NextResponse.json({ sibling: null });
}
