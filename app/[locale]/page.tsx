import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight, Fuel, FlaskConical, Ship, Factory, Building2, Zap } from "lucide-react";
import LogoSlider from "@/components/LogoSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import WhyCards from "@/components/WhyCards";
import HeroSection from "@/components/HeroSection";
import ServiceRows from "@/components/ServiceRows";
import FadeInView from "@/components/motion/FadeInView";

const sectorIcons = [Fuel, FlaskConical, Ship, Factory, Building2, Zap];

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
  const locale = useLocale();

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
      <section className="bg-white border-t border-gray-100 py-10">
        <FadeInView className="max-w-[1280px] mx-auto px-6 mb-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-[#000000] text-center">
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

      {/* ─── CV UPLOAD CTA — contained orange card ─── */}
      <section className="bg-white py-24 lg:py-32">
        <style>{`
          .cvcta-line,
          .cvcta-arrow {
            stroke-dasharray: 360;
            stroke-dashoffset: 360;
            opacity: 0.28;
            transition: stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease-out;
          }
          .cvcta-arrow { opacity: 0.18; }
          .cvcta:hover .cvcta-line { stroke-dashoffset: 0; opacity: 0.6; }
          .cvcta:hover .cvcta-arrow { stroke-dashoffset: 0; opacity: 0.95; }
          @media (prefers-reduced-motion: reduce) {
            .cvcta-line,
            .cvcta-arrow {
              transition: opacity 0.3s ease-out;
              stroke-dashoffset: 0;
            }
          }
        `}</style>
        <div className="max-w-[1280px] mx-auto px-6">
          <FadeInView direction="up" className="flex justify-center">
            <Link
              href="/upload-cv"
              aria-label={t("cvUpload.title")}
              className="cvcta group relative block w-full max-w-[560px] overflow-hidden bg-[#e8430a] outline-none focus-visible:ring-4 focus-visible:ring-[#000000]/30 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              {/* Inner padded layout: heading top, button bottom */}
              <div className="relative z-10 flex min-h-[480px] flex-col px-8 py-12 sm:px-12 sm:py-14">
                {/* Eyebrow + heading */}
                <div>
                  <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                    CV
                  </p>
                  <h2 className="max-w-[14ch] text-[clamp(30px,5.2vw,52px)] font-black leading-[0.98] tracking-[-0.03em] text-white">
                    {t("cvUpload.title")}
                  </h2>
                </div>

                {/* Spacer pushes button toward the bottom */}
                <div className="flex-1" />

                {/* Button zone with decorative flap lines framing it */}
                <div className="relative mt-12 flex items-center justify-center">
                  {/* Decorative "upload flap" SVG — draws/opens on hover */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 320 200"
                    fill="none"
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none absolute inset-0 -z-0 mx-auto h-full w-full max-w-[420px] text-white"
                  >
                    {/* Upper opening flaps (drop-zone opening upward) */}
                    <path className="cvcta-line" d="M70 78 L160 30 L250 78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    <path className="cvcta-line" d="M44 96 L160 8 L276 96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    {/* Upward arrow motif rising out of the button */}
                    <path className="cvcta-arrow" d="M160 150 L160 64 M132 92 L160 64 L188 92" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    {/* Lower framing strokes (drop-zone base) */}
                    <path className="cvcta-line" d="M44 132 L160 192 L276 132" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  </svg>

                  {/* The button itself — inverts white -> dark on hover */}
                  <span className="relative z-10 inline-flex items-center justify-center gap-2.5 bg-white px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#000000] transition-colors duration-300 ease-out group-hover:bg-[#000000] group-hover:text-white">
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="-mt-px transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
                    >
                      <path d="M12 16V4M7 9l5-5 5 5M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t("cvUpload.button")}
                  </span>
                </div>
              </div>
            </Link>
          </FadeInView>
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
          </FadeInView>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {sectorItems.map((sector, i) => {
              const Icon = sectorIcons[i % sectorIcons.length];
              return (
                <FadeInView key={i} delay={i * 0.07} direction="up">
                  <Link
                    href="/services"
                    aria-label={sector.title}
                    className="group relative flex h-full flex-col items-center text-center"
                  >
                    {/* Card */}
                    <div className="relative w-full aspect-square overflow-hidden bg-white/[0.03] transition-colors duration-300 group-hover:bg-white/[0.06]">
                      {/* Corner-line overlay: inline SVG, 4 diagonal lines from corners toward center */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        fill="none"
                        className="pointer-events-none absolute inset-0 h-full w-full scale-90 text-[#e8430a] opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
                      >
                        <line x1="0" y1="0" x2="26" y2="26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <line x1="100" y1="0" x2="74" y2="26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <line x1="0" y1="100" x2="26" y2="74" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <line x1="100" y1="100" x2="74" y2="74" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                      </svg>

                      {/* Centered icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="h-9 w-9 sm:h-10 sm:w-10 text-[#e8430a] transition-transform duration-500 ease-out group-hover:scale-125"
                        />
                      </div>
                    </div>

                    {/* Title below the card */}
                    <h3 className="relative mt-4 inline-block text-sm sm:text-base font-black tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-[#e8430a]">
                      {sector.title}
                      <span className="pointer-events-none absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#e8430a] transition-all duration-300 ease-out group-hover:w-6" />
                    </h3>
                  </Link>
                </FadeInView>
              );
            })}
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
            src={`https://maps.google.com/maps?q=51.8593938,4.51334&output=embed&hl=${locale === "nl" ? "nl" : "en"}&z=16`}
            width="100%"
            height="100%"
            className="map-iframe"
            title={locale === "nl" ? "Q4S locatie op Google Maps" : "Q4S location on Google Maps"}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
