-- 003'teki sütunlar yoksa ekle (sıra atlanmışsa diye)
alter table public.properties
  add column if not exists listing_number text,
  add column if not exists heating_type text,
  add column if not exists floor int,
  add column if not exists total_floors int,
  add column if not exists building_age text,
  add column if not exists deed_status text,
  add column if not exists bathroom_count int,
  add column if not exists has_balcony boolean default false,
  add column if not exists has_parking boolean default false,
  add column if not exists has_storage boolean default false,
  add column if not exists furnished text,
  add column if not exists swap boolean default false,
  add column if not exists front text,
  add column if not exists video_url text,
  add column if not exists contact_phone_override text,
  add column if not exists contact_email_override text;

-- Görseldeki ek detay alanları
alter table public.properties
  add column if not exists net_sqm decimal(10,2),
  add column if not exists open_area_sqm decimal(10,2),
  add column if not exists kitchen_type text,
  add column if not exists usage_status text,
  add column if not exists in_complex boolean default false,
  add column if not exists complex_name text,
  add column if not exists monthly_fee decimal(12,2),
  add column if not exists loan_eligible boolean default true,
  add column if not exists listed_by text;

comment on column public.properties.net_sqm is 'Net m²';
comment on column public.properties.open_area_sqm is 'Açık alan m² (balkon, bahçe vb.)';
comment on column public.properties.kitchen_type is 'Mutfak: acik, kapali';
comment on column public.properties.usage_status is 'Kullanım: bos, dolu';
comment on column public.properties.in_complex is 'Site içerisinde';
comment on column public.properties.complex_name is 'Site adı';
comment on column public.properties.monthly_fee is 'Aidat (TL)';
comment on column public.properties.loan_eligible is 'Krediye uygun';
comment on column public.properties.listed_by is 'Kimden: sahibinden, emlak_ofisi';
