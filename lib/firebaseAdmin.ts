import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function getFirestoreDb() {
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
  return getFirestore();
}