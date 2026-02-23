import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { IlanlarTable } from "./IlanlarTable";

export default async function AdminIlanlarPage() {
  const supabase = createAdminClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, price, property_type, is_published, is_featured, view_count, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-800">İlanlar</h1>
        <Link
          href="/admin/ilanlar/yeni"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + İlan Ekle
        </Link>
      </div>
      <p className="mb-4 text-sm text-zinc-500">
        İlanı <strong>Yayınla</strong> ile sitede gösterin, <strong>Yayından kaldır</strong> ile sadece taslak yapın. <strong>Düzenle</strong> ile detayları değiştirin, <strong>Sil</strong> ile ilanı kalıcı olarak kaldırın.
      </p>
      <IlanlarTable properties={properties ?? []} />
    </div>
  );
}
