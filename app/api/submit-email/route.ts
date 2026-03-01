import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getFirestoreDb } from "../../../lib/firebaseAdmin";

export const runtime = "nodejs";

// Free/personal email domains to reject
const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.it", "yahoo.fr", "yahoo.es", "yahoo.co.uk",
  "outlook.com", "outlook.it",
  "hotmail.com", "hotmail.it", "hotmail.fr", "hotmail.es",
  "live.com", "live.it",
  "icloud.com", "me.com", "mac.com",
  "aol.com",
  "protonmail.com", "proton.me",
  "libero.it", "virgilio.it", "tiscali.it", "alice.it", "tin.it", "fastwebnet.it",
  "msn.com", "ymail.com",
]);

function isBusinessEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && !PERSONAL_DOMAINS.has(domain);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "Email mancante." }, { status: 400 });
    }

    if (!isBusinessEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Inserisci un'email aziendale." },
        { status: 422 }
      );
    }

    // 1. Check for duplicate email in Firestore
    const db = getFirestoreDb();
    const existing = await db.collection("leads").where("email", "==", email).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ ok: false, duplicate: true, error: "Email già registrata." }, { status: 409 });
    }

    // 2. Save lead to Firestore
    await db.collection("leads").add({
      email,
      source: "landing",
      ts: FieldValue.serverTimestamp(),
    });

    // 2. Notify via SendGrid
    const sgKey = process.env.SENDGRID_API_KEY;
    if (!sgKey) {
      console.error("[submit-email] SENDGRID_API_KEY not set");
    } else {
      const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sgKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: "vito.guglielmino@refinea.io" }, { email: "giorgio.monaco@refinea.io" }] }],
          from: { email: "info@refinea.io", name: "Refinea Landing" },
          subject: "Nuova lead dalla landing",
          content: [
            {
              type: "text/plain",
              value: `${email} è stata inserita nella landing, crea il report e invialo`,
            },
          ],
        }),
      });
      const sgBody = await sgRes.text();
      console.log("[submit-email] SendGrid status:", sgRes.status, "body:", sgBody);
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Errore interno." }, { status: 500 });
  }
}
