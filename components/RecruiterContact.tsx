import { Phone } from "lucide-react";

// Inline recruiter contact block (Gjil de Jong) for the contact & CV-upload pages.
// Server component — no hooks, safe to render inside the server-rendered pages.
export default function RecruiterContact({ locale }: { locale: string }) {
  const label = locale === "nl" ? "Jouw contactpersoon" : "Your contact person";

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e8430a] mb-4">
        {label}
      </p>
      <div className="flex items-center gap-4 mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/team/gjil-de-jong.png"
          alt="Gjil de Jong"
          loading="lazy"
          decoding="async"
          className="h-14 w-14 rounded-full object-cover ring-2 ring-[#e8430a] shrink-0"
        />
        <div>
          <p className="text-base font-black text-[#000000] leading-tight">Gjil de Jong</p>
          <p className="text-sm text-gray-500">Talent &amp; Business Consultant</p>
        </div>
      </div>
      <a
        href="tel:+31683859566"
        className="flex items-center justify-center gap-2.5 py-3 bg-[#e8430a] text-white text-xs font-semibold uppercase tracking-[0.12em] hover:bg-[#c73508] transition-colors"
      >
        <Phone size={15} className="shrink-0" />
        +31 6 83859566
      </a>
    </div>
  );
}
