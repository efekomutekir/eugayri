"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type Item = {
  id: string;
  title: string;
  price: number;
  property_type: string;
  area_sqm: number | null;
  room_count: number | null;
};

export function PropertySlider({
  items,
  imageByProperty,
}: {
  items: Item[];
  imageByProperty: Record<string, string>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi || items.length === 0) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(interval);
  }, [emblaApi, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-5 pb-2 md:gap-6">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/ilan/${p.id}`}
              className="group relative min-w-0 flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_42%] lg:flex-[0_0_36%]"
            >
              <article className="eu-card h-full overflow-hidden rounded-[var(--radius-card-lg)] border border-white/10 bg-[var(--eu-black-card)] transition-all duration-300 hover:border-[var(--eu-gold)]/40 hover:shadow-[var(--shadow-card-hover)]">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                  {imageByProperty[p.id] ? (
                    <Image
                      src={imageByProperty[p.id]}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 70vw, 42vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[var(--eu-muted)]">
                      Görsel yok
                    </div>
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute left-4 top-4 rounded-md bg-[var(--eu-gold)] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[var(--eu-black)]">
                    {p.property_type === "rent" ? "Kiralık" : "Satılık"}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="line-clamp-2 font-semibold leading-tight drop-shadow-sm">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 text-lg font-bold text-[var(--eu-gold)]">
                      {Number(p.price).toLocaleString("tr-TR")} ₺
                      {p.property_type === "rent" && "/ay"}
                    </p>
                    <div className="mt-2 flex gap-3 text-sm text-[var(--eu-muted-light)]">
                      {p.room_count != null && <span>{p.room_count} oda</span>}
                      {p.area_sqm != null && <span>{p.area_sqm} m²</span>}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[var(--eu-black-soft)]/90 text-white shadow-lg backdrop-blur-sm transition hover:border-[var(--eu-gold)]/50 hover:bg-[var(--eu-gold)]/10 hover:text-[var(--eu-gold)] md:-left-4 md:h-12 md:w-12"
            aria-label="Önceki"
          >
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[var(--eu-black-soft)]/90 text-white shadow-lg backdrop-blur-sm transition hover:border-[var(--eu-gold)]/50 hover:bg-[var(--eu-gold)]/10 hover:text-[var(--eu-gold)] md:-right-4 md:h-12 md:w-12"
            aria-label="Sonraki"
          >
            <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {items.slice(0, Math.min(items.length, 6)).map((_, i) => (
              <DotButton key={i} index={i} emblaApi={emblaApi} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DotButton({
  index,
  emblaApi,
}: {
  index: number;
  emblaApi: ReturnType<typeof useEmblaCarousel>[1];
}) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap() === index);
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap() === index);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, index]);

  return (
    <button
      type="button"
      onClick={() => emblaApi?.scrollTo(index)}
      className={`h-2 rounded-full transition-all duration-200 ${
        selected
          ? "w-6 bg-[var(--eu-gold)]"
          : "w-2 bg-white/30 hover:bg-white/50"
      }`}
      aria-label={`Slide ${index + 1}`}
    />
  );
}
