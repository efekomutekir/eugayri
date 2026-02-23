"use client";

import dynamic from "next/dynamic";

const PropertyForm = dynamic(() => import("../PropertyForm"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
      Form yükleniyor...
    </div>
  ),
});

type Props = {
  categories: { id: string; name: string; slug: string }[];
  userId: string;
};

export function PropertyFormClient({ categories, userId }: Props) {
  return <PropertyForm categories={categories} userId={userId} />;
}
