import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import ValueRows from "@/components/ValueRows";
import TeamCard from "@/components/TeamCard";
import { team } from "@/lib/team";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
    alternates: {
      canonical: locale === "nl" ? "/nl/over-ons" : "/en/about",
      languages: {
        "x-default": "/nl/over-ons",
        nl: "/nl/over-ons",
        en: "/en/about",
      },
    },
    openGraph: {
      title: `${t("hero.title")} | Q4S`,
      description: t("hero.subtitle"),
    },
  };
}

export default function AboutPage() {
  const t = useTranslations("about");
  const values = t.raw("values.items") as Array<{ title: string; desc: string }>;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-[#000000] text-white pt-14 lg:pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-14 lg:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-8">
            Q4S — {t("mission.title")}
          </p>
          <div className="flex gap-5 items-stretch">
            <div className="w-1 bg-[#e8430a] shrink-0 self-stretch rounded-sm" />
            <h1 className="text-[clamp(48px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
              {t("hero.title")}
            </h1>
          </div>
          <p className="text-xl text-white/70 max-w-xl mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ─── STORY ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-8">
                {t("story.title")}
              </p>
              <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.0] tracking-[-0.03em] text-[#000000] mb-8">
                {t("story.title")}
              </h2>
              {t("story.body").split("\n\n").map((para, i) => (
                <p key={i} className="text-base text-gray-600 leading-relaxed mb-5 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
            <div className="lg:col-span-5 space-y-0 border-t border-gray-100">
              <div className="py-8 border-b border-gray-100">
                <p className="text-sm font-black uppercase tracking-[0.08em] text-[#e8430a] mb-4">
                  {t("mission.missionLabel")}
                </p>
                <p className="text-base text-[#000000] font-semibold leading-relaxed">
                  {t("mission.mission")}
                </p>
              </div>
              <div className="py-8">
                <p className="text-sm font-black uppercase tracking-[0.08em] text-[#e8430a] mb-4">
                  {t("mission.visionLabel")}
                </p>
                <p className="text-base text-[#000000] font-semibold leading-relaxed">
                  {t("mission.vision")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="bg-[#000000] text-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-6">
            {t("values.label")}
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.0] tracking-[-0.03em] text-white mb-16 max-w-lg">
            {t("values.title")}
          </h2>
          <ValueRows items={values} />
        </div>
      </section>

      {/* ─── TEAM GRID ─── */}
      <section className="bg-white pt-24 lg:pt-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-6 text-center">
            {t("teamGrid.label")}
          </p>
          <h2 className="text-[clamp(28px,4vw,52px)] font-black leading-[1.0] tracking-[-0.03em] text-[#000000] mb-16 text-center max-w-2xl mx-auto">
            {t("teamGrid.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM / CTA ─── */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-6">
                {t("team.label")}
              </p>
              <h2 className="text-[clamp(32px,4.5vw,64px)] font-black leading-[0.95] tracking-[-0.04em] text-[#000000] mb-6">
                {t("team.title")}
              </h2>
              <p className="text-base text-gray-500 leading-relaxed max-w-lg">
                {t("team.body")}
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#e8430a] text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#c73508] transition-colors duration-200"
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
