import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import PostForm from "@/app/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return <PostForm mode="create" />;
}
