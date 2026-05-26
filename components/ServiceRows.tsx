"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";

interface ServiceItem {
  title: string;
  desc: string;
}

interface Props {
  items: ServiceItem[];
}

export default function ServiceRows({ items }: Props) {
  return (
    <div className="border-t border-white/10">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
        >
          <Link
            href="/services"
            className="group relative flex items-center justify-between py-7 border-b border-white/10 overflow-hidden"
          >
            {/* Hover background */}
            <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#e8430a] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />

            <div className="flex items-center gap-6 relative z-10 translate-x-0 group-hover:translate-x-4 transition-transform duration-300">
              <span className="text-base font-black text-white/25 w-8 shrink-0 group-hover:text-[#e8430a] transition-colors duration-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg lg:text-2xl font-bold text-white group-hover:text-white/90 transition-colors">
                  {item.title}
                </h3>
                <p className="text-base text-white/55 mt-1 max-w-lg leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>

            <ArrowUpRight
              size={24}
              className="text-white/15 group-hover:text-[#e8430a] group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300 shrink-0 relative z-10"
            />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
