-- Siteden gelen iletişim mesajları (panelde listelenir)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);

alter table public.contact_messages enable row level security;

-- Sadece admin/editor panelden okuyabilsin; insert server action ile admin client (service role) ile yapılır, RLS bypass
create policy "contact_messages_select_admin" on public.contact_messages for select to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);

comment on table public.contact_messages is 'İletişim sayfasından gelen mesajlar';
