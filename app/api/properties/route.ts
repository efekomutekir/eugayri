import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getUserIdFromToken(authHeader: string | null): string | null {
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );
    return decoded.sub ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader) userId = getUserIdFromToken(authHeader);
    if (!userId) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }
    if (!userId) {
      return NextResponse.json(
        { error: "Oturum gerekli." },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    if (profile?.role !== "admin" && profile?.role !== "editor") {
      return NextResponse.json({ error: "Yetki gerekli." }, { status: 403 });
    }

    const body = await request.json();

    // Sadece 001'deki sütunlar (42P17 hatasını önlemek için)
    const insertRow = {
      title: String(body.title ?? "").trim(),
      description: body.description ? String(body.description).trim() : null,
      price: Number(body.price) || 0,
      currency: "TRY",
      property_type: body.property_type === "rent" ? "rent" : "sale",
      category_id: body.category_id?.trim() || null,
      room_count: body.room_count != null ? Number(body.room_count) : null,
      area_sqm: body.area_sqm != null ? Number(body.area_sqm) : null,
      address: body.address?.trim() || null,
      city: body.city?.trim() || null,
      district: body.district?.trim() || null,
      is_featured: !!body.is_featured,
      is_published: !!body.is_published,
      created_by: userId,
    };

    const { data: newRow, error: insertErr } = await admin
      .from("properties")
      .insert(insertRow)
      .select("id")
      .single();

    if (insertErr) {
      return NextResponse.json(
        { error: insertErr.message || "İlan oluşturulamadı." },
        { status: 500 }
      );
    }
    if (!newRow?.id) {
      return NextResponse.json(
        { error: "İlan oluşturulamadı." },
        { status: 500 }
      );
    }

    // 003/004 sütunları varsa güncelle (yoksa hata yok sayılır)
    const extended: Record<string, unknown> = {
      listing_number: body.listing_number || null,
      heating_type: body.heating_type || null,
      floor: body.floor != null ? Number(body.floor) : null,
      total_floors: body.total_floors != null ? Number(body.total_floors) : null,
      building_age: body.building_age || null,
      deed_status: body.deed_status || null,
      bathroom_count: body.bathroom_count != null ? Number(body.bathroom_count) : null,
      has_balcony: !!body.has_balcony,
      has_parking: !!body.has_parking,
      has_storage: !!body.has_storage,
      furnished: body.furnished || null,
      swap: !!body.swap,
      front: body.front || null,
      video_url: body.video_url || null,
      contact_phone_override: body.contact_phone_override || null,
      contact_email_override: body.contact_email_override || null,
      net_sqm: body.net_sqm != null ? Number(body.net_sqm) : null,
      open_area_sqm: body.open_area_sqm != null ? Number(body.open_area_sqm) : null,
      kitchen_type: body.kitchen_type || null,
      usage_status: body.usage_status || null,
      in_complex: !!body.in_complex,
      complex_name: body.complex_name || null,
      monthly_fee: body.monthly_fee != null ? Number(body.monthly_fee) : null,
      loan_eligible: body.loan_eligible !== false,
      listed_by: body.listed_by || null,
      updated_at: new Date().toISOString(),
    };
    const { error: updateErr } = await admin
      .from("properties")
      .update(extended)
      .eq("id", newRow.id);
    if (updateErr) {
      // 003/004 çalışmamışsa sütun yoktur; ilan yine de oluştu
    }

    // Görsel URL'lerini sunucuda kaydet (RLS/403 hatasını önler)
    const imageUrls = Array.isArray(body.image_urls) ? body.image_urls.filter((u: unknown) => typeof u === "string" && u.trim()) : [];
    for (let i = 0; i < imageUrls.length; i++) {
      await admin.from("property_images").insert({
        property_id: newRow.id,
        url: imageUrls[i].trim(),
        sort_order: i,
      });
    }

    return NextResponse.json({ id: newRow.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
