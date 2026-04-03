"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  t: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    discipline: string;
    experience: string;
    availability: string;
    location: string;
    message: string;
    cvUpload: string;
    cvUploadDesc: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    required: string;
    disciplines: string[];
    availabilities: string[];
  };
}

const inputClass =
  "w-full h-11 px-4 border border-black/15 text-sm text-black focus:outline-none focus:border-black bg-white transition-colors";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-2";

export default function UploadCvForm({ t }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);
    if (file) data.set("cv", file);

    try {
      const res = await fetch("/api/submit-cv", { method: "POST", body: data });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-xl font-black text-black tracking-[-0.02em] mb-2">{t.success}</p>
        <p className="text-base text-black/60">We nemen zo snel mogelijk contact met u op.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-2 p-4 border border-red-200 text-sm text-red-600">
          <AlertCircle size={16} />
          {t.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            {t.firstName} <span className="text-[#e8430a]">*</span>
          </label>
          <input name="firstName" type="text" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>
            {t.lastName} <span className="text-[#e8430a]">*</span>
          </label>
          <input name="lastName" type="text" required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            {t.email} <span className="text-[#e8430a]">*</span>
          </label>
          <input name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>{t.phone}</label>
          <input name="phone" type="tel" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>
            {t.discipline} <span className="text-[#e8430a]">*</span>
          </label>
          <select
            name="discipline"
            required
            className="w-full h-11 px-4 border border-black/15 text-sm text-black/60 bg-white focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="">—</option>
            {t.disciplines.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>
            {t.availability} <span className="text-[#e8430a]">*</span>
          </label>
          <select
            name="availability"
            required
            className="w-full h-11 px-4 border border-black/15 text-sm text-black/60 bg-white focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="">—</option>
            {t.availabilities.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>{t.location}</label>
        <input name="location" type="text" className={inputClass} />
      </div>

      {/* CV Upload */}
      <div>
        <label className={labelClass}>
          {t.cvUpload} <span className="text-[#e8430a]">*</span>
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer border border-dashed border-black/20 p-8 text-center hover:border-black transition-colors bg-white"
        >
          <Upload size={20} className="mx-auto text-black/25 mb-3" />
          {file ? (
            <p className="text-sm font-semibold text-black">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-black/60">{t.cvUpload}</p>
              <p className="text-xs text-black/30 mt-1">{t.cvUploadDesc}</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t.message}</label>
        <textarea
          name="message"
          rows={4}
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
