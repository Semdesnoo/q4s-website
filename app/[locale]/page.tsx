import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import LogoSlider from "@/components/LogoSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import WhyCards from "@/components/WhyCards";
import HeroSection from "@/components/HeroSection";
import ServiceRows from "@/components/ServiceRows";
import FadeInView from "@/components/motion/FadeInView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: "Q4S — " + t("hero.tagline") };
}

export default function HomePage() {
  const t = useTranslations("home");

  const whyItems = t.raw("why.items") as Array<{ title: string; desc: string }>;
  const serviceItems = t.raw("services.items") as Array<{ title: string; desc: string }>;
  const sectorItems = t.raw("sectors.items") as Array<{ title: string; desc: string; tag: string }>;

  const stats = [
    { target: 10, suffix: "+", label: t("stats.years") },
    { target: 200, suffix: "+", label: t("stats.placements") },
    { target: 50, suffix: "+", label: t("stats.clients") },
    { target: 96, suffix: "%", label: t("stats.satisfaction") },
  ];

  return (
    <>
      {/* ─── HERO ─── */}
      <HeroSection
        tagline={t("hero.tagline")}
        slogan={t("hero.slogan")}
        intro={t("hero.intro")}
        ctaEmployer={t("hero.ctaEmployer")}
        ctaCandidate={t("hero.ctaCandidate")}
        est={t("hero.est")}
      />

      {/* ─── CLIENT LOGOS ─── */}
      <section className="bg-black border-t border-white/5 py-10">
        <FadeInView className="max-w-[1280px] mx-auto px-6 mb-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-white/60 text-center">
            {t("clients.label")}
          </p>
        </FadeInView>
        <LogoSlider />
      </section>

      {/* ─── WHY Q4S ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <FadeInView className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-4">
                {t("why.label")}
              </p>
              <h2 className="text-[clamp(32px,4.5vw,60px)] font-black leading-[1.0] tracking-[-0.03em] text-[#000000]">
                {t("why.title")}
              </h2>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-gray-600 hover:text-[#e8430a] transition-colors shrink-0"
            >
              {t("why.aboutLink")} <ArrowUpRight size={16} />
            </Link>
          </FadeInView>
          <WhyCards items={whyItems} />
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="bg-[#000000] text-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <FadeInView className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-4">
                {t("services.label")}
              </p>
              <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.05] tracking-[-0.03em]">
                {t("services.title")}
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors shrink-0"
            >
              {t("services.learnMore")} <ArrowUpRight size={14} />
            </Link>
          </FadeInView>

          <ServiceRows items={serviceItems} />
        </div>
      </section>

      {/* ─── STATS — orange accent ─── */}
      <section className="bg-[#e8430a] py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/15">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#e8430a] px-8 py-10 text-center">
                <p className="text-[clamp(40px,5vw,72px)] font-black tracking-[-0.04em] text-white leading-none mb-2">
                  <AnimatedCounter target={s.target} suffix={s.suffix} duration={2000} />
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInView direction="none" duration={0.5}>
              <div className="text-[120px] font-black text-[#e8430a] select-none quote-mark">
                &ldquo;
              </div>
            </FadeInView>
            <FadeInView delay={0.15}>
              <blockquote className="text-[clamp(20px,3vw,36px)] font-bold leading-[1.2] tracking-[-0.02em] text-[#000000] mt-6 mb-10">
                {t("testimonial.quote")}
              </blockquote>
            </FadeInView>
            <FadeInView delay={0.25}>
              <p className="text-xs text-gray-400 uppercase tracking-wider text-center">
                {t("testimonial.role")}
              </p>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* ─── SECTOR HIGHLIGHTS ─── */}
      <section className="bg-[#000000] text-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <FadeInView className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-4">
                {t("sectors.label")}
              </p>
              <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.05] tracking-[-0.03em] text-white">
                {t("sectors.title")}
              </h2>
            </div>
            <Link
              href="/ndt"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors shrink-0"
            >
              {t("sectors.ndtLink")} <ArrowUpRight size={14} />
            </Link>
          </FadeInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
            {sectorItems.map((sector, i) => (
              <FadeInView key={i} delay={i * 0.08} direction="up">
                <div className="bg-[#000000] p-8 group hover:bg-white/5 transition-colors duration-300 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8430a] border border-[#e8430a]/40 px-2 py-1">
                      {sector.tag}
                    </span>
                    <span className="text-base font-black text-white/20 group-hover:text-[#e8430a] transition-colors duration-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 tracking-[-0.02em]">
                    {sector.title}
                  </h3>
                  <p className="text-base text-white/65 leading-relaxed">{sector.desc}</p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <FadeInView className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-6">
                {t("cta.label")}
              </p>
              <h2 className="text-[clamp(36px,5.5vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-[#000000]">
                {t("cta.title")}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#e8430a] text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#c73508] active:scale-95 transition-all duration-200"
              >
                {t("cta.employer")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/vacancies"
                className="group inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 text-[#000000] font-semibold text-sm uppercase tracking-[0.1em] hover:border-[#000000] hover:bg-gray-50 active:scale-95 transition-all duration-200"
              >
                {t("cta.candidate")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeInView>
          <FadeInView delay={0.15}>
            <p className="text-base text-gray-500 max-w-xl mt-8 leading-relaxed">
              {t("cta.body")}
            </p>
          </FadeInView>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <section className="bg-[#000000]">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <div className="flex items-center justify-center mb-6">
            <a
              href="https://maps.app.goo.gl/tYQRY1YnbHcG8aBR7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-sm font-semibold uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              {t("cta.mapsLink")} <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="w-full h-[400px] relative">
          <iframe
            src="https://maps.google.com/maps?q=51.8593938,4.51334&output=embed&hl=nl&z=16"
            width="100%"
            height="100%"
            className="map-iframe"
            title="Q4S locatie op Google Maps"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
