import Link from "next/link";

export function Footer({
  contactPhone,
  contactEmail,
  contactAddress,
  contactWhatsapp,
}: {
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress?: string | null;
  contactWhatsapp?: string | null;
}) {
  const hasContact = contactPhone || contactEmail || contactAddress || contactWhatsapp;
  return (
    <footer className="mt-auto border-t border-white/10 bg-[var(--eu-black-soft)] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-[var(--eu-gold)]">EU GAYRİMENKUL</p>
            <p className="mt-2 text-sm text-[var(--eu-muted)]">
              Güvenilir ve profesyonel gayrimenkul danışmanlığı.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--eu-white)]">Hızlı Bağlantılar</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--eu-muted)]">
              <li><Link href="/" className="transition hover:text-[var(--eu-gold)]">Ana Sayfa</Link></li>
              <li><Link href="/ilanlar" className="transition hover:text-[var(--eu-gold)]">İlanlar</Link></li>
              <li><Link href="/iletisim" className="transition hover:text-[var(--eu-gold)]">İletişim</Link></li>
            </ul>
          </div>
          <div id="iletisim">
            <p className="text-sm font-medium text-[var(--eu-white)]">İletişim</p>
            <div className="mt-3 space-y-2 text-sm text-[var(--eu-muted)]">
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="block transition hover:text-[var(--eu-gold)]">
                  {contactPhone}
                </a>
              )}
              {contactWhatsapp && (
                <a href={`https://wa.me/90${contactWhatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="block transition hover:text-[var(--eu-gold)]">
                  WhatsApp: {contactWhatsapp}
                </a>
              )}
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="block transition hover:text-[var(--eu-gold)]">
                  {contactEmail}
                </a>
              )}
              {contactAddress && (
                <p className="whitespace-pre-wrap">{contactAddress}</p>
              )}
              {!hasContact && (
                <span>İletişim bilgileri panelden güncellenebilir.</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-[var(--eu-muted)]">
          © {new Date().getFullYear()} EU GAYRİMENKUL. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
