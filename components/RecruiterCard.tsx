"use client";

import { useState } from "react";
import { Phone, X, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

const NAME = "Gjil de Jong";
const ROLE = "Talent & Business Consultant";
const INITIALS = "GdJ";
const PHONE_HREF = "tel:+31683859566";
const PHONE_LABEL = "+31 6 83859566";
const PHOTO_SRC = "/team/gjil-de-jong.png";

export default function RecruiterCard() {
  const locale = useLocale();
  const [closed, setClosed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  if (closed) return null;

  const closeLabel = locale === "nl" ? "Sluiten" : "Close";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[244px] sm:w-[284px] animate-[recruiter-rise_0.5s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none">
      <style>{`
        @keyframes recruiter-rise{0%{opacity:0;transform:translateY(16px) scale(.96)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes recruiter-pulse{0%{transform:scale(1);opacity:.6}70%{opacity:0}100%{transform:scale(1.4);opacity:0}}
        @keyframes recruiter-ring{0%,82%,100%{transform:rotate(0)}85%{transform:rotate(-13deg)}88%{transform:rotate(11deg)}91%{transform:rotate(-9deg)}94%{transform:rotate(7deg)}97%{transform:rotate(-4deg)}}
      `}</style>

      <div className="relative bg-[#000000] text-white shadow-2xl shadow-black/40 ring-1 ring-white/10">
        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label={closeLabel}
          title={closeLabel}
          className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none"
        >
          <X size={15} strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Body: avatar + name/role */}
        <div className="flex items-center gap-4 p-4 pr-10 sm:p-5 sm:pr-10">
          <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
            {/* Pulsing availability ring */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#e8430a] animate-[recruiter-pulse_2.4s_ease-out_infinite] motion-reduce:hidden"
            />
            {imgFailed ? (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e8430a] text-sm font-black tracking-[-0.02em] text-white select-none">
                {INITIALS}
              </div>
            ) : (
              <img
                src={PHOTO_SRC}
                alt={NAME}
                loading="lazy"
                decoding="async"
                onError={() => setImgFailed(true)}
                className="relative h-full w-full rounded-full object-cover ring-2 ring-[#e8430a]"
              />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-base font-black leading-tight tracking-[-0.02em] text-white">
              {NAME}
            </p>
            <p className="mt-1.5 text-[13px] font-medium leading-snug text-white/65">{ROLE}</p>
          </div>
        </div>

        {/* Primary CTA bar */}
        <a
          href={PHONE_HREF}
          aria-label={`${NAME} — ${PHONE_LABEL}`}
          className="group flex items-center gap-2.5 bg-[#e8430a] px-3.5 py-3 transition-colors duration-200 hover:bg-[#c73508] focus-visible:bg-[#c73508] focus-visible:outline-none sm:px-4"
        >
          <Phone
            size={17}
            strokeWidth={2.5}
            className="shrink-0 origin-center text-white animate-[recruiter-ring_3s_ease-in-out_infinite] motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="flex-1 text-sm font-black tracking-[-0.01em] tabular-nums whitespace-nowrap text-white">
            {PHONE_LABEL}
          </span>
          <ArrowRight
            size={16}
            strokeWidth={2.5}
            className="shrink-0 text-white transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
