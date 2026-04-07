import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import LogoSlider from "@/components/LogoSlider";
import AnimatedCounter from "@/components/AnimatedCounter";
import WhyCards from "@/components/WhyCards";

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

  const stats = [
    { target: 10, suffix: "+", label: "Jaar ervaring" },
    { target: 200, suffix: "+", label: "Plaatsingen" },
    { target: 50, suffix: "+", label: "Opdrachtgevers" },
    { target: 96, suffix: "%", label: "Klanttevredenheid" },
  ];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px] min-h-screen flex flex-col justify-between">
        <div className="max-w-[1280px] mx-auto px-6 flex-1 flex flex-col justify-center py-10 lg:py-14">
          {/* EST label */}
          <div className="flex justify-end mb-8">
            <span className="text-sm font-bold text-white/60 tracking-widest hidden sm:block">
              EST. 2015
            </span>
          </div>

          {/* Main headline */}
          <div className="mb-10 max-w-5xl">
            <h1 className="text-[clamp(48px,8vw,104px)] font-black leading-[0.95] tracking-[-0.04em] text-white">
              {t("hero.tagline")}
            </h1>
          </div>

          {/* Sub row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-lg">
              <p className="text-xl text-white/75 leading-relaxed mb-2">
                {t("hero.slogan")}
              </p>
              <p className="text-base text-white/60 leading-relaxed">
                {t("hero.intro")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#e8430a] text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#c73508] transition-colors duration-200"
              >
                {t("hero.ctaEmployer")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/vacancies"
                className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white font-semibold text-sm uppercase tracking-[0.1em] hover:border-white/60 transition-colors duration-200"
              >
                {t("hero.ctaCandidate")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ─── CLIENT LOGOS ─── */}
      <section className="bg-black border-t border-white/5 py-10">
        <div className="max-w-[1280px] mx-auto px-6 mb-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.25em] text-white/60 text-center">
            {t("clients.label")}
          </p>
        </div>
        <LogoSlider />
      </section>

      {/* ─── WHY Q4S ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/30 mb-4">
                Waarom Q4S
              </p>
              <h2 className="text-[clamp(32px,4.5vw,60px)] font-black leading-[1.0] tracking-[-0.03em] text-black">
                {t("why.title")}
              </h2>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-black hover:text-black/50 transition-colors shrink-0"
            >
              Meer over ons <ArrowUpRight size={16} />
            </Link>
          </div>
          <WhyCards items={whyItems} />
        </div>
      </section>

      {/* ─── SERVICES — FORME accordion style ─── */}
      <section className="bg-black text-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 mb-4">
                Onze Diensten
              </p>
              <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.05] tracking-[-0.03em]">
                {t("services.title")}
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors shrink-0"
            >
              {t("services.learnMore")} <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Service rows — FORME arrow-list style */}
          <div className="border-t border-white/10">
            {serviceItems.map((item, i) => (
              <Link
                key={i}
                href="/services"
                className="group flex items-center justify-between py-7 border-b border-white/10 hover:px-4 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <span className="text-base font-black text-white/25 w-8 shrink-0 group-hover:text-[#e8430a] group-hover:scale-110 transition-all duration-300 origin-left">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg lg:text-2xl font-bold text-white group-hover:text-white/80 transition-colors">{item.title}</h3>
                    <p className="text-base text-white/65 mt-1 max-w-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <ArrowUpRight size={24} className="text-white/20 group-hover:text-[#e8430a] group-hover:scale-110 transition-all duration-300 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-black border-t border-white/5 py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {stats.map((s) => (
              <div key={s.label} className="bg-black px-8 py-10 text-center">
                <p className="text-[clamp(40px,5vw,72px)] font-black tracking-[-0.04em] text-white leading-none mb-2">
                  <AnimatedCounter target={s.target} suffix={s.suffix} duration={2000} />
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
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
            <div className="text-[120px] font-black text-[#e8430a] leading-none mb-0 select-none" style={{lineHeight: "0.7"}}>
              "
            </div>
            <blockquote className="text-[clamp(20px,3vw,36px)] font-bold leading-[1.2] tracking-[-0.02em] text-black mt-6 mb-10">
              Q4S heeft ons binnen twee weken voorzien van drie hooggekwalificeerde inspecteurs.
              Professioneel, snel en betrouwbaar — precies wat wij nodig hadden.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-sm font-bold text-black/40">
                M
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-black">Martin de Vries</p>
                <p className="text-xs text-black/40 uppercase tracking-wider">Project Manager, Technip Energies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTOR HIGHLIGHTS ─── */}
      <section className="bg-black text-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 mb-4">
                Sectoren
              </p>
              <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.05] tracking-[-0.03em] text-white">
                Waar precisie het{" "}
                verschil maakt.
              </h2>
            </div>
            <Link
              href="/ndt"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors shrink-0"
            >
              NDT Specialisme <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {[
              { title: "Oil & Gas", desc: "Inspectors en QC-engineers voor upstream en downstream projecten wereldwijd.", tag: "Source Inspection" },
              { title: "Petrochemie", desc: "NDT-specialisten en kwaliteitsborging voor raffinaderijen en chemische installaties.", tag: "NDT / QA" },
              { title: "Offshore", desc: "Gecertificeerde inspecteurs voor offshore constructie en FPSO-projecten.", tag: "Marine & Offshore" },
              { title: "Industrie", desc: "QA/QC professionals voor fabrieksinstallaties en mechanische engineering.", tag: "Manufacturing" },
              { title: "Infrastructuur", desc: "Inspectie en kwaliteitsmanagement voor grote civiele en industriële bouwprojecten.", tag: "Construction" },
              { title: "Energie", desc: "Specialisten voor wind-, zonne- en conventionele energieprojecten.", tag: "Energy" },
            ].map((sector, i) => (
              <div key={i} className="bg-black p-8 group hover:bg-white/5 transition-colors duration-200">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8430a] border border-[#e8430a]/30 px-2 py-1">
                    {sector.tag}
                  </span>
                  <span className="text-base font-black text-white/25 group-hover:text-[#e8430a] group-hover:scale-110 transition-all duration-300 origin-right">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-xl font-black text-white mb-3 tracking-[-0.02em]">{sector.title}</h3>
                <p className="text-base text-white/70 leading-relaxed">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-black mb-6">
                Laten we samenwerken
              </p>
              <h2 className="text-[clamp(36px,5.5vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-black">
                {t("cta.title")}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-black/80 transition-colors duration-200"
              >
                {t("cta.employer")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/vacancies"
                className="group inline-flex items-center gap-2 px-6 py-3.5 border border-black/20 text-black font-semibold text-sm uppercase tracking-[0.1em] hover:border-black transition-colors duration-200"
              >
                {t("cta.candidate")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          <p className="text-base text-black max-w-xl mt-8 leading-relaxed">
            {t("cta.body")}
          </p>
        </div>
      </section>

      {/* ─── MAP ─── */}
      <section className="bg-black">
        <div className="max-w-[1280px] mx-auto px-6 py-10">
          <div className="flex items-center justify-center mb-6">
            <a
              href="https://maps.app.goo.gl/tYQRY1YnbHcG8aBR7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-sm font-semibold uppercase tracking-[0.15em] text-white/80 hover:text-white transition-colors flex items-center gap-1"
            >
              Bekijk op Google Maps <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="w-full h-[400px] relative">
          <iframe
            src="https://maps.google.com/maps?q=51.8593938,4.51334&output=embed&hl=nl&z=16"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
