/**
 * Admin session endpoint.
 *
 * POST /api/admin/session
 *   Body: { idToken: string } — Firebase ID token from client SDK
 *   Effect: verifies the token + allowlist, sets httpOnly cookie used by
 *           getAdminUser() on every subsequent admin request.
 *
 * DELETE /api/admin/session
 *   Effect: clears the cookie (logout).
 */

import { NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebaseAdmin";
import { isAdminEmail, ADMIN_COOKIE } from "@/lib/admin-auth";

const ONE_HOUR_SECONDS = 60 * 60;

export async function POST(req: Request) {
  let body: { idToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  let decoded;
  try {
    decoded = await verifyIdToken(body.idToken);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (!isAdminEmail(decoded.email ?? null)) {
    return NextResponse.json(
      { error: "Email not in admin allowlist" },
      { status: 403 },
    );
  }

  const res = NextResponse.json({
    ok: true,
    user: { uid: decoded.uid, email: decoded.email, name: decoded.name },
  });

  // Cookie lifetime = token lifetime (1h). Re-auth required after expiry,
  // which is fine for an admin UI used in short bursts.
  res.cookies.set(ADMIN_COOKIE, body.idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_HOUR_SECONDS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
