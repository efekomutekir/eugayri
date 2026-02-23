/**
 * Turkiye API'den il/ilçe verisini çeker ve data/il-ilce.json olarak yazar.
 * Çalıştırmak: node scripts/fetch-il-ilce.mjs
 */
const res = await fetch("https://api.turkiyeapi.dev/v1/provinces?limit=81");
const json = await res.json();
if (json.status !== "OK" || !Array.isArray(json.data)) {
  throw new Error("API yanıtı beklenen formatta değil");
}
const ilIlce = {};
for (const il of json.data) {
  ilIlce[il.name] = (il.districts || []).map((d) => d.name);
}
const fs = await import("fs");
const path = await import("path");
const outDir = path.join(process.cwd(), "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "il-ilce.json"),
  JSON.stringify(ilIlce, null, 2),
  "utf8"
);
console.log("data/il-ilce.json yazıldı, il sayısı:", Object.keys(ilIlce).length);
