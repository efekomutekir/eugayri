import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PropertyFormClient } from "./PropertyFormClient";

export default async function YeniIlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">Yeni İlan</h1>
      <PropertyFormClient categories={categories ?? []} userId={user.id} />
    </div>
  );
}
