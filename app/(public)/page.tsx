import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/site-settings";
import { PropertySlider } from "@/components/PropertySlider";

export default async function HomePage() {
  const supabase = createAdminClient();
  const settings = await getSiteSettings();

  const { data: featured } = await supabase
    .from("properties")
    .select("id, title, price, property_type, area_sqm, room_count")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const { data: recent } = await supabase
    .from("properties")
    .select("id, title, price, property_type, area_sqm, room_count")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(8);

  const list = (featured?.length ? featured : recent) ?? [];
  const ids = list.map((p) => p.id);
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

  const { count: totalCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const heroTitle = settings.hero_title || "Hayalinizdeki mülkü güvenle bulun";
  const heroSubtitle = settings.hero_subtitle || "Satılık ve kiralık konut, iş yeri ve arsa ilanları. Profesyonel danışmanlık ve şeffaf süreç.";
  const heroCtaPrimary = settings.hero_cta_primary || "İlanları İncele";
  const heroCtaSecondary = settings.hero_cta_secondary || "İletişime Geçin";
  const stats1Label = settings.stats_1_label || "Şeffaf Süreç";
  const stats2Label = settings.stats_2_label || "Aktif İlan";
  const stats3Label = settings.stats_3_label || "7/24 Danışman Desteği";
  const nedenBizTitle = settings.neden_biz_title || "Neden EU GAYRİMENKUL?";
  const n1 = { title: settings.neden_biz_1_title || "Güvenilir İlanlar", text: settings.neden_biz_1_text || "Tüm ilanlarımız kontrol edilmiş, güncel ve şeffaf bilgilerle sunulur." };
  const n2 = { title: settings.neden_biz_2_title || "Profesyonel Danışmanlık", text: settings.neden_biz_2_text || "Alım, satım ve kiralama süreçlerinde yanınızdayız." };
  const n3 = { title: settings.neden_biz_3_title || "Kişiye Özel Çözümler", text: settings.neden_biz_3_text || "İhtiyacınıza uygun mülkü birlikte belirliyoruz." };
  const ctaTitle = settings.cta_title || "Aradığınız mülkü bulamadınız mı?";
  const ctaButton = settings.cta_button || "İletişime Geçin";

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-[var(--eu-black-soft)] py-28 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--eu-gold-muted),transparent)]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--eu-gold)]">
            EU GAYRİMENKUL
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-[var(--eu-white)] md:text-5xl lg:text-6xl whitespace-pre-line">
            {heroTitle}
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[var(--eu-muted-light)]">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/ilanlar"
              className="eu-btn-primary rounded-xl bg-[var(--eu-gold)] px-8 py-4 font-semibold text-[var(--eu-black)] hover:bg-[var(--eu-gold-light)]"
            >
              {heroCtaPrimary}
            </Link>
            <Link
              href="/iletisim"
              className="rounded-xl border border-white/30 px-8 py-4 font-semibold text-[var(--eu-white)] transition hover:border-[var(--eu-gold)] hover:bg-[var(--eu-gold-muted)] hover:text-[var(--eu-gold)]"
            >
              {heroCtaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-4xl font-bold tracking-tight text-[var(--eu-gold)] md:text-5xl">%100</p>
              <p className="mt-2 text-sm font-medium text-[var(--eu-muted-light)]">{stats1Label}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold tracking-tight text-[var(--eu-gold)] md:text-5xl">{totalCount ?? 0}+</p>
              <p className="mt-2 text-sm font-medium text-[var(--eu-muted-light)]">{stats2Label}</p>
            </div>
            <div className="col-span-2 text-center md:col-span-1">
              <p className="text-4xl font-bold tracking-tight text-[var(--eu-gold)] md:text-5xl">7/24</p>
              <p className="mt-2 text-sm font-medium text-[var(--eu-muted-light)]">{stats3Label}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mb-10 text-2xl font-bold tracking-tight text-[var(--eu-white)] md:text-3xl">
          {featured?.length ? "Öne Çıkan İlanlar" : "Son Eklenen İlanlar"}
        </h2>
        <PropertySlider items={list} imageByProperty={imageByProperty} />
        {list.length === 0 && (
          <p className="py-20 text-center text-[var(--eu-muted)]">Henüz ilan bulunmuyor.</p>
        )}
        {list.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/ilanlar"
              className="eu-btn-primary inline-flex items-center rounded-xl border border-[var(--eu-gold)] px-8 py-3.5 font-medium text-[var(--eu-gold)] transition hover:bg-[var(--eu-gold)] hover:text-[var(--eu-black)]"
            >
              Tüm İlanlar
            </Link>
          </div>
        )}
      </section>

      <section className="border-t border-white/10 bg-[var(--eu-black-soft)] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-14 text-center text-2xl font-bold tracking-tight text-[var(--eu-white)] md:text-3xl">
            {nedenBizTitle}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="eu-card rounded-2xl border border-white/10 bg-[var(--eu-black-card)] p-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--eu-gold-muted)] text-2xl text-[var(--eu-gold)]">✓</div>
              <h3 className="text-lg font-semibold text-[var(--eu-white)]">{n1.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--eu-muted-light)]">{n1.text}</p>
            </div>
            <div className="eu-card rounded-2xl border border-white/10 bg-[var(--eu-black-card)] p-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--eu-gold-muted)] text-2xl text-[var(--eu-gold)]">✓</div>
              <h3 className="text-lg font-semibold text-[var(--eu-white)]">{n2.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--eu-muted-light)]">{n2.text}</p>
            </div>
            <div className="eu-card rounded-2xl border border-white/10 bg-[var(--eu-black-card)] p-8 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--eu-gold-muted)] text-2xl text-[var(--eu-gold)]">✓</div>
              <h3 className="text-lg font-semibold text-[var(--eu-white)]">{n3.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--eu-muted-light)]">{n3.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--eu-white)] md:text-3xl">{ctaTitle}</h2>
          <p className="mt-4 leading-relaxed text-[var(--eu-muted-light)]">İhtiyaçlarınızı bize iletin, size özel ilanlar önerelim.</p>
          <Link
            href="/iletisim"
            className="eu-btn-primary mt-10 inline-block rounded-xl bg-[var(--eu-gold)] px-10 py-4 font-semibold text-[var(--eu-black)] hover:bg-[var(--eu-gold-light)]"
          >
            {ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
