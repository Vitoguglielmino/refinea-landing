"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/session", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-xs text-black/45 hover:text-accent transition-colors"
    >
      Sign out
    </button>
  );
}
