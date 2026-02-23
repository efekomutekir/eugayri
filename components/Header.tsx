import Link from "next/link";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--eu-black)] backdrop-blur-sm">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--eu-white)]/90 transition hover:text-[var(--eu-gold)]"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/ilanlar"
            className="text-sm font-medium text-[var(--eu-white)]/90 transition hover:text-[var(--eu-gold)]"
          >
            İlanlar
          </Link>
          <Link
            href="/iletisim"
            className="eu-btn-primary rounded-xl border border-[var(--eu-gold)] px-5 py-2.5 text-sm font-medium text-[var(--eu-gold)] transition hover:bg-[var(--eu-gold)] hover:text-[var(--eu-black)]"
          >
            İletişim
          </Link>
        </nav>
      </div>
    </header>
  );
}
