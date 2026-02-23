import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

    if (authHeader) {
      userId = getUserIdFromToken(authHeader);
    }
    if (!userId) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }
    if (!userId) {
      return NextResponse.json(
        { error: "Oturum gerekli. Lütfen tekrar giriş yapın." },
        { status: 401 }
      );
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
    const role = profile?.role;
    if (role !== "admin" && role !== "editor") {
      return NextResponse.json(
        {
          error:
            "Yetki gerekli. Profilinizde admin veya editor rolü olmalı.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 5MB'dan küçük olmalı" }, { status: 400 });
    }
    const type = (file.type || "").toLowerCase();
    const allowed = type.startsWith("image/") || ALLOWED.includes(type);
    if (!allowed) {
      return NextResponse.json(
        { error: `İzin verilen türler: ${ALLOWED.join(", ")}` },
        { status: 400 }
      );
    }

    const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const safeExt = ["jpeg", "jpg", "png", "gif", "webp"].includes(ext) ? ext : "jpg";
    const path = `${crypto.randomUUID()}.${safeExt}`;
    const contentType = ALLOWED.includes(file.type) ? file.type : "image/jpeg";
    const buffer = await file.arrayBuffer();

    const { error } = await admin.storage
      .from("property-images")
      .upload(path, buffer, { contentType, upsert: true });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Yükleme başarısız" },
        { status: 500 }
      );
    }

    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") +
      "/storage/v1/object/public/property-images/" +
      path;
    return NextResponse.json({ url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
