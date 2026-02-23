import { getSiteSettings } from "@/lib/site-settings";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <div className="min-h-screen bg-[var(--eu-black)] text-[var(--eu-white)]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer
        contactPhone={settings.contact_phone}
        contactEmail={settings.contact_email}
        contactAddress={settings.contact_address}
        contactWhatsapp={settings.contact_whatsapp}
      />
    </div>
  );
}
