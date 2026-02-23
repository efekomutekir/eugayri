"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function iletisimMesajiGonder(payload: {
  phone: string;
  email: string;
  message: string;
}) {
  const phone = payload.phone?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();
  if (!phone || !email || !message) {
    return { ok: false, message: "Telefon, e-posta ve mesaj alanları zorunludur." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    phone,
    email,
    message,
  });
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
