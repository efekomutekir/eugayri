import { getSiteSettings } from "@/lib/site-settings";
import { IletisimMesajForm } from "./IletisimMesajForm";

export default async function IletisimPage() {
  const settings = await getSiteSettings();
  const hasPhone = !!settings.contact_phone;
  const hasEmail = !!settings.contact_email;
  const hasAddress = !!settings.contact_address;
  const hasWhatsapp = !!settings.contact_whatsapp;
  const hasAny = hasPhone || hasEmail || hasAddress || hasWhatsapp;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--eu-white)] md:text-4xl">
        İletişim
      </h1>
      <p className="mt-3 text-[var(--eu-muted-light)]">
        Sorularınız veya görüşmek istediğiniz ilanlar için bize ulaşın.
      </p>

      {/* Üst: Mail, telefon, temel bilgiler — düzenli kart listesi */}
      <section className="mt-12 rounded-2xl border border-white/10 bg-[var(--eu-black-card)] shadow-lg overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--eu-muted)]">
            İletişim bilgileri
          </h2>
        </div>
        {hasAny ? (
          <ul className="divide-y divide-white/10">
            {hasPhone && (
              <li className="flex items-center gap-4 px-6 py-4">
                <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--eu-muted)]">
                  Telefon
                </span>
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="font-medium text-[var(--eu-gold)] transition hover:underline"
                >
                  {settings.contact_phone}
                </a>
              </li>
            )}
            {hasEmail && (
              <li className="flex items-center gap-4 px-6 py-4">
                <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--eu-muted)]">
                  E-posta
                </span>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="font-medium text-[var(--eu-gold)] transition hover:underline"
                >
                  {settings.contact_email}
                </a>
              </li>
            )}
            {hasWhatsapp && (
              <li className="flex items-center gap-4 px-6 py-4">
                <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--eu-muted)]">
                  WhatsApp
                </span>
                <a
                  href={`https://wa.me/90${settings.contact_whatsapp!.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--eu-gold)]/40 bg-[var(--eu-gold)]/5 px-3 py-2 font-medium text-[var(--eu-gold)] transition hover:bg-[var(--eu-gold-muted)]"
                >
                  {settings.contact_whatsapp} — WhatsApp ile yaz
                </a>
              </li>
            )}
            {hasAddress && (
              <li className="flex gap-4 px-6 py-4">
                <span className="w-24 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--eu-muted)]">
                  Adres
                </span>
                <p className="min-w-0 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--eu-white)]">
                  {settings.contact_address}
                </p>
              </li>
            )}
          </ul>
        ) : (
          <p className="px-6 py-6 text-sm text-[var(--eu-muted)]">
            İletişim bilgileri henüz eklenmemiş. Aşağıdaki form ile mesaj gönderebilirsiniz.
          </p>
        )}
      </section>

      {/* Alt: Mesaj gönderme alanı */}
      <section className="mt-14 rounded-2xl border border-white/10 bg-[var(--eu-black-card)] p-8 shadow-lg">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--eu-muted)]">
          Mesaj gönderin
        </h2>
        <p className="mt-2 text-sm text-[var(--eu-muted-light)]">
          Telefon ve e-posta adresinizi girin, mesajınızı yazın. Size en kısa sürede dönüş yapacağız.
        </p>
        <div className="mt-8">
          <IletisimMesajForm />
        </div>
      </section>
    </div>
  );
}
