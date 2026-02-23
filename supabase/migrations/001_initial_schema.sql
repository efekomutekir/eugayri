-- profiles: Auth ile eşlenen kullanıcı profili (rol)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Yeni kullanıcı kaydında otomatik profil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    'editor'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- site_settings: tek satır tema/giydirme
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'Emlak',
  logo_url text,
  primary_color text not null default '#2563eb',
  background_color text not null default '#ffffff',
  header_background text not null default '#ffffff',
  footer_background text not null default '#f3f4f6',
  contact_phone text,
  contact_email text,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, site_name) values (1, 'Emlak')
on conflict (id) do nothing;

-- categories: ilan kategorileri
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

insert into public.categories (name, slug) values
  ('Konut', 'konut'),
  ('İş Yeri', 'is-yeri'),
  ('Arsa', 'arsa')
on conflict (slug) do nothing;

-- properties: ilanlar
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price decimal(12,2) not null,
  currency text not null default 'TRY',
  property_type text not null check (property_type in ('sale', 'rent')),
  category_id uuid references public.categories(id) on delete set null,
  room_count int,
  area_sqm decimal(10,2),
  address text,
  city text,
  district text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- property_images: ilan görselleri
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_property_images_property_id on public.property_images(property_id);
create index if not exists idx_properties_published on public.properties(is_published);
create index if not exists idx_properties_category on public.properties(category_id);
create index if not exists idx_properties_created_at on public.properties(created_at desc);

-- RLS
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;

-- profiles: kendi profilini oku, admin hepsini okuyabilsin
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_select_admin" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- site_settings: herkes okuyabilsin, sadece admin güncellesin
create policy "site_settings_select_all" on public.site_settings for select to anon, authenticated using (true);
create policy "site_settings_update_admin" on public.site_settings for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- categories: herkes okuyabilsin, sadece admin insert/update/delete
create policy "categories_select_all" on public.categories for select to anon, authenticated using (true);
create policy "categories_insert_admin" on public.categories for insert with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);
create policy "categories_update_admin" on public.categories for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);
create policy "categories_delete_admin" on public.categories for delete using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- properties: herkes yayındaki ilanları okusun; sadece yetkili yazsın
create policy "properties_select_published" on public.properties for select to anon, authenticated
  using (is_published = true);
create policy "properties_select_own_or_admin" on public.properties for select to authenticated
  using (
    created_by = auth.uid() or
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
  );
create policy "properties_insert_authenticated" on public.properties for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);
create policy "properties_update_authenticated" on public.properties for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);
create policy "properties_delete_authenticated" on public.properties for delete to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);

-- property_images: properties ile uyumlu
create policy "property_images_select_public" on public.property_images for select to anon, authenticated using (true);
create policy "property_images_insert_authenticated" on public.property_images for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);
create policy "property_images_update_authenticated" on public.property_images for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);
create policy "property_images_delete_authenticated" on public.property_images for delete to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);
