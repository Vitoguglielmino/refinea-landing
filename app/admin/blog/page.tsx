import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin-auth";
import { listPosts, readPostFile } from "@/lib/github-cms";
import { deserializePost } from "@/lib/post-serializer";
import { getSection } from "@/lib/blog-taxonomy";
import { getAuthor } from "@/lib/authors";

export const dynamic = "force-dynamic"; // always read fresh from GitHub

export default async function AdminBlogList() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const refs = await listPosts();
  const posts = (
    await Promise.all(
      refs.map(async ({ slug, locale }) => {
        const file = await readPostFile(slug, locale);
        if (!file) return null;
        try {
          const data = deserializePost(file.content);
          return { ...data, slug, locale };
        } catch {
          return null;
        }
      }),
    )
  )
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <div className="p-8 max-w-[1100px] mx-auto">
      <header className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] mb-1">
            Blog posts
          </h1>
          <p className="text-sm text-black/55">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in the repo
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          + New post
        </Link>
      </header>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-black/[0.06] p-12 text-center">
          <p className="text-sm text-black/50">
            No posts yet. Create your first one.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02] border-b border-black/[0.06]">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-[12px] uppercase tracking-[0.06em] text-black/55">
                  Title
                </th>
                <th className="text-left px-3 py-3 font-semibold text-[12px] uppercase tracking-[0.06em] text-black/55">
                  Section
                </th>
                <th className="text-left px-3 py-3 font-semibold text-[12px] uppercase tracking-[0.06em] text-black/55">
                  Author
                </th>
                <th className="text-left px-3 py-3 font-semibold text-[12px] uppercase tracking-[0.06em] text-black/55">
                  Locale
                </th>
                <th className="text-left px-3 py-3 font-semibold text-[12px] uppercase tracking-[0.06em] text-black/55">
                  Date
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const section = getSection(post.section);
                const author = getAuthor(post.author);
                const editHref = `/admin/blog/${post.slug}/edit?locale=${post.locale}`;
                return (
                  <tr
                    key={`${post.locale}/${post.slug}`}
                    className="border-b border-black/[0.04] last:border-b-0 hover:bg-black/[0.015] transition-colors"
                  >
                    <td className="px-5 py-3 max-w-[460px]">
                      <Link href={editHref} className="block">
                        <div className="font-semibold text-black truncate group-hover:text-accent">
                          {post.title}
                        </div>
                        <div className="text-[12px] text-black/40 font-mono truncate mt-0.5">
                          {post.slug}
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      {section && (
                        <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5 rounded-full text-accent bg-accent/[0.08] border border-accent/[0.15]">
                          {section.shortName}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {author && (
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={author.image}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full object-cover"
                            style={{ width: 20, height: 20 }}
                          />
                          <span className="text-[13px] text-black/70">
                            {author.name.split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[11px] font-mono uppercase text-black/45">
                        {post.locale}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[12px] font-mono text-black/45">
                        {post.date?.slice(0, 10)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={editHref}
                        className="text-[12px] font-medium text-accent hover:underline"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
