import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types/database";

const defaults: SiteSettings = {
  id: 1,
  site_name: "EU GAYRİMENKUL",
  logo_url: null,
  primary_color: "#2563eb",
  background_color: "#ffffff",
  header_background: "#ffffff",
  footer_background: "#f3f4f6",
  contact_phone: null,
  contact_email: null,
  contact_address: null,
  contact_whatsapp: null,
  hero_title: "Hayalinizdeki mülkü güvenle bulun",
  hero_subtitle: null,
  hero_cta_primary: null,
  hero_cta_secondary: null,
  cta_title: null,
  cta_button: null,
  neden_biz_title: null,
  neden_biz_1_title: null,
  neden_biz_1_text: null,
  neden_biz_2_title: null,
  neden_biz_2_text: null,
  neden_biz_3_title: null,
  neden_biz_3_text: null,
  stats_1_label: null,
  stats_2_label: null,
  stats_3_label: null,
  updated_at: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error || !data) return defaults;
  return data as SiteSettings;
}

