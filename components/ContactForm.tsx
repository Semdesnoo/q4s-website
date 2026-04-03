"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  t: {
    title: string;
    name: string;
    email: string;
    subject: string;
    subjects: string[];
    message: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
}

const inputClass =
  "w-full h-11 px-4 border border-black/15 text-sm text-black placeholder-black/30 focus:outline-none focus:border-black bg-white transition-colors";

const labelClass = "block text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-2";

export default function ContactForm({ t }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle size={40} className="text-black mb-4" />
        <p className="text-base font-black text-black tracking-[-0.02em]">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-black text-black tracking-[-0.03em] mb-8">{t.title}</h2>

      {status === "error" && (
        <div className="flex items-center gap-2 p-4 border border-red-200 text-sm text-red-600">
          <AlertCircle size={16} />
          {t.error}
        </div>
      )}

      <div>
        <label className={labelClass}>
          {t.name} <span className="text-[#e8430a]">*</span>
        </label>
        <input type="text" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>
          {t.email} <span className="text-[#e8430a]">*</span>
        </label>
        <input type="email" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>{t.subject}</label>
        <select className="w-full h-11 px-4 border border-black/15 text-sm text-black/60 bg-white focus:outline-none focus:border-black cursor-pointer">
          <option value="">—</option>
          {t.subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>
          {t.message} <span className="text-[#e8430a]">*</span>
        </label>
        <textarea
          required
          rows={5}
          className="w-full px-4 py-3 border border-black/15 text-sm text-black focus:outline-none focus:border-black bg-white transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-12 bg-black text-white text-xs font-semibold uppercase tracking-[0.15em] hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? t.submitting : t.submit}
      </button>
    </form>
  );
}
