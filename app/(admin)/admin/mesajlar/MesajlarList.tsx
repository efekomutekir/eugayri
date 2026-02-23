"use client";

import { useState } from "react";
import { mesajSil } from "./actions";

type Mesaj = {
  id: string;
  phone: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export function MesajlarList({ messages }: { messages: Mesaj[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    setDeletingId(id);
    const res = await mesajSil(id);
    setDeletingId(null);
    if (!res.ok) alert(res.message);
    if (expandedId === id) setExpandedId(null);
  }

  if (!messages?.length) {
    return (
      <div className="px-4 py-12 text-center text-zinc-500">
        Henüz mesaj yok.
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100">
      {messages.map((m) => {
        const isExpanded = expandedId === m.id;
        const preview = m.message.length > 80 ? m.message.slice(0, 80) + "…" : m.message;
        return (
          <div
            key={m.id}
            className={`transition-colors ${isExpanded ? "bg-zinc-50" : "hover:bg-zinc-50/70"} ${!m.read ? "bg-amber-50/50" : ""}`}
          >
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : m.id)}
              className="flex w-full flex-wrap items-center gap-3 p-5 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <a
                    href={`tel:${m.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-zinc-800 hover:text-emerald-600"
                  >
                    {m.phone}
                  </a>
                  <span className="text-zinc-300">·</span>
                  <a
                    href={`mailto:${m.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-zinc-600 hover:text-emerald-600"
                  >
                    {m.email}
                  </a>
                </div>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
                  {preview}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {new Date(m.created_at).toLocaleString("tr-TR")}
                </p>
              </div>
              {!m.read && (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Yeni
                </span>
              )}
              <span className="text-zinc-400">
                {isExpanded ? "▲" : "▼"}
              </span>
            </button>
            {isExpanded && (
              <div className="border-t border-zinc-100 bg-white px-5 pb-5 pt-2">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                  {m.message}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, m.id)}
                    disabled={!!deletingId}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === m.id ? "Siliniyor…" : "Mesajı sil"}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
