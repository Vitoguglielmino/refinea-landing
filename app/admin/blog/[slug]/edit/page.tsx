import { redirect, notFound } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { readPostFile } from "@/lib/github-cms";
import { deserializePost } from "@/lib/post-serializer";
import PostForm from "@/app/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const { slug } = await params;
  // Posts live in per-locale folders, so editing needs the locale. The
  // CMS list links carry ?locale=; default to EN if it is somehow
  // missing rather than guessing.
  const localeParam = (await searchParams).locale;
  const locale = localeParam === "it" ? "it" : "en";

  const file = await readPostFile(slug, locale);
  if (!file) notFound();

  const initial = deserializePost(file.content);
  initial.slug = slug;

  return <PostForm mode="edit" initial={initial} initialSha={file.sha} />;
}
