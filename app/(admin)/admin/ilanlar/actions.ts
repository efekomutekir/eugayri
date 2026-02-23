"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function toggleIlanYayin(propertyId: string, suAnYayinda: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("properties")
    .update({ is_published: !suAnYayinda, updated_at: new Date().toISOString() })
    .eq("id", propertyId);

  if (error) {
    return { ok: false, message: error.message };
  }
  revalidatePath("/admin/ilanlar");
  return { ok: true };
}

export async function ilanSil(propertyId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("properties").delete().eq("id", propertyId);

  if (error) {
    return { ok: false, message: error.message };
  }
  revalidatePath("/admin/ilanlar");
  return { ok: true };
}
