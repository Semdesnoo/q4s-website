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
  return { title: t("hero.title") };
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
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-6 sm:mb-8">
            Q4S Vacatures
          </p>
          <h1 className="text-[clamp(32px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
            {t("hero.title")}
          </h1>
          <p className="text-base sm:text-xl text-white/75 max-w-xl mt-6 sm:mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <VacanciesClient
        locale={locale}
        translations={{
          searchPlaceholder: t("search.placeholder"),
          filter: t("search.filter"),
          allDisciplines: t("search.allDisciplines"),
          allLocations: t("search.allLocations"),
          allTypes: t("search.allTypes"),
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
