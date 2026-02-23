import { createClient } from "@/lib/supabase/server";
import { SiteMetinleriForm } from "./SiteMetinleriForm";

export default async function AdminMetinlerPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("hero_title, hero_subtitle, hero_cta_primary, hero_cta_secondary, cta_title, cta_button, neden_biz_title, neden_biz_1_title, neden_biz_1_text, neden_biz_2_title, neden_biz_2_text, neden_biz_3_title, neden_biz_3_text, stats_1_label, stats_2_label, stats_3_label")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">Site Metinleri</h1>
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Aşağıdaki kutularda <strong>şu an sitede görünen (kayıtlı) metinler</strong> yer alır. Değiştirip Kaydet&apos;e basarak güncelleyebilirsiniz. Boş alanlar varsayılan metinle doldurulur.
      </p>
      <SiteMetinleriForm settings={settings} />
    </div>
  );
}
