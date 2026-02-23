"use client";

import Image from "next/image";
import { useState } from "react";

function toPublicImageUrl(url: string): string {
  if (!url) return url;
  if (url.includes("/storage/v1/object/") && !url.includes("/object/public/")) {
    return url.replace("/storage/v1/object/", "/storage/v1/object/public/");
  }
  return url;
}

export function PropertyImageGallery({
  images,
  title,
}: {
  images: { url: string; sort_order: number }[];
  title: string;
}) {
  const [selected, setSelected] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-white/5 text-[var(--eu-muted)]">
        Görsel yok
      </div>
    );
  }
  const current = images[selected]!;
  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5">
        <Image
          src={toPublicImageUrl(current.url)}
          alt={`${title} - ${selected + 1}. görsel`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setSelected((s) => (s === 0 ? images.length - 1 : s - 1))}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="Önceki görsel"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setSelected((s) => (s === images.length - 1 ? 0 : s + 1))}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="Sonraki görsel"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {selected + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition ${
                i === selected ? "ring-2 ring-[var(--eu-gold)]" : "opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={toPublicImageUrl(img.url)}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
