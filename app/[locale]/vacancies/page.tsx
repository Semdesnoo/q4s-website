import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import VacanciesClient from "@/components/VacanciesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vacancies" });
  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
    alternates: {
      canonical: locale === "nl" ? "/nl/vacatures" : "/en/vacancies",
      languages: {
        "x-default": "/nl/vacatures",
        nl: "/nl/vacatures",
        en: "/en/vacancies",
      },
    },
    openGraph: {
      title: `${t("hero.title")} | Q4S`,
      description: t("hero.subtitle"),
    },
  };
}

export default async function VacanciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vacancies" });

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-[#000000] text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-8">
            {t("hero.label")}
          </p>
          <div className="flex gap-5 items-stretch">
            <div className="w-1 bg-[#e8430a] shrink-0 self-stretch rounded-sm" />
            <h1 className="text-[clamp(32px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
              {t("hero.title")}
            </h1>
          </div>
          <p className="text-base sm:text-xl text-white/70 max-w-xl mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <VacanciesClient
        locale={locale}
        vacancyList={t.raw("list") as Array<{ id: string; title: string; location: string; description: string }>}
        translations={{
          searchPlaceholder: t("search.placeholder"),
          filter: t("search.filter"),
          allDisciplines: t("search.allDisciplines"),
          allLocations: t("search.allLocations"),
          allTypes: t("search.allTypes"),
          results: t("results"),
          noResults: t("noResults"),
          applyNow: t("applyNow"),
          learnMore: t("learnMore"),
          openApplicationTitle: t("openApplication.title"),
          openApplicationBody: t("openApplication.body"),
          openApplicationButton: t("openApplication.button"),
        }}
      />
    </>
  );
}
