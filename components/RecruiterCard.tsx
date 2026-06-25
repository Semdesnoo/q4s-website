"use client";

import { useState } from "react";
import { Phone, X, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

const NAME = "Gjil de Jong";
const ROLE = "Recruiter";
const INITIALS = "GdJ";
const PHONE_HREF = "tel:+31683859566";
const PHONE_LABEL = "+31 6 83859566";
const PHOTO_SRC = "/team/gjil-de-jong.png";

export default function RecruiterCard() {
  const locale = useLocale();
  const [closed, setClosed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  if (closed) return null;

  const label = locale === "nl" ? "Jouw recruiter" : "Your recruiter";
  const closeLabel = locale === "nl" ? "Sluiten" : "Close";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[260px] sm:w-[300px] animate-[recruiter-rise_0.4s_ease-out]">
      <style>{`@keyframes recruiter-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div className="relative bg-[#000000] text-white shadow-2xl shadow-black/40 ring-1 ring-white/10">
        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label={closeLabel}
          title={closeLabel}
          className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none"
        >
          <X size={16} strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Body: avatar + name/role */}
        <div className="flex items-center gap-3.5 p-4 pr-9 sm:p-5 sm:pr-10">
          <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
            {imgFailed ? (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e8430a] text-sm font-black tracking-[-0.02em] text-white select-none sm:text-base">
                {INITIALS}
              </div>
            ) : (
              <img
                src={PHOTO_SRC}
                alt={NAME}
                loading="lazy"
                decoding="async"
                onError={() => setImgFailed(true)}
                className="h-full w-full rounded-full object-cover ring-2 ring-[#e8430a]"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="hidden text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] sm:block">
              {label}
            </p>
            <p className="truncate text-base font-black leading-tight tracking-[-0.02em] text-white sm:mt-1">
              {NAME}
            </p>
            <p className="text-[13px] font-medium text-white/60">{ROLE}</p>
          </div>
        </div>

        {/* Primary CTA bar */}
        <a
          href={PHONE_HREF}
          aria-label={`${label}: ${NAME} — ${PHONE_LABEL}`}
          className="group flex items-center gap-3 bg-[#e8430a] px-4 py-3.5 transition-colors duration-200 hover:bg-[#c73508] focus-visible:bg-[#c73508] focus-visible:outline-none sm:px-5"
        >
          <Phone
            size={18}
            strokeWidth={2.5}
            className="shrink-0 text-white"
            aria-hidden="true"
          />
          <span className="flex-1 text-[15px] font-black tracking-[-0.01em] tabular-nums whitespace-nowrap text-white">
            {PHONE_LABEL}
          </span>
          <ArrowRight
            size={18}
            strokeWidth={2.5}
            className="shrink-0 text-white transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
