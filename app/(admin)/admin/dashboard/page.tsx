import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();
  const { count: propertiesCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  const { data: recentProperties } = await supabase
    .from("properties")
    .select("id, title, is_published, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">Dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-500">Toplam İlan</p>
          <p className="text-2xl font-bold text-zinc-800">{propertiesCount ?? 0}</p>
        </div>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-zinc-800">Son İlanlar</h2>
        {recentProperties?.length ? (
          <ul className="space-y-2">
            {recentProperties.map((p) => (
              <li key={p.id} className="flex items-center justify-between border-b border-zinc-100 pb-2 last:border-0">
                <Link href={`/admin/ilanlar/${p.id}`} className="text-[var(--color-primary)] hover:underline">
                  {p.title}
                </Link>
                <span className={`rounded px-2 py-0.5 text-xs ${p.is_published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                  {p.is_published ? "Yayında" : "Taslak"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">Henüz ilan yok.</p>
        )}
      </div>
    </div>
  );
}
