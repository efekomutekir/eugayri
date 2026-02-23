"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { iletisimKaydet } from "./actions";

export function IletisimForm({
  contactPhone,
  contactEmail,
  contactAddress,
  contactWhatsapp,
}: {
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  contactWhatsapp: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState(contactPhone);
  const [email, setEmail] = useState(contactEmail);
  const [address, setAddress] = useState(contactAddress);
  const [whatsapp, setWhatsapp] = useState(contactWhatsapp);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await iletisimKaydet({
        contact_phone: phone.trim() || null,
        contact_email: email.trim() || null,
        contact_address: address.trim() || null,
        contact_whatsapp: whatsapp.trim() || null,
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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700">Telefon</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2"
          placeholder="0xxx xxx xx xx"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700">WhatsApp (telefon numarası)</span>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2"
          placeholder="0xxx xxx xx xx"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700">E-posta</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-zinc-700">Adres</span>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="rounded-lg border border-zinc-300 px-3 py-2"
          placeholder="Ofis / şube adresi"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-800 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
      >
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}
