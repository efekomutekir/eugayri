"use client";

import Link from "next/link";
import { useState } from "react";
import { toggleIlanYayin, ilanSil } from "./actions";

type PropertyRow = {
  id: string;
  title: string;
  price: number;
  property_type: string;
  is_published: boolean;
  is_featured: boolean | null;
  view_count: number | null;
  created_at: string;
};

export function IlanlarTable({ properties }: { properties: PropertyRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50">
          <tr>
            <th className="px-4 py-3 font-medium text-zinc-700">Başlık</th>
            <th className="px-4 py-3 font-medium text-zinc-700">Fiyat</th>
            <th className="px-4 py-3 font-medium text-zinc-700">Tip</th>
            <th className="px-4 py-3 font-medium text-zinc-700">Durum</th>
            <th className="px-4 py-3 font-medium text-zinc-700">Görüntülenme</th>
            <th className="px-4 py-3 font-medium text-zinc-700">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {(properties ?? []).map((p) => (
            <IlanRow key={p.id} property={p} />
          ))}
        </tbody>
      </table>
      {(!properties || properties.length === 0) && (
        <p className="px-4 py-8 text-center text-zinc-500">Henüz ilan yok.</p>
      )}
    </div>
  );
}

function IlanRow({ property: p }: { property: PropertyRow }) {
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setError(null);
    setPublishing(true);
    const res = await toggleIlanYayin(p.id, p.is_published);
    setPublishing(false);
    if (!res.ok) setError(res.message ?? "İşlem başarısız.");
  }

  async function handleDelete() {
    const metin = `"${p.title}" ilanını kalıcı olarak silmek istediğinize emin misiniz?`;
    if (!confirm(metin)) return;
    setError(null);
    setDeleting(true);
    const res = await ilanSil(p.id);
    setDeleting(false);
    if (!res.ok) setError(res.message ?? "Silme başarısız.");
  }

  return (
    <tr className="border-b border-zinc-100 last:border-0">
      <td className="px-4 py-3 font-medium text-zinc-800">{p.title}</td>
      <td className="px-4 py-3">{Number(p.price).toLocaleString("tr-TR")} ₺</td>
      <td className="px-4 py-3">{p.property_type === "rent" ? "Kiralık" : "Satılık"}</td>
      <td className="px-4 py-3">
        <span className={`rounded px-2 py-0.5 text-xs ${p.is_published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
          {p.is_published ? "Yayında" : "Taslak"}
        </span>
        {p.is_featured && <span className="ml-1 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">Öne çıkan</span>}
      </td>
      <td className="px-4 py-3 text-zinc-600">{p.view_count ?? 0}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            disabled={publishing}
            className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:opacity-50"
            title={p.is_published ? "Sitede gizle (taslağa al)" : "Sitede yayınla"}
          >
            {publishing ? "..." : p.is_published ? "Yayından kaldır" : "Yayınla"}
          </button>
          <Link
            href={`/admin/ilanlar/${p.id}`}
            className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-[var(--color-primary)] shadow-sm hover:bg-zinc-50"
          >
            Düzenle
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50"
            title="İlanı sil"
          >
            {deleting ? "..." : "Sil"}
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </td>
    </tr>
  );
}
