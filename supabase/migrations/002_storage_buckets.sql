-- Storage: property-images (ilan görselleri), logos (site logosu)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('property-images', 'property-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif']),
  ('logos', 'logos', true, 1048576, array['image/svg+xml','image/png','image/jpeg','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- property-images: authenticated admin/editor yükleyebilsin, herkes okuyabilsin
create policy "property_images_upload"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'property-images' and
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
  );
create policy "property_images_read"
  on storage.objects for select to anon, authenticated using (bucket_id = 'property-images');
create policy "property_images_delete"
  on storage.objects for delete to authenticated using (
    bucket_id = 'property-images' and
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
  );

-- logos: sadece admin yükleyebilsin
create policy "logos_upload"
  on storage.objects for insert to authenticated with check (
    bucket_id = 'logos' and
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "logos_read"
  on storage.objects for select to anon, authenticated using (bucket_id = 'logos');
create policy "logos_update_delete"
  on storage.objects for update to authenticated using (
    bucket_id = 'logos' and
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "logos_delete"
  on storage.objects for delete to authenticated using (
    bucket_id = 'logos' and
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
