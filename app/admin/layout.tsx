import type { Metadata } from "next";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin-auth";
import SignOutButton from "./SignOutButton";
import "../globals.css";

export const metadata: Metadata = {
  title: "Refinea CMS",
  robots: { index: false, follow: false },
};

/**
 * Admin layout — sits OUTSIDE the [locale] tree so it has no nav, no
 * footer, no i18n. Pure admin chrome.
 *
 * Auth handling: each page calls `requireAdmin()` (which redirects to
 * /admin/login on failure). The layout itself just decides whether to
 * render the sidebar chrome — if no user, render bare (used by the login
 * page); if user present, render sidebar + content.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f5f6f7] text-black antialiased font-sans">
        {user ? (
          <div className="min-h-screen flex">
            <aside className="w-[240px] bg-white border-r border-black/[0.06] flex flex-col sticky top-0 h-screen">
              <div className="px-5 py-5 border-b border-black/[0.06]">
                <Link href="/admin/blog" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
                    R
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold text-black">Refinea</span>
                    <span className="text-[10px] text-black/40 uppercase tracking-wider font-mono">
                      CMS
                    </span>
                  </div>
                </Link>
              </div>

              <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                <Link
                  href="/admin/blog"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-black/75 hover:bg-black/[0.04] transition-colors"
                >
                  Blog posts
                </Link>
                <Link
                  href="/admin/blog/new"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/[0.06] transition-colors"
                >
                  + New post
                </Link>
                <div className="my-2 mx-3 h-px bg-black/[0.06]" />
                <Link
                  href="/admin/guide"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-black/75 hover:bg-black/[0.04] transition-colors"
                >
                  Guida
                </Link>
                <a
                  href="/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-black/55 hover:bg-black/[0.04] transition-colors"
                >
                  View live blog ↗
                </a>
              </nav>

              <div className="px-5 py-4 border-t border-black/[0.06]">
                <div className="text-xs text-black/50 mb-2 truncate">
                  {user.email}
                </div>
                <SignOutButton />
              </div>
            </aside>

            <main className="flex-1 min-w-0">{children}</main>
          </div>
        ) : (
          // No chrome — used by /admin/login and any redirect target.
          <main className="min-h-screen">{children}</main>
        )}
      </body>
    </html>
  );
}

