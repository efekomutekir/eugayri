# Supabase kurulumu

1. [Supabase](https://supabase.com) projenizi oluşturun.
2. **Project URL** ve **anon public key** değerlerini alın (Settings → API).
3. Proje kökünde `.env.local` oluşturup şunları ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   ```
   **Service role key:** Supabase Dashboard → Settings → API → `service_role` (gizli; sadece sunucu tarafında, asla istemciye göndermeyin). İlan görseli yükleme bu anahtarla Storage’a yazıldığı için 500 hatasını önler.
4. Supabase Dashboard → **SQL Editor** bölümüne gidin.
5. Sırayla şu dosyaların içeriğini kopyalayıp çalıştırın:
   - `migrations/001_initial_schema.sql`
   - `migrations/002_storage_buckets.sql`
   - `migrations/003_site_content_and_property_details.sql`
   - `migrations/004_property_details_extended.sql`
6. İlk admin kullanıcıyı Auth → Users üzerinden e-posta/şifre ile ekleyin. Ardından SQL Editor'de:
   ```sql
   update public.profiles set role = 'admin' where id = 'BURAYA_USER_UUID_YAPIŞTIRIN';
   ```

**İlan görseli yükleme 500 hatası veriyorsa:**  
- `002_storage_buckets.sql` mutlaka çalıştırılmış olmalı (Storage → property-images bucket’ı görünür).  
- Giriş yapan kullanıcının `public.profiles` tablosunda kaydı ve `role` değeri `admin` veya `editor` olmalı.  
- Formda artık hata detayı gösteriliyor; mesajı okuyup Supabase Dashboard (Storage, RLS) ile karşılaştırın.
