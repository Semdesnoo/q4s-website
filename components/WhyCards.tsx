"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Diamond, Zap, Target, Sparkles } from "lucide-react";

interface WhyItem {
  title: string;
  desc: string;
}

const icons = [Diamond, Zap, Target, Sparkles];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export default function WhyCards({ items }: { items: WhyItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/8"
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
    >
      {items.map((item, i) => {
        const Icon = icons[i];
        return (
          <motion.div
            key={i}
            variants={cardVariant}
            className="group bg-white hover:bg-[#0d1f3c] transition-colors duration-500 p-10 flex flex-col cursor-default border border-gray-100 group-hover:border-[#0d1f3c]"
          >
            <span className="text-[#e8430a] mb-8 block group-hover:scale-110 transition-transform duration-300 w-fit">
              <Icon size={28} strokeWidth={1.5} />
            </span>

            <span className="text-[11px] font-bold text-gray-300 group-hover:text-white/20 tracking-[0.2em] mb-3 transition-colors duration-500">
              {String(i + 1).padStart(2, "0")}
            </span>

            <h3 className="text-xl font-black text-[#0d1f3c] group-hover:text-white tracking-[-0.02em] mb-3 transition-colors duration-500">
              {item.title}
            </h3>

            <div className="w-8 h-px bg-[#e8430a] mb-4 group-hover:w-16 transition-all duration-500" />

            <p className="text-base text-gray-500 group-hover:text-white/65 leading-relaxed transition-colors duration-500">
              {item.desc}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
