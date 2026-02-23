"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { metinlerKaydet } from "./actions";

type Settings = {
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_cta_primary?: string | null;
  hero_cta_secondary?: string | null;
  cta_title?: string | null;
  cta_button?: string | null;
  neden_biz_title?: string | null;
  neden_biz_1_title?: string | null;
  neden_biz_1_text?: string | null;
  neden_biz_2_title?: string | null;
  neden_biz_2_text?: string | null;
  neden_biz_3_title?: string | null;
  neden_biz_3_text?: string | null;
  stats_1_label?: string | null;
  stats_2_label?: string | null;
  stats_3_label?: string | null;
} | null;

export function SiteMetinleriForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaults = {
    hero_title: "Hayalinizdeki mülkü güvenle bulun",
    hero_subtitle: "Satılık ve kiralık konut, iş yeri ve arsa ilanları. Profesyonel danışmanlık ve şeffaf süreç.",
    hero_cta_primary: "İlanları İncele",
    hero_cta_secondary: "İletişime Geçin",
    cta_title: "Aradığınız mülkü bulamadınız mı?",
    cta_button: "İletişime Geçin",
    neden_biz_title: "Neden EU GAYRİMENKUL?",
    n1_title: "Güvenilir İlanlar",
    n1_text: "Tüm ilanlarımız kontrol edilmiş, güncel ve şeffaf bilgilerle sunulur.",
    n2_title: "Profesyonel Danışmanlık",
    n2_text: "Alım, satım ve kiralama süreçlerinde yanınızdayız.",
    n3_title: "Kişiye Özel Çözümler",
    n3_text: "İhtiyacınıza uygun mülkü birlikte belirliyoruz.",
    stats_1: "Şeffaf Süreç",
    stats_2: "Aktif İlan",
    stats_3: "7/24 Danışman Desteği",
  };

  const [heroTitle, setHeroTitle] = useState(settings?.hero_title ?? defaults.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(settings?.hero_subtitle ?? defaults.hero_subtitle);
  const [heroCtaPrimary, setHeroCtaPrimary] = useState(settings?.hero_cta_primary ?? defaults.hero_cta_primary);
  const [heroCtaSecondary, setHeroCtaSecondary] = useState(settings?.hero_cta_secondary ?? defaults.hero_cta_secondary);
  const [ctaTitle, setCtaTitle] = useState(settings?.cta_title ?? defaults.cta_title);
  const [ctaButton, setCtaButton] = useState(settings?.cta_button ?? defaults.cta_button);
  const [nedenBizTitle, setNedenBizTitle] = useState(settings?.neden_biz_title ?? defaults.neden_biz_title);
  const [n1Title, setN1Title] = useState(settings?.neden_biz_1_title ?? defaults.n1_title);
  const [n1Text, setN1Text] = useState(settings?.neden_biz_1_text ?? defaults.n1_text);
  const [n2Title, setN2Title] = useState(settings?.neden_biz_2_title ?? defaults.n2_title);
  const [n2Text, setN2Text] = useState(settings?.neden_biz_2_text ?? defaults.n2_text);
  const [n3Title, setN3Title] = useState(settings?.neden_biz_3_title ?? defaults.n3_title);
  const [n3Text, setN3Text] = useState(settings?.neden_biz_3_text ?? defaults.n3_text);
  const [stats1, setStats1] = useState(settings?.stats_1_label ?? defaults.stats_1);
  const [stats2, setStats2] = useState(settings?.stats_2_label ?? defaults.stats_2);
  const [stats3, setStats3] = useState(settings?.stats_3_label ?? defaults.stats_3);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await metinlerKaydet({
        hero_title: heroTitle || null,
        hero_subtitle: heroSubtitle || null,
        hero_cta_primary: heroCtaPrimary || null,
        hero_cta_secondary: heroCtaSecondary || null,
        cta_title: ctaTitle || null,
        cta_button: ctaButton || null,
        neden_biz_title: nedenBizTitle || null,
        neden_biz_1_title: n1Title || null,
        neden_biz_1_text: n1Text || null,
        neden_biz_2_title: n2Title || null,
        neden_biz_2_text: n2Text || null,
        neden_biz_3_title: n3Title || null,
        neden_biz_3_text: n3Text || null,
        stats_1_label: stats1 || null,
        stats_2_label: stats2 || null,
        stats_3_label: stats3 || null,
      });
      if (!result.ok) throw new Error(result.message);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 border-b border-zinc-200 pb-2 text-base font-semibold text-zinc-800">Hero (üst alan)</h3>
        <div className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Ana başlık (kayıtlı metin aşağıda)</span>
            <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder={defaults.hero_title} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Alt başlık / açıklama (kayıtlı metin aşağıda)</span>
            <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} rows={2} placeholder={defaults.hero_subtitle} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700">Birincil buton metni</span>
              <input value={heroCtaPrimary} onChange={(e) => setHeroCtaPrimary(e.target.value)} placeholder={defaults.hero_cta_primary} className="rounded-lg border border-zinc-300 px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-zinc-700">İkincil buton metni</span>
              <input value={heroCtaSecondary} onChange={(e) => setHeroCtaSecondary(e.target.value)} placeholder={defaults.hero_cta_secondary} className="rounded-lg border border-zinc-300 px-3 py-2" />
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 border-b border-zinc-200 pb-2 text-base font-semibold text-zinc-800">İstatistik etiketleri (sırayla)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">1. etiket (kayıtlı değer kutu içinde)</span>
            <input value={stats1} onChange={(e) => setStats1(e.target.value)} placeholder={defaults.stats_1} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">2. etiket</span>
            <input value={stats2} onChange={(e) => setStats2(e.target.value)} placeholder={defaults.stats_2} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">3. etiket</span>
            <input value={stats3} onChange={(e) => setStats3(e.target.value)} placeholder={defaults.stats_3} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 border-b border-zinc-200 pb-2 text-base font-semibold text-zinc-800">Neden Biz bölümü</h3>
        <div className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Bölüm başlığı</span>
            <input value={nedenBizTitle} onChange={(e) => setNedenBizTitle(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          {[
            { title: n1Title, setTitle: setN1Title, text: n1Text, setText: setN1Text, label: "Kart 1" },
            { title: n2Title, setTitle: setN2Title, text: n2Text, setText: setN2Text, label: "Kart 2" },
            { title: n3Title, setTitle: setN3Title, text: n3Text, setText: setN3Text, label: "Kart 3" },
          ].map((c, i) => (
            <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
              <p className="mb-2 text-xs font-medium text-zinc-500">{c.label}</p>
              <input value={c.title} onChange={(e) => c.setTitle(e.target.value)} className="mb-2 w-full rounded-lg border border-zinc-300 px-3 py-2" placeholder="Başlık" />
              <textarea value={c.text} onChange={(e) => c.setText(e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-300 px-3 py-2" placeholder="Metin" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="mb-4 border-b border-zinc-200 pb-2 text-base font-semibold text-zinc-800">Alt CTA bölümü</h3>
        <div className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Başlık (kayıtlı metin kutu içinde)</span>
            <input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} placeholder={defaults.cta_title} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Buton metni</span>
            <input value={ctaButton} onChange={(e) => setCtaButton(e.target.value)} placeholder={defaults.cta_button} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-800 px-6 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
