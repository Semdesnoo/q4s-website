"use client";

import { useEffect, useRef, useState } from "react";

interface WhyItem {
  title: string;
  desc: string;
}

const icons = ["◈", "⚡", "◎", "✦"];

export default function WhyCards({ items }: { items: WhyItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/8"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="group bg-white hover:bg-black transition-colors duration-500 p-10 flex flex-col"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(48px)",
            transition: `opacity 0.6s ease, transform 0.6s ease, background-color 0.5s ease`,
            transitionDelay: `${i * 100}ms`,
          }}
        >
          {/* Icon */}
          <span className="text-3xl text-[#e8430a] mb-8 block group-hover:scale-110 transition-transform duration-300">
            {icons[i]}
          </span>

          {/* Number */}
          <span className="text-[11px] font-bold text-black/20 group-hover:text-white/20 tracking-[0.2em] mb-3 transition-colors duration-500">
            {String(i + 1).padStart(2, "0")}
          </span>

          {/* Title */}
          <h3 className="text-xl font-black text-black group-hover:text-white tracking-[-0.02em] mb-3 transition-colors duration-500">
            {item.title}
          </h3>

          {/* Divider */}
          <div className="w-8 h-px bg-[#e8430a] mb-4" />

          {/* Description */}
          <p className="text-base text-black/55 group-hover:text-white/65 leading-relaxed transition-colors duration-500">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
