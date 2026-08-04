"use client";

import { useState, useRef } from "react";
import { Upload, AlertCircle } from "lucide-react";
import Turnstile, { TURNSTILE_ENABLED } from "./Turnstile";

interface Props {
  locale: string;
  t: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    sector: string;
    request: string;
    fileUpload: string;
    fileUploadDesc: string;
    fileTooLarge: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    verify: string;
    sectors: string[];
  };
}

const inputClass =
  "w-full h-11 px-4 border border-black/15 text-sm text-black focus:outline-none focus:border-black bg-white transition-colors";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40 mb-2";

/** Zelfde grens als bij het CV-formulier: Vercel weigert bodies boven ~4,5 MB. */
const MAX_FILE_BYTES = 4 * 1024 * 1024;

export default function EmployerForm({ locale, t }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Een Turnstile-token is eenmalig; na een mislukte poging bouwen we de
  // widget opnieuw op door de key te wijzigen.
  const [attempt, setAttempt] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  function resetVerification() {
    setToken(null);
    setAttempt((n) => n + 1);
  }

  function selectFile(chosen: File | null) {
    if (chosen && chosen.size > MAX_FILE_BYTES) {
      setFile(null);
      setFileError(t.fileTooLarge);
      return;
    }
    setFile(chosen);
    setFileError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (TURNSTILE_ENABLED && !token) return;
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);
    if (file) data.set("file", file);
    if (token) data.set("turnstileToken", token);

    try {
      const res = await fetch("/api/submit-assignment", { method: "POST", body: data });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        resetVerification();
      }
    } catch {
      setStatus("error");
      resetVerification();
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
        <p className="text-xl font-black text-black tracking-[-0.02em]">{t.success}</p>
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
            {t.company} <span className="text-[#e8430a]">*</span>
          </label>
          <input name="company" type="text" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>
            {t.email} <span className="text-[#e8430a]">*</span>
          </label>
          <input name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>{t.phone}</label>
          <input name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>
            {t.sector} <span className="text-[#e8430a]">*</span>
          </label>
          <select
            name="sector"
            required
            className="w-full h-11 px-4 border border-black/15 text-sm text-black/60 bg-white focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="">—</option>
            {t.sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          {t.request} <span className="text-[#e8430a]">*</span>
        </label>
        <textarea
          name="request"
          rows={4}
          required
          className="w-full px-4 py-3 border border-black/15 text-sm text-black focus:outline-none focus:border-black bg-white transition-colors resize-none"
        />
      </div>

      {/* Optional assignment / vacancy upload */}
      <div>
        <label className={labelClass}>{t.fileUpload}</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer border border-dashed border-black/20 p-8 text-center hover:border-black transition-colors bg-white"
        >
          <Upload size={20} className="mx-auto text-black/25 mb-3" />
          {file ? (
            <p className="text-sm font-semibold text-black">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-semibold text-black/60">{t.fileUpload}</p>
              <p className="text-xs text-black/30 mt-1">{t.fileUploadDesc}</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
          />
        </div>
        {fileError && (
          <p className="flex items-start gap-2 mt-2 text-sm text-[#c73508]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {fileError}
          </p>
        )}
      </div>

      {TURNSTILE_ENABLED && (
        <div>
          <Turnstile
            key={attempt}
            locale={locale}
            onVerify={setToken}
            onExpire={() => setToken(null)}
          />
          {!token && <p className="text-xs text-black/40 mt-2">{t.verify}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading" || (TURNSTILE_ENABLED && !token)}
        className="w-full h-12 bg-[#e8430a] text-white text-xs font-semibold uppercase tracking-[0.15em] hover:bg-[#c73508] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? t.submitting : t.submit}
      </button>
    </form>
  );
}
