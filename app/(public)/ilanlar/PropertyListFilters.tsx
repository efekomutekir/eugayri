"use client";

import { useRouter, useSearchParams } from "next/navigation";

const ODA_SECENEKLERI = [
  { value: "", label: "Tümü" },
  { value: "1+0", label: "1+0" },
  { value: "1+1", label: "1+1" },
  { value: "2+1", label: "2+1" },
  { value: "3+1", label: "3+1" },
  { value: "4+1", label: "4+1" },
  { value: "5+1", label: "5+1" },
  { value: "6+", label: "6+" },
];

type Props = {
  categories: { id: string; name: string }[];
  ilList: string[];
};

export function PropertyListFilters({ categories, ilList }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("sayfa");
    router.push(`/ilanlar?${next.toString()}`);
  }

  function clearFilters() {
    router.push("/ilanlar");
  }

  const hasFilters =
    searchParams.get("tip") ||
    searchParams.get("min_fiyat") ||
    searchParams.get("max_fiyat") ||
    searchParams.get("oda") ||
    searchParams.get("kategori") ||
    searchParams.get("il");

  const inputClass =
    "w-full min-w-0 rounded-xl border border-white/20 bg-[var(--eu-black)] px-4 py-2.5 text-sm text-[var(--eu-white)] placeholder:text-[var(--eu-muted)] focus:border-[var(--eu-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--eu-gold)] [appearance:textfield] [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const selectClass =
    "w-full min-w-0 rounded-xl border border-white/20 bg-[var(--eu-black)] px-4 py-2.5 text-sm text-[var(--eu-white)] focus:border-[var(--eu-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--eu-gold)] cursor-pointer";

  return (
    <section className="rounded-2xl border border-white/10 bg-[var(--eu-black-soft)] p-6 shadow-lg" aria-label="Filtrele">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--eu-muted-light)]">
          Filtrele
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-[var(--eu-gold)] hover:underline"
          >
            Filtreleri temizle
          </button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div>
          <label htmlFor="filter-tip" className="mb-1.5 block text-xs font-medium text-[var(--eu-muted)]">
            İlan tipi
          </label>
          <select
            id="filter-tip"
            value={searchParams.get("tip") ?? ""}
            onChange={(e) => updateFilter("tip", e.target.value)}
            className={selectClass}
          >
            <option value="">Tümü</option>
            <option value="sale">Satılık</option>
            <option value="rent">Kiralık</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-min" className="mb-1.5 block text-xs font-medium text-[var(--eu-muted)]">
            Min fiyat (₺)
          </label>
          <input
            id="filter-min"
            type="number"
            min={0}
            placeholder="0"
            defaultValue={searchParams.get("min_fiyat") ?? ""}
            onBlur={(e) => updateFilter("min_fiyat", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="filter-max" className="mb-1.5 block text-xs font-medium text-[var(--eu-muted)]">
            Max fiyat (₺)
          </label>
          <input
            id="filter-max"
            type="number"
            min={0}
            placeholder="Sınırsız"
            defaultValue={searchParams.get("max_fiyat") ?? ""}
            onBlur={(e) => updateFilter("max_fiyat", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="filter-oda" className="mb-1.5 block text-xs font-medium text-[var(--eu-muted)]">
            Oda sayısı
          </label>
          <select
            id="filter-oda"
            value={searchParams.get("oda") ?? ""}
            onChange={(e) => updateFilter("oda", e.target.value)}
            className={selectClass}
          >
            {ODA_SECENEKLERI.map((o) => (
              <option key={o.value || "tumu"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-kategori" className="mb-1.5 block text-xs font-medium text-[var(--eu-muted)]">
            Kategori
          </label>
          <select
            id="filter-kategori"
            value={searchParams.get("kategori") ?? ""}
            onChange={(e) => updateFilter("kategori", e.target.value)}
            className={selectClass}
          >
            <option value="">Tümü</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-il" className="mb-1.5 block text-xs font-medium text-[var(--eu-muted)]">
            İl
          </label>
          <select
            id="filter-il"
            value={searchParams.get("il") ?? ""}
            onChange={(e) => updateFilter("il", e.target.value)}
            className={selectClass}
          >
            <option value="">Tümü</option>
            {ilList.map((il) => (
              <option key={il} value={il}>
                {il}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
