# EU GAYRİMENKÜL (Supabase + Next.js)

Next.js (App Router) ile Supabase bağlantılı, EU GAYRİMENKÜL markasına özel tek firma emlak ilan sitesi. Siyah, altın ve beyaz sabit tasarım.

## Gereksinimler

- Node.js 18+
- Supabase hesabı

## Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Supabase projesi oluşturun ve **Project URL** ile **anon public key** alın.

3. Proje kökünde `.env.local` oluşturun:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

4. Supabase Dashboard → SQL Editor bölümünde sırayla şu dosyaları çalıştırın:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_storage_buckets.sql`

5. Auth → Users üzerinden ilk kullanıcıyı (e-posta/şifre) ekleyin. SQL Editor'de bu kullanıcıyı admin yapın:
   ```sql
   update public.profiles set role = 'admin' where email = 'sizin@email.com';
   ```

6. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

- Site: http://localhost:3000  
- Kontrol paneli: http://localhost:3000/admin (giriş gerekir)

## Özellikler

- **Public:** Ana sayfa (hero, istatistik, öne çıkan ilanlar, Neden Biz, CTA), ilan listesi (filtre/sayfalama), ilan detay. EU GAYRİMENKÜL sabit marka tasarımı (siyah, altın, beyaz).
- **Kontrol paneli:** Giriş (e-posta/şifre), dashboard, ilan CRUD, iletişim bilgileri (telefon/e-posta).
- **Storage:** İlan görselleri Supabase Storage’a yüklenir.
- **Logo:** `public/logo.png` dosyasına firma logosunu (EU GAYRİMENKÜL) ekleyin; yoksa header’da metin logosu gösterilir.

## Proje yapısı

- `app/(public)/` — Ana sayfa, ilanlar, ilan detay
- `app/(admin)/` — Giriş, dashboard, ilanlar, iletişim
- `components/` — Header, Footer, Logo (EU GAYRİMENKÜL marka tasarımı)
- `lib/supabase/` — Supabase client (browser, server, middleware)
- `lib/site-settings.ts` — İletişim bilgileri okuma
- `supabase/migrations/` — SQL migration dosyaları
