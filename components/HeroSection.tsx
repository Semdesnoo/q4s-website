"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

interface Props {
  tagline: string;
  slogan: string;
  intro: string;
  ctaEmployer: string;
  ctaCandidate: string;
  est: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const WORD_VARIANT = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, delay: 0.15 + i * 0.07, ease: EASE },
  }),
};

export default function HeroSection({
  tagline,
  slogan,
  intro,
  ctaEmployer,
  ctaCandidate,
  est,
}: Props) {
  const words = tagline.split(" ");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set video src after hydration so it never blocks the initial paint / LCP
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = "/media/home/hero/hero.mp4";
    v.load();
    v.play().catch(() => {});
  }, []);

  return (
    <section className="bg-black text-white pt-[68px] min-h-screen flex flex-col relative overflow-hidden">
      {/* Background video — src is set via useEffect to avoid blocking LCP */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />

      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-6 flex-1 flex flex-col justify-center py-16 lg:py-20 relative z-10">
        {/* Top bar: animated line + EST */}
        <motion.div
          className="flex items-center justify-between mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.05 }}
        >
          <motion.div
            className="h-px bg-white/15 flex-1 max-w-[200px] origin-left"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          />
          <span className="text-[11px] font-semibold text-white/30 tracking-[0.35em] uppercase hidden sm:block">
            {est}
          </span>
        </motion.div>

        {/* Headline — word by word reveal */}
        <div className="mb-10 max-w-5xl pb-6">
          <h1 className="text-[clamp(48px,8vw,104px)] font-black leading-[0.95] tracking-[-0.04em] text-white flex flex-wrap hero-headline">
            {words.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-[0.15em] mb-[-0.15em]">
                <motion.span
                  className="inline-block"
                  custom={i}
                  variants={WORD_VARIANT}
                  initial="hidden"
                  animate="show"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* Animated divider */}
        <motion.div
          className="h-px bg-white/12 mb-10 max-w-5xl origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.85, ease: EASE }}
        />

        {/* Sub-row: slogan + CTAs */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
        >
          <div className="max-w-lg">
            <p className="text-xl text-white/70 leading-relaxed mb-2">{slogan}</p>
            <p className="text-base text-white/45 leading-relaxed">{intro}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#e8430a] text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#c73508] active:scale-95 transition-all duration-200"
            >
              {ctaEmployer}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/vacancies"
              className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white font-semibold text-sm uppercase tracking-[0.1em] hover:border-white/50 hover:bg-white/5 active:scale-95 transition-all duration-200"
            >
              {ctaCandidate}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="flex justify-center pb-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/25" />
          <div className="w-1 h-1 rounded-full bg-white/25" />
        </motion.div>
      </motion.div>
    </section>
  );
}
