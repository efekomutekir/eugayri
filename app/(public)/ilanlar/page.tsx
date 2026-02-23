import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { PropertyListFilters } from "./PropertyListFilters";
import ilIlceData from "@/data/il-ilce.json";

const IL_LIST = Object.keys(ilIlceData as Record<string, string[]>).sort();

export default async function IlanlarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const supabase = createAdminClient();

  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  function buildQuery() {
    let q = supabase
      .from("properties")
      .select("id, title, price, property_type, area_sqm, room_count, city, district")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (params.tip === "sale" || params.tip === "rent") q = q.eq("property_type", params.tip);
    if (params.min_fiyat) q = q.gte("price", Number(params.min_fiyat));
    if (params.max_fiyat) q = q.lte("price", Number(params.max_fiyat));
    if (params.oda) q = q.eq("room_count", params.oda);
    if (params.kategori) q = q.eq("category_id", params.kategori);
    if (params.il) q = q.eq("city", params.il);
    return q;
  }

  const page = Math.max(1, Number(params.sayfa) || 1);
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { count } = await buildQuery().select("*", { count: "exact", head: true });
  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const { data: properties } = await buildQuery().range(from, to);
  const ids = (properties ?? []).map((p) => p.id);
  const { data: firstImages } = ids.length
    ? await supabase
        .from("property_images")
        .select("property_id, url")
        .in("property_id", ids)
        .order("sort_order")
    : { data: [] };
  const imageByProperty: Record<string, string> = {};
  (firstImages ?? []).forEach((row) => {
    if (!imageByProperty[row.property_id]) imageByProperty[row.property_id] = row.url;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--eu-white)] md:text-4xl">
          İlanlar
        </h1>
        <p className="mt-2 text-[var(--eu-muted-light)]">
          Satılık ve kiralık mülk ilanları
        </p>
      </div>
      <PropertyListFilters categories={categories ?? []} ilList={IL_LIST} />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(properties ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/ilan/${p.id}`}
            className="group block"
          >
            <article className="eu-card h-full overflow-hidden rounded-2xl border border-white/10 bg-[var(--eu-black-card)] transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                {imageByProperty[p.id] ? (
                  <Image
                    src={imageByProperty[p.id]}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[var(--eu-muted)]">
                    Görsel yok
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                <span className="absolute left-4 top-4 rounded-lg bg-[var(--eu-gold)] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[var(--eu-black)]">
                  {p.property_type === "rent" ? "Kiralık" : "Satılık"}
                </span>
              </div>
              <div className="p-5 md:p-6">
                <h2 className="font-semibold leading-snug text-[var(--eu-white)] line-clamp-2 transition group-hover:text-[var(--eu-gold)]">
                  {p.title}
                </h2>
                <p className="mt-3 text-xl font-bold text-[var(--eu-gold)]">
                  {Number(p.price).toLocaleString("tr-TR")} ₺
                  {p.property_type === "rent" && " / ay"}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--eu-muted-light)]">
                  {p.room_count && <span>{p.room_count} oda</span>}
                  {p.area_sqm != null && <span>{p.area_sqm} m²</span>}
                  {p.city && <span>{p.city}</span>}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      {properties?.length === 0 && (
        <p className="py-16 text-center text-[var(--eu-muted)]">Filtreye uygun ilan bulunamadı.</p>
      )}
      {totalPages > 1 && (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="Sayfa navigasyonu">
          {page > 1 && (
            <Link
              href={`/ilanlar?${new URLSearchParams({ ...params, sayfa: String(page - 1) }).toString()}`}
              className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium text-[var(--eu-white)] transition hover:border-[var(--eu-gold)] hover:text-[var(--eu-gold)]"
            >
              Önceki
            </Link>
          )}
          <span className="px-4 text-sm text-[var(--eu-muted-light)]">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/ilanlar?${new URLSearchParams({ ...params, sayfa: String(page + 1) }).toString()}`}
              className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium text-[var(--eu-white)] transition hover:border-[var(--eu-gold)] hover:text-[var(--eu-gold)]"
            >
              Sonraki
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
