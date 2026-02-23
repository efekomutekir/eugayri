import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white text-zinc-900">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/admin/dashboard"
            className="text-lg font-semibold text-zinc-800"
          >
            Kontrol Paneli
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/ilanlar"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              İlanlar
            </Link>
            <Link
              href="/admin/ilanlar/yeni"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              İlan Ekle
            </Link>
            <Link
              href="/admin/mesajlar"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Mesajlar
            </Link>
            <Link
              href="/admin/iletisim"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              İletişim
            </Link>
            <Link
              href="/admin/metinler"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Site Metinleri
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              Siteyi Görüntüle
            </Link>
            <form action="/admin/logout" method="post">
              <button
                type="submit"
                className="text-sm text-red-600 hover:text-red-700"
              >
                Çıkış
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 text-zinc-900">{children}</main>
    </div>
  );
}
