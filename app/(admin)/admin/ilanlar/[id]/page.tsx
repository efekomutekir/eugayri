import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { PropertyForm } from "../PropertyForm";

export default async function AdminIlanDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  const { data: images } = await supabase
    .from("property_images")
    .select("id, url, sort_order")
    .eq("property_id", id)
    .order("sort_order");
  const { data: categories } = await supabase.from("categories").select("id, name, slug").order("name");
  if (!property) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/ilanlar" className="text-sm text-zinc-600 hover:underline">← İlanlar</Link>
        <h1 className="text-2xl font-semibold text-zinc-800">İlanı Düzenle</h1>
      </div>
      <PropertyForm
        categories={categories ?? []}
        property={property}
        initialImages={images ?? []}
      />
    </div>
  );
}
