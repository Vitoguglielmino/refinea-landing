import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "crypto";
import { getFirestoreDb } from "../../../lib/firebaseAdmin";

export const runtime = "nodejs"; // firebase-admin richiede runtime node

function trunc(v: unknown, max: number) {
  if (v === null || v === undefined) return null;
  const s = String(v);
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: Request) {
  try {
    const expected = process.env.LOG_SHARED_SECRET;
    if (!expected) throw new Error("Missing env var: LOG_SHARED_SECRET");

    const got = req.headers.get("x-log-secret");
    if (!got || got !== expected) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const doc = {
      event: trunc(body.event, 64) ?? "unknown",
      bot_name: trunc(body.botName ?? body.bot_name, 64) ?? "unknown",
      path: trunc(body.path, 256) ?? "/",
      ua: trunc(body.ua ?? body.user_agent, 512),
      referer: trunc(body.referer, 512),
      host: trunc(body.host, 128),
      ip_hash: trunc(body.ipHash ?? body.ip_hash, 128),
      request_id: randomUUID(),
      ts: FieldValue.serverTimestamp(),
    };

    const db = getFirestoreDb();
    const ref = await db.collection("bot_events").add(doc);

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}