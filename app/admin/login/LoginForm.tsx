"use client";

/**
 * Admin login — Firebase passwordless email link flow.
 *
 * Flow:
 *   1. User enters email → click "Send sign-in link"
 *   2. Firebase emails them a magic link with apiKey + oobCode
 *   3. They click → land back here, Firebase completes sign-in
 *   4. We POST the resulting ID token to /api/admin/session to set the
 *      httpOnly cookie, then redirect to /admin/blog
 *
 * The email must be in the allowlist in lib/admin-auth.ts. If not, the
 * /api/admin/session POST returns 403.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "refineaCmsLoginEmail";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "completing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // On mount, if the URL is a Firebase magic link, complete sign-in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { getFirebaseAuth } = await import("@/lib/firebaseClient");
      const { isSignInWithEmailLink, signInWithEmailLink } = await import(
        "firebase/auth"
      );
      const auth = getFirebaseAuth();
      if (!isSignInWithEmailLink(auth, window.location.href)) return;

      setStatus("completing");
      let storedEmail = window.localStorage.getItem(STORAGE_KEY);
      if (!storedEmail) {
        // Email confirmation if user opens the link on a different device.
        storedEmail = window.prompt("Confirm your email to complete sign-in:");
      }
      if (!storedEmail) {
        setStatus("error");
        setError("Email required to complete sign-in.");
        return;
      }

      try {
        const result = await signInWithEmailLink(
          auth,
          storedEmail,
          window.location.href,
        );
        const idToken = await result.user.getIdToken();

        const res = await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Session setup failed (${res.status})`);
        }

        window.localStorage.removeItem(STORAGE_KEY);
        if (!cancelled) {
          router.push("/admin/blog");
          router.refresh();
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Sign-in failed.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const { getFirebaseAuth } = await import("@/lib/firebaseClient");
      const { sendSignInLinkToEmail } = await import("firebase/auth");
      const auth = getFirebaseAuth();
      await sendSignInLinkToEmail(auth, email.trim().toLowerCase(), {
        url: `${window.location.origin}/admin/login`,
        handleCodeInApp: true,
      });
      window.localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
      setStatus("sent");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send sign-in link.");
    }
  }

  if (status === "completing") {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-black/60">Completing sign-in...</p>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="text-center py-6">
        <p className="text-sm font-semibold text-black mb-2">Check your inbox</p>
        <p className="text-[13px] text-black/55 leading-relaxed">
          We sent a sign-in link to <strong>{email}</strong>. Click it to sign in.
          The link expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={sendLink} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-black/55">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@refinea.io"
          className="px-3.5 py-2.5 rounded-lg border border-black/[0.1] bg-white text-sm focus:outline-none focus:border-accent transition-colors"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending" || !email}
        className="mt-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50 hover:bg-accent/90 transition-colors"
      >
        {status === "sending" ? "Sending..." : "Send sign-in link"}
      </button>
      {error && (
        <div className="text-[12px] text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-2">
          {error}
        </div>
      )}
      <p className="text-[11px] text-black/40 text-center mt-2 leading-relaxed">
        Only emails on the Refinea allowlist can sign in.
      </p>
    </form>
  );
}
