-- site_settings: iletişim ve site metinleri
alter table public.site_settings
  add column if not exists contact_address text,
  add column if not exists contact_whatsapp text;

alter table public.site_settings
  add column if not exists hero_title text,
  add column if not exists hero_subtitle text,
  add column if not exists hero_cta_primary text,
  add column if not exists hero_cta_secondary text,
  add column if not exists cta_title text,
  add column if not exists cta_button text,
  add column if not exists neden_biz_title text,
  add column if not exists neden_biz_1_title text,
  add column if not exists neden_biz_1_text text,
  add column if not exists neden_biz_2_title text,
  add column if not exists neden_biz_2_text text,
  add column if not exists neden_biz_3_title text,
  add column if not exists neden_biz_3_text text,
  add column if not exists stats_1_label text,
  add column if not exists stats_2_label text,
  add column if not exists stats_3_label text;

update public.site_settings set
  hero_title = 'Hayalinizdeki mülkü güvenle bulun',
  hero_subtitle = 'Satılık ve kiralık konut, iş yeri ve arsa ilanları. Profesyonel danışmanlık ve şeffaf süreç.',
  hero_cta_primary = 'İlanları İncele',
  hero_cta_secondary = 'İletişime Geçin',
  cta_title = 'Aradığınız mülkü bulamadınız mı?',
  cta_button = 'İletişime Geçin',
  neden_biz_title = 'Neden EU GAYRİMENKÜL?',
  neden_biz_1_title = 'Güvenilir İlanlar',
  neden_biz_1_text = 'Tüm ilanlarımız kontrol edilmiş, güncel ve şeffaf bilgilerle sunulur.',
  neden_biz_2_title = 'Profesyonel Danışmanlık',
  neden_biz_2_text = 'Alım, satım ve kiralama süreçlerinde yanınızdayız.',
  neden_biz_3_title = 'Kişiye Özel Çözümler',
  neden_biz_3_text = 'İhtiyacınıza uygun mülkü birlikte belirliyoruz.',
  stats_1_label = 'Şeffaf Süreç',
  stats_2_label = 'Aktif İlan',
  stats_3_label = '7/24 Danışman Desteği'
where id = 1;

-- properties: detaylı emlak alanları
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

comment on column public.properties.listing_number is 'İlan numarası';
comment on column public.properties.heating_type is 'Isıtma: kombi, soba, merkezi, yok';
comment on column public.properties.furnished is 'Eşya: esyali, esyasiz, yari_esyali';
comment on column public.properties.front is 'Cephe: kuzey, guney, dogu, bati, kuzey_bati vb';
