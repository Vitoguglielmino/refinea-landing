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

export default function ReportForm() {
  const [email, setEmail]       = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isBusinessEmail(email)) {
      setError("Per favore inserisci un'email aziendale. Le email personali (Gmail, Outlook…) non sono accettate.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.duplicate) {
        setDuplicate(true);
      } else if (!res.ok || !data.ok) {
        setError(data.error ?? "Qualcosa è andato storto. Riprova.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border bg-white text-sm text-black placeholder:text-black/30 outline-none transition-all focus:ring-2 focus:ring-accent/10 " +
    (error ? "border-red-400 focus:border-red-400" : "border-black/10 focus:border-accent/40");

  if (duplicate) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v6M10 14v.5" stroke="#6c47ff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-black">Already on the list.</p>
        <p className="text-sm text-black/50 mt-1.5 max-w-xs mx-auto">
          We already have your email. Your Persona Visibility Report is on its way - hang tight.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L8 14L16 6" stroke="#6c47ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-black">Report incoming.</p>
        <p className="text-sm text-black/50 mt-1.5 max-w-xs mx-auto">
          We&apos;ll send your Persona Visibility Report within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
      <input
        type="email"
        required
        placeholder="Work email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        className={inputClass}
      />
      {error && (
        <p className="text-xs text-red-500 leading-relaxed -mt-1 px-1">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Generating..." : "Generate My Report"}
      </button>
      <p className="text-center text-[11px] text-black/30">
        Business domains only.
      </p>
    </form>
  );
}
