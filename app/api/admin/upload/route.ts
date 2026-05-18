/**
 * POST /api/admin/upload
 *   FormData: { file: File }
 *   Returns: { url: "/blog/<sanitized-name>.<ext>" }
 *
 * Commits the uploaded image to public/blog/ on the configured branch.
 * Used by the cover-image field in the post editor.
 */

import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { putImage, sanitizeFilename, type CommitAuthor } from "@/lib/github-cms";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB — covers should be optimized before upload
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file in FormData" }, { status: 400 });
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported mime type: ${file.type}. Allowed: jpg, png, webp, avif, gif, svg.` },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 4 MB — compress before upload.` },
      { status: 400 },
    );
  }

  const filename = sanitizeFilename(file.name);
  const arrayBuf = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuf).toString("base64");

  const author: CommitAuthor = {
    name: user.name ?? user.email,
    email: user.email,
  };

  try {
    const result = await putImage({
      filename,
      base64,
      message: `blog: upload ${filename}`,
      author,
    });
    return NextResponse.json({ url: result.url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
