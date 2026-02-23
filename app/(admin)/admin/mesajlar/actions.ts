"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function mesajSil(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/mesajlar");
  return { ok: true };
}
