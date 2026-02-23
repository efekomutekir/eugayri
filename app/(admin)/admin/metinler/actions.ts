"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function metinlerKaydet(payload: {
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
}) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/metinler");
  revalidatePath("/");
  revalidatePath("/ilanlar");
  revalidatePath("/iletisim");
  return { ok: true };
}
