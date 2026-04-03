"use client";

import { useEffect, useRef, useState } from "react";

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  features: string[];
}

function ServiceRow({ item, index }: { item: ServiceItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group border-b border-black/10 py-14 lg:py-20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: "100ms",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-black text-black/20 tracking-tight group-hover:text-[#e8430a] transition-colors duration-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-black/10 group-hover:bg-[#e8430a]/30 transition-colors duration-300" />
          </div>
          <h2 className="text-[clamp(28px,3.5vw,48px)] font-black text-black mb-5 tracking-[-0.03em] leading-[1.0] group-hover:text-black transition-colors duration-300">
            {item.title}
          </h2>
          <p className="text-lg text-black/70 leading-relaxed">{item.desc}</p>
        </div>

        {/* Right */}
        <div className="lg:col-span-7 lg:pl-16 lg:border-l border-black/10">
          <ul className="space-y-5">
            {item.features.map((f, fi) => (
              <li
                key={fi}
                className="flex items-start gap-4"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(20px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  transitionDelay: `${200 + fi * 80}ms`,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#e8430a] mt-2.5 shrink-0" />
                <span className="text-lg text-black/80 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ServiceItems({ items }: { items: ServiceItem[] }) {
  return (
    <div className="border-t border-black/10">
      {items.map((item, i) => (
        <ServiceRow key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}
