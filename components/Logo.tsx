"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Logo() {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className="flex items-center gap-3 transition opacity-90 hover:opacity-100">
      {!imgError ? (
        <Image
          src="/logo.png"
          alt="EU GAYRİMENKUL"
          width={140}
          height={48}
          className="h-12 w-auto object-contain"
          priority
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-xl font-bold tracking-tight">
          <span className="text-[var(--eu-white)]">EU </span>
          <span className="text-[var(--eu-gold)]">GAYRİMENKUL</span>
        </span>
      )}
    </Link>
  );
}
