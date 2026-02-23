import { createClient } from "@/lib/supabase/server";
import { IletisimForm } from "./IletisimForm";

export default async function AdminIletisimPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_phone, contact_email, contact_address, contact_whatsapp")
    .eq("id", 1)
    .single();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">İletişim Bilgileri</h1>
      <p className="mb-4 text-sm text-zinc-500">
        Bu bilgiler sitede footer ve ilan detay sayfalarında gösterilir. İlan bazında farklı telefon/e-posta tanımlayabilirsiniz.
      </p>
      <IletisimForm
        contactPhone={settings?.contact_phone ?? ""}
        contactEmail={settings?.contact_email ?? ""}
        contactAddress={settings?.contact_address ?? ""}
        contactWhatsapp={settings?.contact_whatsapp ?? ""}
      />
    </div>
  );
}
