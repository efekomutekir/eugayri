import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import { notFound } from "next/navigation";
import { PropertyImageGallery } from "@/components/PropertyImageGallery";

const HEATING_LABELS: Record<string, string> = { kombi: "Kombi", soba: "Soba", merkezi: "Merkezi", klima: "Klima", yok: "Yok" };
const FURNISHED_LABELS: Record<string, string> = { esyali: "Eşyalı", esyasiz: "Eşyasız", yari_esyali: "Yarı eşyalı" };
const FRONT_LABELS: Record<string, string> = { kuzey: "Kuzey", guney: "Güney", dogu: "Doğu", bati: "Batı", kuzey_bati: "Kuzey Batı", kuzey_dogu: "Kuzey Doğu", guney_bati: "Güney Batı", guney_dogu: "Güney Doğu" };

export default async function IlanDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const settings = await getSiteSettings();

  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images(url, sort_order),
      categories(name, slug)
    `)
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !property) notFound();

  await supabase
    .from("properties")
    .update({ view_count: (property.view_count ?? 0) + 1 })
    .eq("id", id);

  const images = (property.property_images as { url: string; sort_order: number }[] ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const category = property.categories as { name: string; slug: string } | null;

  const contactPhone = property.contact_phone_override || settings.contact_phone;
  const contactEmail = property.contact_email_override || settings.contact_email;
  const contactWhatsapp = settings.contact_whatsapp;

  const features: { label: string; value: string | number | boolean }[] = [];
  if (property.room_count) features.push({ label: "Oda sayısı", value: property.room_count });
  if (property.bathroom_count != null) features.push({ label: "Banyo", value: property.bathroom_count });
  if (property.area_sqm != null) features.push({ label: "Brüt m²", value: property.area_sqm });
  if (property.floor != null) features.push({ label: "Bulunduğu kat", value: property.floor });
  if (property.total_floors != null) features.push({ label: "Toplam kat", value: property.total_floors });
  if (property.heating_type) features.push({ label: "Isıtma", value: HEATING_LABELS[property.heating_type] || property.heating_type });
  if (property.building_age) features.push({ label: "Bina yaşı", value: property.building_age });
  if (property.furnished) features.push({ label: "Eşya", value: FURNISHED_LABELS[property.furnished] || property.furnished });
  if (property.front) features.push({ label: "Cephe", value: FRONT_LABELS[property.front] || property.front });
  if (property.deed_status) features.push({ label: "Tapu", value: property.deed_status });
  if (property.has_balcony) features.push({ label: "Balkon", value: "Var" });
  if (property.has_parking) features.push({ label: "Otopark", value: "Var" });
  if (property.has_storage) features.push({ label: "Depo", value: "Var" });
  if (property.swap) features.push({ label: "Takas", value: "Kabul" });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/ilanlar"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--eu-muted-light)] transition hover:text-[var(--eu-gold)]"
      >
        ← İlanlara dön
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
        <div className="min-w-0">
          <PropertyImageGallery images={images} title={property.title} />

          <div className="mt-8 rounded-2xl border border-white/10 bg-[var(--eu-black-card)] p-6 shadow-[var(--shadow-card)] md:p-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-lg bg-[var(--eu-gold)] px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-[var(--eu-black)]">
                {property.property_type === "rent" ? "Kiralık" : "Satılık"}
              </span>
              {category && (
                <span className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-[var(--eu-muted-light)]">
                  {category.name}
                </span>
              )}
              {property.listing_number && (
                <span className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-[var(--eu-muted)]">
                  İlan no: {property.listing_number}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--eu-white)] md:text-3xl">
              {property.title}
            </h1>
            <p className="mt-4 text-3xl font-bold text-[var(--eu-gold)]">
              {Number(property.price).toLocaleString("tr-TR")} ₺
              {property.property_type === "rent" && " / ay"}
            </p>

            {features.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--eu-muted-light)]">
                  Özellikler
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-lg text-[var(--eu-gold)]">•</span>
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--eu-muted)]">{f.label}</p>
                        <p className="font-medium text-[var(--eu-white)]">{String(f.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(property.city || property.district || property.address) && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--eu-muted-light)]">
                  Konum
                </h2>
                <p className="mt-2 text-[var(--eu-white)]">
                  {[property.city, property.district].filter(Boolean).join(", ")}
                  {property.address && ` — ${property.address}`}
                </p>
              </div>
            )}

            {property.description && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="font-semibold text-[var(--eu-white)]">Açıklama</h2>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--eu-muted-light)]">
                  {property.description}
                </p>
              </div>
            )}

            {property.video_url && (
              <div className="mt-6">
                <a
                  href={property.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--eu-gold)]/50 px-4 py-2.5 font-medium text-[var(--eu-gold)] transition hover:bg-[var(--eu-gold-muted)]"
                >
                  Videoyu izle →
                </a>
              </div>
            )}
          </div>
        </div>

        {(contactPhone || contactEmail || contactWhatsapp) && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="eu-card rounded-2xl border border-[var(--eu-gold)]/30 bg-[var(--eu-black-card)] p-6">
              <h2 className="text-lg font-semibold text-[var(--eu-white)]">
                Bu ilan hakkında bilgi alın
              </h2>
              <p className="mt-2 text-sm text-[var(--eu-muted-light)]">
                İletişime geçin, size yardımcı olalım.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone}`}
                    className="eu-btn-primary flex items-center justify-center gap-2 rounded-xl bg-[var(--eu-gold)] py-3.5 font-semibold text-[var(--eu-black)] hover:bg-[var(--eu-gold-light)]"
                  >
                    {contactPhone}
                  </a>
                )}
                {contactWhatsapp && (
                  <a
                    href={`https://wa.me/90${contactWhatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-[var(--eu-gold)] py-3.5 font-medium text-[var(--eu-gold)] transition hover:bg-[var(--eu-gold-muted)]"
                  >
                    WhatsApp ile yaz
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 py-3.5 font-medium text-[var(--eu-white)] transition hover:border-[var(--eu-gold)] hover:text-[var(--eu-gold)]"
                  >
                    E-posta gönder
                  </a>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
