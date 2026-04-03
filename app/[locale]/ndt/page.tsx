import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Flame, Anchor, FlaskConical, Zap, Ship, HardHat } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ndt" });
  return { title: t("hero.title") };
}

export default function NdtPage() {
  const t = useTranslations("ndt");
  const methods = t.raw("methods.items") as Array<{ code: string; title: string; desc: string }>;
  const expertise = t.raw("expertise.items") as string[];
  const sectors = t.raw("sectors.items") as string[];
  const sectorIcons = [Flame, Anchor, FlaskConical, Zap, Ship, HardHat];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-8">
            Q4S — Specialisme
          </p>
          <h1 className="text-[clamp(48px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-white/75 max-w-xl mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ─── INTRO ─── */}
      <section className="bg-white py-16 border-b border-black/5">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-[clamp(18px,2.5vw,28px)] font-semibold text-black/70 leading-relaxed max-w-3xl">
            {t("intro")}
          </p>
        </div>
      </section>

      {/* ─── NDT METHODS ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/30 mb-12">
            {t("methods.title")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5">
            {methods.map((m) => (
              <div
                key={m.code}
                className="bg-white p-8 hover:bg-[#e8430a] transition-all duration-300 group cursor-default"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-black group-hover:bg-white text-white group-hover:text-[#e8430a] font-black text-sm mb-6 transition-colors duration-300">
                  {m.code}
                </div>
                <h3 className="text-lg font-black text-black group-hover:text-white mb-3 tracking-[-0.02em] transition-colors duration-300">{m.title}</h3>
                <p className="text-base text-black/70 group-hover:text-white/90 leading-relaxed transition-colors duration-300">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERTISE + SECTORS ─── */}
      <section className="bg-black text-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Expertise */}
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white mb-10">
                {t("expertise.title")}
              </p>
              <div className="border-t border-white/15">
                {expertise.map((item, i) => (
                  <div key={i} className="flex gap-4 py-5 border-b border-white/15">
                    <div className="w-2 h-2 rounded-full bg-[#e8430a] mt-2 shrink-0" />
                    <span className="text-lg font-semibold text-white leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sectors */}
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white mb-10">
                {t("sectors.title")}
              </p>
              <div className="flex flex-col gap-2">
                {sectors.map((s, i) => {
                  const Icon = sectorIcons[i] ?? Flame;
                  return (
                  <div
                    key={s}
                    className="flex items-center gap-4 px-5 py-4 border border-white/30 hover:border-[#e8430a] hover:bg-white/5 transition-all duration-200 group"
                  >
                    <Icon size={18} className="text-[#e8430a] shrink-0" />
                    <span className="text-base font-bold text-white">
                      {s}
                    </span>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div>
              <h2 className="text-[clamp(32px,4.5vw,64px)] font-black leading-[0.95] tracking-[-0.04em] text-black mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-black/65 max-w-lg leading-relaxed">{t("cta.body")}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-black/80 transition-colors"
              >
                {t("cta.button")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/upload-cv"
                className="group inline-flex items-center gap-2 px-6 py-3.5 border border-black/20 text-black font-semibold text-sm uppercase tracking-[0.1em] hover:border-black transition-colors"
              >
                CV Uploaden
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
