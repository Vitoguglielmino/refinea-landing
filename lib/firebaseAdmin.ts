import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function ensureInitialized() {
  if (!admin.apps.length) {
    const projectId = mustEnv("FIREBASE_PROJECT_ID");
    const clientEmail = mustEnv("FIREBASE_CLIENT_EMAIL");
    const privateKey = mustEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
}

export function getFirestoreDb() {
  ensureInitialized();
  return getFirestore();
}

/**
 * Verifies a Firebase ID token issued by the client SDK. Returns the
 * decoded token (uid, email, custom claims, etc.) or throws on invalid /
 * expired / revoked tokens. Used by lib/admin-auth.ts to gate /admin.
 */
export async function verifyIdToken(idToken: string) {
  ensureInitialized();
  return getAuth().verifyIdToken(idToken, true);
}