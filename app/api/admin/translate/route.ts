/**
 * POST /api/admin/translate
 *   Body: { sourceTitle, sourceDescription, sourceBody, targetLocale }
 *   Returns: { title, description, body } in target locale
 *
 * Pure draft generator — caller must review and submit via /api/admin/posts.
 * Never auto-publishes.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { translatePost, type TranslationInput } from "@/lib/gemini-translate";

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: TranslationInput;
  try {
    body = (await req.json()) as TranslationInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.targetLocale !== "en" && body.targetLocale !== "it") {
    return NextResponse.json(
      { error: "targetLocale must be 'en' or 'it'" },
      { status: 400 },
    );
  }
  if (!body.sourceTitle || !body.sourceBody) {
    return NextResponse.json(
      { error: "sourceTitle and sourceBody are required" },
      { status: 400 },
    );
  }

  try {
    const result = await translatePost(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Translation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
