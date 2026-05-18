import { redirect, notFound } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { readPostFile } from "@/lib/github-cms";
import { deserializePost } from "@/lib/post-serializer";
import PostForm from "@/app/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const { slug } = await params;
  const file = await readPostFile(slug);
  if (!file) notFound();

  const initial = deserializePost(file.content);
  initial.slug = slug;

  return <PostForm mode="edit" initial={initial} initialSha={file.sha} />;
}
