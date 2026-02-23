"use client";

import { useState } from "react";
import { iletisimMesajiGonder } from "./actions";

export function IletisimMesajForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const result = await iletisimMesajiGonder({ phone, email, message });
      if (!result.ok) throw new Error(result.message);
      setSuccess(true);
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Mesaj gönderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-xl bg-green-500/20 px-4 py-3 text-sm text-green-300">
          Mesajınız alındı. En kısa sürede size dönüş yapacağız.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--eu-muted)]">
            Telefon numaranız
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="rounded-xl border border-white/20 bg-[var(--eu-black)] px-4 py-3 text-[var(--eu-white)] placeholder:text-[var(--eu-muted)] focus:border-[var(--eu-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--eu-gold)]"
            placeholder="0xxx xxx xx xx"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--eu-muted)]">
            E-posta adresiniz
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-white/20 bg-[var(--eu-black)] px-4 py-3 text-[var(--eu-white)] placeholder:text-[var(--eu-muted)] focus:border-[var(--eu-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--eu-gold)]"
            placeholder="ornek@email.com"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--eu-muted)]">
          Mesajınız
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="rounded-xl border border-white/20 bg-[var(--eu-black)] px-4 py-3 text-[var(--eu-white)] placeholder:text-[var(--eu-muted)] focus:border-[var(--eu-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--eu-gold)] resize-y min-h-[120px]"
          placeholder="Mesajınızı yazın..."
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[var(--eu-gold)] px-8 py-3.5 font-semibold text-[var(--eu-black)] transition hover:bg-[var(--eu-gold-light)] disabled:opacity-60"
      >
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
