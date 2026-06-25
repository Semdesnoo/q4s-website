"use client";

import { useState } from "react";

const logos = [
  { name: "Bilfinger", file: "bilfinger" },
  { name: "Smulders", file: "smulders" },
  { name: "Damen", file: "damen" },
  { name: "DEME", file: "deme" },
  { name: "IHC", file: "ihc" },
  { name: "Intero", file: "intero" },
  { name: "J de Jonge", file: "J-de-jonge" },
  { name: "Kiwa", file: "kiwa" },
  { name: "Hollandia", file: "hollandia" },
  { name: "One Dyas", file: "one-dyas" },
  { name: "Elia Group", file: "elia" },
  { name: "Feadship", file: "feadship" },
  { name: "Mercon", file: "mercon" },
  { name: "Verwater", file: "verwater" },
  { name: "Sew Energy", file: "sew" },
  { name: "SPIE", file: "spie" },
  { name: "Strukton", file: "strukton" },
  { name: "Van Oord", file: "van-oord" },
  { name: "IV Offshore & Energy", file: "im-offshore" },
  { name: "Robust Structures", file: "robust-structures" },
] as const;

function LogoItem({ logo }: { logo: (typeof logos)[number] }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex items-center justify-center h-12 w-[180px] shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400 whitespace-nowrap">
          {logo.name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-12 w-[180px] shrink-0 px-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/${logo.file}.svg`}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="max-h-9 max-w-[140px] w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
      />
    </div>
  );
}

export default function LogoSlider() {
  const doubled = [...logos, ...logos];

  return (
    <div className="overflow-hidden" aria-label="Client logos">
      <div className="flex animate-marquee" style={{ width: "max-content" }}>
        {doubled.map((logo, i) => (
          <LogoItem key={`${logo.file}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}
