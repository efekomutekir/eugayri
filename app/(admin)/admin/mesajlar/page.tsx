import { createAdminClient } from "@/lib/supabase/admin";
import { MesajlarList } from "./MesajlarList";

export default async function AdminMesajlarPage() {
  const supabase = createAdminClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, phone, email, message, read, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-800">Gelen Mesajlar</h1>
      <p className="mb-4 text-sm text-zinc-500">
        İletişim sayfasından gönderilen mesajlar. Bir mesaja tıklayarak detayını açıp silebilirsiniz.
      </p>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <MesajlarList messages={messages ?? []} />
      </div>
    </div>
  );
}
