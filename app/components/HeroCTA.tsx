"use client";

import { useState } from "react";

const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.it", "yahoo.fr", "yahoo.es", "yahoo.co.uk",
  "outlook.com", "outlook.it",
  "hotmail.com", "hotmail.it", "hotmail.fr", "hotmail.es",
  "live.com", "live.it",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "protonmail.com", "proton.me",
  "libero.it", "virgilio.it", "tiscali.it", "alice.it", "tin.it", "fastwebnet.it",
  "msn.com", "ymail.com",
]);

function isBusinessEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return !!domain && !PERSONAL_DOMAINS.has(domain);
}

export default function HeroCTA() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your work email to get started.");
      return;
    }
    if (!isBusinessEmail(trimmed)) {
      setError("Please use a business email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (data.duplicate) {
        setDuplicate(true);
      } else if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-black/[0.09] shadow-[0_2px_16px_rgba(0,0,0,0.07)] px-5 py-3.5 max-w-[440px]">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0">
          <path d="M4 10L8 14L16 6" stroke="#6c47ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm text-black/70">Report incoming - check your inbox within 24 hours.</span>
      </div>
    );
  }

  if (duplicate) {
    return (
      <div className="flex items-center gap-3 bg-white rounded-2xl border border-black/[0.09] shadow-[0_2px_16px_rgba(0,0,0,0.07)] px-5 py-3.5 max-w-[440px]">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="shrink-0">
          <path d="M10 4v6M10 14v.5" stroke="#6c47ff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm text-black/70">Already on the list - your report is on its way.</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-w-[440px]">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-1.5 bg-white rounded-full border shadow-[0_2px_16px_rgba(0,0,0,0.07)] px-2 py-1.5 ${
          error ? "border-red-400" : "border-black/[0.09]"
        }`}
      >
        <input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          className="flex-1 text-sm text-black placeholder:text-black/35 bg-transparent outline-none px-3 py-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 h-10 px-5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent/90 active:scale-[0.98] transition-all whitespace-nowrap disabled:opacity-60"
        >
          {loading ? "Sending…" : "Get Started"}
        </button>
      </form>
      {error && (
        <p className="text-xs text-red-500 pl-4">{error}</p>
      )}
    </div>
  );
}
