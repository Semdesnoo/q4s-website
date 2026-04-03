"use client";

import { useEffect, useRef, useState } from "react";

interface ValueItem {
  title: string;
  desc: string;
}

function ValueRow({ item, index }: { item: ValueItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group flex gap-8 py-10 border-b border-white/10 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <span className="text-3xl font-black text-white/20 group-hover:text-[#e8430a] transition-colors duration-300 pt-0.5 w-12 shrink-0 leading-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1">
        <h3 className="text-xl font-black text-white mb-2 tracking-[-0.02em] group-hover:text-[#e8430a] transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-lg text-white/75 leading-relaxed">{item.desc}</p>
      </div>
    </div>
  );
}

export default function ValueRows({ items }: { items: ValueItem[] }) {
  return (
    <div className="border-t border-white/10">
      {items.map((item, i) => (
        <ValueRow key={i} item={item} index={i} />
      ))}
    </div>
  );
}
