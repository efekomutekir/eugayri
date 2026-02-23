"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function iletisimKaydet(payload: {
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  contact_whatsapp: string | null;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      contact_phone: payload.contact_phone || null,
      contact_email: payload.contact_email || null,
      contact_address: payload.contact_address || null,
      contact_whatsapp: payload.contact_whatsapp || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { ok: false, message: error.message };
  }
  revalidatePath("/admin/iletisim");
  revalidatePath("/");
  revalidatePath("/iletisim");
  return { ok: true };
}
