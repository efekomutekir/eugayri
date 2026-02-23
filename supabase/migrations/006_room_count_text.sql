-- Oda sayısını metin yap: 2+1, 3+1 gibi girişlere izin ver
alter table public.properties
  alter column room_count type text using room_count::text;

comment on column public.properties.room_count is 'Oda sayısı (örn: 2+1, 3+1, 4)';
