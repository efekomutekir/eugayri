-- İlan görüntülenme sayacı (sadece panelde gösterilir)
alter table public.properties
  add column if not exists view_count integer not null default 0;

comment on column public.properties.view_count is 'İlan detay sayfası görüntülenme sayısı';
