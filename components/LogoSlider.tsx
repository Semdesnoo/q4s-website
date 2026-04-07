"use client";

import { useState } from "react";
import Image from "next/image";

const logos = [
  { name: "Bilfinger", file: "bilfinger", ext: "png" },
  { name: "Smulders", file: "smulders", ext: "png" },
  { name: "Damen", file: "damen", ext: "png" },
  { name: "DEME", file: "deme", ext: "png" },
  { name: "HSM Offshore Energy", file: "hsm", ext: "png" },
  { name: "IHC", file: "ihc", ext: "png" },
  { name: "Intero", file: "intero", ext: "png" },
  { name: "J de Jonge", file: "de-jonge", ext: "png" },
  { name: "Kiwa", file: "kiwa", ext: "png" },
  { name: "Eiffage", file: "eiffage", ext: "png" },
  { name: "Hollandia", file: "hollandia", ext: "png" },
  { name: "Huisman", file: "huisman-missing", ext: "svg" },
  { name: "One Dyas", file: "one-dyas", ext: "png" },
  { name: "Elia Group", file: "elia", ext: "png" },
  { name: "Feadship", file: "feadship", ext: "png" },
  { name: "Mercon", file: "mercon-missing", ext: "svg" },
  { name: "Verwater", file: "verwater", ext: "png" },
  { name: "MME Group", file: "mme", ext: "png" },
  { name: "Sew Energy", file: "sew", ext: "png" },
  { name: "SMART", file: "smart", ext: "png" },
  { name: "SPIE", file: "spie", ext: "png" },
  { name: "Strukton", file: "strukton", ext: "png" },
  { name: "Van Oord", file: "van-oord", ext: "png" },
  { name: "IV Offshore & Energy", file: "im-offshore", ext: "png" },
];

function LogoItem({ logo }: { logo: typeof logos[number] }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex items-center justify-center h-10 px-6 min-w-[140px]">
        <span className="text-sm font-bold uppercase tracking-wider text-white/60 whitespace-nowrap">
          {logo.name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-10 px-6 min-w-[140px]">
      <Image
        src={`/logos/${logo.file}.${logo.ext}`}
        alt={logo.name}
        width={120}
        height={40}
        className="object-contain h-8 w-auto opacity-30 brightness-0 invert hover:opacity-60 transition-all duration-300"
        onError={() => setFailed(true)}
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
