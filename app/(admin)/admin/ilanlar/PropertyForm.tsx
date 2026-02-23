"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Property } from "@/lib/types/database";
import ilIlceData from "@/data/il-ilce.json";

const ilList = Object.keys(ilIlceData as Record<string, string[]>).sort();
function getIlceler(il: string): string[] {
  return il ? (ilIlceData as Record<string, string[]>)[il] ?? [] : [];
}

const HEATING_OPTIONS = [
  { value: "", label: "Seçin" },
  { value: "kombi", label: "Kombi" },
  { value: "soba", label: "Soba" },
  { value: "merkezi", label: "Merkezi" },
  { value: "klima", label: "Klima" },
  { value: "yok", label: "Yok" },
];
const FURNISHED_OPTIONS = [
  { value: "", label: "Seçin" },
  { value: "esyali", label: "Eşyalı" },
  { value: "esyasiz", label: "Eşyasız" },
  { value: "yari_esyali", label: "Yarı eşyalı" },
];
const FRONT_OPTIONS = [
  { value: "", label: "Seçin" },
  { value: "kuzey", label: "Kuzey" },
  { value: "guney", label: "Güney" },
  { value: "dogu", label: "Doğu" },
  { value: "bati", label: "Batı" },
  { value: "kuzey_bati", label: "Kuzey Batı" },
  { value: "kuzey_dogu", label: "Kuzey Doğu" },
  { value: "guney_bati", label: "Güney Batı" },
  { value: "guney_dogu", label: "Güney Doğu" },
];
const BUILDING_AGE_OPTIONS = [
  { value: "", label: "Seçin" },
  { value: "sifir", label: "Sıfır bina" },
  { value: "1-5", label: "1-5 yıllık" },
  { value: "5-10", label: "5-10 yıllık" },
  { value: "10-20", label: "10-20 yıllık" },
  { value: "21-25", label: "21-25 arası" },
  { value: "10+", label: "10+ yıllık" },
];
const KITCHEN_OPTIONS = [
  { value: "", label: "Seçin" },
  { value: "acik", label: "Açık" },
  { value: "kapali", label: "Kapalı" },
];
const USAGE_OPTIONS = [
  { value: "", label: "Seçin" },
  { value: "bos", label: "Boş" },
  { value: "dolu", label: "Dolu" },
];
const LISTED_BY_OPTIONS = [
  { value: "", label: "Seçin" },
  { value: "sahibinden", label: "Sahibinden" },
  { value: "emlak_ofisi", label: "Emlak Ofisinden" },
];

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <h3 className="mb-4 border-b border-zinc-200 pb-2 text-base font-semibold text-zinc-800">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function PropertyForm({
  categories,
  property,
  initialImages = [],
  userId,
}: {
  categories: { id: string; name: string; slug: string }[];
  property?: Property;
  initialImages?: { id: string; url: string; sort_order: number }[];
  userId?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(property?.title ?? "");
  const [listingNumber, setListingNumber] = useState(property?.listing_number ?? "");
  const [description, setDescription] = useState(property?.description ?? "");
  const [price, setPrice] = useState(property?.price?.toString() ?? "");
  const [propertyType, setPropertyType] = useState<"sale" | "rent">(property?.property_type ?? "sale");
  const [categoryId, setCategoryId] = useState(property?.category_id ?? "");
  const [roomCount, setRoomCount] = useState(property?.room_count?.toString() ?? "");
  const [areaSqm, setAreaSqm] = useState(property?.area_sqm?.toString() ?? "");
  const [bathroomCount, setBathroomCount] = useState(property?.bathroom_count?.toString() ?? "");
  const [floor, setFloor] = useState(property?.floor?.toString() ?? "");
  const [totalFloors, setTotalFloors] = useState(property?.total_floors?.toString() ?? "");
  const [heatingType, setHeatingType] = useState(property?.heating_type ?? "");
  const [buildingAge, setBuildingAge] = useState(property?.building_age ?? "");
  const [deedStatus, setDeedStatus] = useState(property?.deed_status ?? "");
  const [furnished, setFurnished] = useState(property?.furnished ?? "");
  const [front, setFront] = useState(property?.front ?? "");
  const [hasBalcony, setHasBalcony] = useState(property?.has_balcony ?? false);
  const [hasParking, setHasParking] = useState(property?.has_parking ?? false);
  const [hasStorage, setHasStorage] = useState(property?.has_storage ?? false);
  const [swap, setSwap] = useState(property?.swap ?? false);
  const [address, setAddress] = useState(property?.address ?? "");
  const [city, setCity] = useState(property?.city ?? "");
  const [district, setDistrict] = useState(property?.district ?? "");
  const [videoUrl, setVideoUrl] = useState(property?.video_url ?? "");
  const [contactPhoneOverride, setContactPhoneOverride] = useState(property?.contact_phone_override ?? "");
  const [contactEmailOverride, setContactEmailOverride] = useState(property?.contact_email_override ?? "");
  const [isPublished, setIsPublished] = useState(property?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(property?.is_featured ?? false);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialImages.length ? initialImages.sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url) : []
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const [netSqm, setNetSqm] = useState(property?.net_sqm?.toString() ?? "");
  const [openAreaSqm, setOpenAreaSqm] = useState(property?.open_area_sqm?.toString() ?? "");
  const [kitchenType, setKitchenType] = useState(property?.kitchen_type ?? "");
  const [usageStatus, setUsageStatus] = useState(property?.usage_status ?? "");
  const [inComplex, setInComplex] = useState(property?.in_complex ?? false);
  const [complexName, setComplexName] = useState(property?.complex_name ?? "");
  const [monthlyFee, setMonthlyFee] = useState(property?.monthly_fee?.toString() ?? "");
  const [loanEligible, setLoanEligible] = useState(property?.loan_eligible ?? true);
  const [listedBy, setListedBy] = useState(property?.listed_by ?? "");

  const fullPayload = {
    title,
    description: description || null,
    price: Number(price),
    property_type: propertyType,
    category_id: categoryId || null,
    room_count: roomCount?.trim() || null,
    area_sqm: areaSqm ? Number(areaSqm) : null,
    bathroom_count: bathroomCount ? Number(bathroomCount) : null,
    floor: floor ? Number(floor) : null,
    total_floors: totalFloors ? Number(totalFloors) : null,
    heating_type: heatingType || null,
    building_age: buildingAge || null,
    deed_status: deedStatus || null,
    furnished: furnished || null,
    front: front || null,
    has_balcony: hasBalcony,
    has_parking: hasParking,
    has_storage: hasStorage,
    swap,
    address: address || null,
    city: city || null,
    district: district || null,
    listing_number: listingNumber || null,
    video_url: videoUrl || null,
    contact_phone_override: contactPhoneOverride || null,
    contact_email_override: contactEmailOverride || null,
    net_sqm: netSqm ? Number(netSqm) : null,
    open_area_sqm: openAreaSqm ? Number(openAreaSqm) : null,
    kitchen_type: kitchenType || null,
    usage_status: usageStatus || null,
    in_complex: inComplex,
    complex_name: complexName || null,
    monthly_fee: monthlyFee ? Number(monthlyFee) : null,
    loan_eligible: loanEligible,
    listed_by: listedBy || null,
    is_published: isPublished,
    is_featured: isFeatured,
    updated_at: new Date().toISOString(),
  };

  // Sadece 001 migration'daki sütunlar (003/004 çalışmamışsa 500 önlenir)
  const insertPayload = {
    title: title.trim(),
    description: description?.trim() || null,
    price: Number(price) || 0,
    currency: "TRY" as const,
    property_type: propertyType,
    category_id: categoryId?.trim() || null,
    room_count: roomCount?.trim() || null,
    area_sqm: areaSqm ? Number(areaSqm) : null,
    address: address?.trim() || null,
    city: city?.trim() || null,
    district: district?.trim() || null,
    is_published: !!isPublished,
    is_featured: !!isFeatured,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (property?.id) {
        const { error: updateErr } = await supabase.from("properties").update(fullPayload).eq("id", property.id);
        if (updateErr) throw updateErr;
        const urls = imageUrls.filter(Boolean);
        await supabase.from("property_images").delete().eq("property_id", property.id);
        for (let i = 0; i < urls.length; i++) {
          await supabase.from("property_images").insert({ property_id: property.id, url: urls[i], sort_order: i });
        }
        router.push("/admin/ilanlar");
      } else if (userId) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        const urls = imageUrls.filter(Boolean);
        const res = await fetch("/api/properties", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            ...insertPayload,
            ...fullPayload,
            image_urls: urls,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error ?? `İlan oluşturulamadı (${res.status})`);
        router.push("/admin/ilanlar");
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  function addImageRow() {
    setImageUrls((prev) => [...prev, ""]);
  }
  function setImageUrl(i: number, url: string) {
    setImageUrls((prev) => {
      const next = [...prev];
      next[i] = url;
      return next;
    });
  }
  function removeImageRow(i: number) {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  function toPublicImageUrl(url: string): string {
    if (!url) return url;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
    if (url.includes("/storage/v1/object/") && !url.includes("/object/public/")) {
      return url.replace("/storage/v1/object/", "/storage/v1/object/public/");
    }
    return url;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadingImage(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.set("file", file);
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }
        const res = await fetch("/api/upload-property-image", {
          method: "POST",
          body: formData,
          credentials: "include",
          headers,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error ?? `Görsel yüklenemedi (${res.status})`);
          return;
        }
        if (data?.url) newUrls.push(data.url);
      }
      setImageUrls((prev) => [...prev.filter(Boolean), ...newUrls]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <FormSection title="Temel bilgiler">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">İlan başlığı *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-3 py-2"
              placeholder="Örn: Deniz manzaralı 3+1 daire"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">İlan numarası</span>
            <input
              value={listingNumber}
              onChange={(e) => setListingNumber(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              placeholder="Örn: IL-2024-001"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">Açıklama</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="rounded-lg border border-zinc-300 px-3 py-2"
            placeholder="İlan detaylı açıklaması..."
          />
        </label>
      </FormSection>

      <FormSection title="Fiyat ve tip">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Fiyat (₺) *</span>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">İlan tipi *</span>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as "sale" | "rent")}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="sale">Satılık</option>
              <option value="rent">Kiralık</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Kategori</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="">Seçin</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
      </FormSection>

      <FormSection title="Konum">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">İl</span>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setDistrict("");
              }}
              className="rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="">Seçin</option>
              {ilList.map((il) => (
                <option key={il} value={il}>
                  {il}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">İlçe</span>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2"
              disabled={!city}
            >
              <option value="">Seçin</option>
              {getIlceler(city).map((ilce) => (
                <option key={ilce} value={ilce}>
                  {ilce}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Adres</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="Sokak, mahalle, bina no vb. tam adres" />
          </label>
        </div>
      </FormSection>

      <FormSection title="Özellikler (oda, m², bina)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Oda sayısı</span>
            <input type="text" value={roomCount} onChange={(e) => setRoomCount(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="Örn: 2+1, 3+1, 4+2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Brüt m²</span>
            <input type="number" step="0.01" min="0" value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Net m²</span>
            <input type="number" step="0.01" min="0" value={netSqm} onChange={(e) => setNetSqm(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Açık alan m²</span>
            <input type="number" step="0.01" min="0" value={openAreaSqm} onChange={(e) => setOpenAreaSqm(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="Balkon, bahçe vb." />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Banyo sayısı</span>
            <input type="number" min="0" value={bathroomCount} onChange={(e) => setBathroomCount(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Bulunduğu kat</span>
            <input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="0 zemin" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Toplam kat</span>
            <input type="number" min="1" value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Bina yaşı</span>
            <select value={buildingAge} onChange={(e) => setBuildingAge(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2">
              {BUILDING_AGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Isıtma</span>
            <select value={heatingType} onChange={(e) => setHeatingType(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2">
              {HEATING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Mutfak</span>
            <select value={kitchenType} onChange={(e) => setKitchenType(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2">
              {KITCHEN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Kullanım durumu</span>
            <select value={usageStatus} onChange={(e) => setUsageStatus(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2">
              {USAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Eşya durumu</span>
            <select value={furnished} onChange={(e) => setFurnished(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2">
              {FURNISHED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Cephe</span>
            <select value={front} onChange={(e) => setFront(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2">
              {FRONT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Tapu durumu</span>
            <input value={deedStatus} onChange={(e) => setDeedStatus(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="Tapuya geçer, kat irtifakı..." />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={hasBalcony} onChange={(e) => setHasBalcony(e.target.checked)} />
            <span className="text-sm text-zinc-700">Balkon</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={hasParking} onChange={(e) => setHasParking(e.target.checked)} />
            <span className="text-sm text-zinc-700">Otopark</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={hasStorage} onChange={(e) => setHasStorage(e.target.checked)} />
            <span className="text-sm text-zinc-700">Depo</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={swap} onChange={(e) => setSwap(e.target.checked)} />
            <span className="text-sm text-zinc-700">Takas kabul</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={inComplex} onChange={(e) => setInComplex(e.target.checked)} />
            <span className="text-sm text-zinc-700">Site içerisinde</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={loanEligible} onChange={(e) => setLoanEligible(e.target.checked)} />
            <span className="text-sm text-zinc-700">Krediye uygun</span>
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Site adı</span>
            <input value={complexName} onChange={(e) => setComplexName(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="Belirtilmemiş" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Aidat (₺)</span>
            <input type="number" step="0.01" min="0" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="Belirtilmemiş" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Kimden</span>
            <select value={listedBy} onChange={(e) => setListedBy(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2">
              {LISTED_BY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
      </FormSection>

      <FormSection title="Medya (görseller ve video)">
        <div className="mb-4 flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
            {uploadingImage ? "Yükleniyor..." : "Birden fazla görsel yükle"}
            <input type="file" accept="image/*" multiple className="hidden" disabled={uploadingImage} onChange={handleImageUpload} />
          </label>
          <button type="button" onClick={addImageRow} className="rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100">
            + URL ekle
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {url ? (
                <div className="relative h-20 w-20">
                  <img src={toPublicImageUrl(url)} alt="" className="h-20 w-20 rounded-lg border border-zinc-200 object-cover bg-zinc-100" crossOrigin="anonymous" />
                  <button type="button" onClick={() => removeImageRow(i)} className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm text-white shadow hover:bg-red-600" title="Kaldır" aria-label="Kaldır">×</button>
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400">URL</div>
              )}
              {url ? (
                <input type="url" value={url} onChange={(e) => setImageUrl(i, e.target.value)} placeholder="https://..." className="w-28 truncate rounded border border-zinc-200 px-1 py-0.5 text-xs" title={url} />
              ) : (
                <input type="url" value="" onChange={(e) => setImageUrl(i, e.target.value)} placeholder="https://..." className="w-28 rounded border border-zinc-300 px-2 py-1 text-xs" />
              )}
            </div>
          ))}
        </div>
        <label className="mt-4 flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-700">Video URL (YouTube vb.)</span>
          <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" placeholder="https://..." />
        </label>
      </FormSection>

      <FormSection title="Bu ilan için iletişim (opsiyonel)">
        <p className="text-sm text-zinc-500">Boş bırakırsanız sitedeki genel iletişim bilgileri kullanılır.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">Telefon</span>
            <input type="tel" value={contactPhoneOverride} onChange={(e) => setContactPhoneOverride(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-700">E-posta</span>
            <input type="email" value={contactEmailOverride} onChange={(e) => setContactEmailOverride(e.target.value)} className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
        </div>
      </FormSection>

      <FormSection title="Yayın">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            <span className="text-sm font-medium text-zinc-700">Yayında (sitede görünsün)</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <span className="text-sm font-medium text-zinc-700">Öne çıkan ilan</span>
          </label>
        </div>
      </FormSection>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-800 px-6 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {loading ? "Kaydediliyor..." : property ? "Güncelle" : "İlanı oluştur"}
        </button>
        {property && <DeleteIlanButton propertyId={property.id} />}
      </div>
    </form>
  );
}

export { PropertyForm };
export default PropertyForm;

function DeleteIlanButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    await supabase.from("property_images").delete().eq("property_id", propertyId);
    await supabase.from("properties").delete().eq("id", propertyId);
    router.push("/admin/ilanlar");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
    >
      {loading ? "Siliniyor..." : "İlanı sil"}
    </button>
  );
}
