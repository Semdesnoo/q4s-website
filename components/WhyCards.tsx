"use client";

import { Diamond, Zap, Target, Sparkles } from "lucide-react";
import MobileSlider from "@/components/MobileSlider";
import FadeInView from "@/components/motion/FadeInView";

interface WhyItem {
  title: string;
  desc: string;
}

const icons = [Diamond, Zap, Target, Sparkles];

export default function WhyCards({ items }: { items: WhyItem[] }) {
  return (
    <FadeInView direction="up">
      <MobileSlider gridClassName="sm:grid-cols-2 lg:grid-cols-4 sm:gap-px sm:bg-black/8">
        {items.map((item, i) => {
          const Icon = icons[i] ?? Diamond;
          return (
            <div
              key={i}
              className="group h-full bg-white hover:bg-[#000000] transition-colors duration-500 p-10 flex flex-col cursor-default border border-gray-100 group-hover:border-[#000000]"
            >
              <span className="text-[#e8430a] mb-8 block group-hover:scale-110 transition-transform duration-300 w-fit">
                <Icon size={28} strokeWidth={1.5} />
              </span>

              <span className="text-[11px] font-bold text-gray-300 group-hover:text-white/20 tracking-[0.2em] mb-3 transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="text-xl font-black text-[#000000] group-hover:text-white tracking-[-0.02em] mb-3 transition-colors duration-500">
                {item.title}
              </h3>

              <div className="w-8 h-px bg-[#e8430a] mb-4 group-hover:w-16 transition-all duration-500" />

              <p className="text-base text-gray-500 group-hover:text-white/65 leading-relaxed transition-colors duration-500">
                {item.desc}
              </p>
            </div>
          );
        })}
      </MobileSlider>
    </FadeInView>
  );
}
