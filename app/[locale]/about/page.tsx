import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ValueRows from "@/components/ValueRows";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("hero.title") };
}

export default function AboutPage() {
  const t = useTranslations("about");
  const values = t.raw("values.items") as Array<{ title: string; desc: string }>;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-8">
            Q4S — Quality Force
          </p>
          <h1 className="text-[clamp(48px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-white/75 max-w-xl mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/30 mb-8">
                Ons Verhaal
              </p>
              <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.0] tracking-[-0.03em] text-black mb-8">
                {t("story.title")}
              </h2>
              {t("story.body").split("\n\n").map((para, i) => (
                <p key={i} className="text-base text-black/75 leading-relaxed mb-5 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
            <div className="lg:col-span-5 space-y-0 border-t border-black/10">
              <div className="py-8 border-b border-black/10">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4">
                  Missie
                </p>
                <p className="text-base text-black font-semibold leading-relaxed">
                  {t("mission.mission")}
                </p>
              </div>
              <div className="py-8">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4">
                  Visie
                </p>
                <p className="text-base text-black font-semibold leading-relaxed">
                  {t("mission.vision")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="bg-black text-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30 mb-6">
            Kernwaarden
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.0] tracking-[-0.03em] text-white mb-16 max-w-lg">
            {t("values.title")}
          </h2>
          <ValueRows items={values} />
        </div>
      </section>

      {/* ─── TEAM / CTA ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/30 mb-6">
                Ons Team
              </p>
              <h2 className="text-[clamp(32px,4.5vw,64px)] font-black leading-[0.95] tracking-[-0.04em] text-black mb-6">
                {t("team.title")}
              </h2>
              <p className="text-base text-black/70 leading-relaxed max-w-lg">
                {t("team.body")}
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-black/80 transition-colors duration-200"
              >
                Contact
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
