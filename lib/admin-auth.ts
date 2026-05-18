/**
 * Admin auth — allowlist + Firebase ID token verification.
 *
 * The CMS uses Firebase Auth (passwordless email link) for login, then
 * stores the ID token in a cookie. Every admin page and API route calls
 * `requireAdmin()` to verify the token server-side and check the email
 * against the hardcoded allowlist.
 *
 * Why allowlist instead of Firebase custom claims:
 *   - Two users, both Refinea employees. Adding a third person is a code
 *     change + commit, which is the right friction for granting CMS write
 *     access to a public site.
 *   - No risk of a misconfigured Firebase project granting admin to a
 *     random Google account.
 */

import { cookies } from "next/headers";

/**
 * Hardcoded allowlist. To add an editor: append email here, commit, deploy.
 */
const ALLOWED_EMAILS: ReadonlySet<string> = new Set([
  "vito.guglielmino@refinea.io",
  "giorgio.monaco@refinea.io",
]);

export const ADMIN_COOKIE = "refinea_admin_token";

export type AdminUser = {
  uid: string;
  email: string;
  name?: string;
};

/**
 * Server-side check. Reads the Firebase ID token from cookies, verifies
 * it against the Firebase Admin SDK, then checks the email against the
 * allowlist. Returns the user on success, null otherwise.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  // Lazy import to avoid pulling firebase-admin into pages that don't
  // call this function (it's a large server-only dependency).
  const { verifyIdToken } = await import("./firebaseAdmin");
  try {
    const decoded = await verifyIdToken(token);
    if (!decoded.email) return null;
    const email = decoded.email.toLowerCase();
    if (!ALLOWED_EMAILS.has(email)) return null;
    return {
      uid: decoded.uid,
      email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

/**
 * Convenience: throws (or redirects) if no admin user. Use at the top of
 * every admin page/route.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) {
    throw new AdminAuthError("Unauthorized");
  }
  return user;
}

export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ALLOWED_EMAILS.has(email.toLowerCase());
}
