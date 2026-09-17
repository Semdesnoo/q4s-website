import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, MapPin, Clock, Briefcase, CheckCircle } from "lucide-react";
import { vacancies } from "@/lib/vacancies";
import { fetchFeedVacancy, fetchFeedVacancies } from "@/lib/vacancy-feed";
import { absoluteUrl, LOGO_URL, SITE_URL } from "@/lib/site";
import { jsonLd, ORG_ID } from "@/lib/schema";

export async function generateStaticParams() {
  // Static vacancies (legacy)
  const staticParams = vacancies.map((v) => ({ id: v.id }));
  // Feed vacancies — fetch at build time for prerendering
  const feedVacancies = await fetchFeedVacancies();
  const feedParams = feedVacancies.map((v) => ({ id: v.id }));
  return [...staticParams, ...feedParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "vacancies" });

  // Try feed first
  const feedVacancy = await fetchFeedVacancy(id);
  if (feedVacancy) {
    return {
      title: `${feedVacancy.title} | ${t("hero.label")}`,
      description: feedVacancy.description,
      alternates: {
        canonical: locale === "nl" ? `/nl/vacatures/${id}` : `/en/vacancies/${id}`,
        languages: {
          "x-default": `/nl/vacatures/${id}`,
          nl: `/nl/vacatures/${id}`,
          en: `/en/vacancies/${id}`,
        },
      },
      openGraph: {
        title: `${feedVacancy.title} | Q4S`,
        description: feedVacancy.description,
      },
    };
  }

  // Fallback to static
  const list = t.raw("list") as Array<{ id: string; title: string; description: string; location: string }>;
  const vacancy = list.find((v) => v.id === id);
  if (!vacancy) return { title: t("noResults") };
  return {
    title: `${vacancy.title} | ${t("hero.label")}`,
    description: vacancy.description,
    alternates: {
      canonical: locale === "nl" ? `/nl/vacatures/${id}` : `/en/vacancies/${id}`,
      languages: {
        "x-default": `/nl/vacatures/${id}`,
        nl: `/nl/vacatures/${id}`,
        en: `/en/vacancies/${id}`,
      },
    },
    openGraph: {
      title: `${vacancy.title} | Q4S`,
      description: vacancy.description,
    },
  };
}

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "vacancies" });

  // Try feed vacancy first
  const feedVacancy = await fetchFeedVacancy(id);

  if (feedVacancy) {
    return renderVacancy({
      locale,
      t,
      vacancy: {
        id: feedVacancy.id,
        title: feedVacancy.title,
        location: feedVacancy.location,
        description: feedVacancy.description,
        about: feedVacancy.description,
        responsibilities: feedVacancy.responsibilities,
        requirements: feedVacancy.requirements,
        nice_to_have: feedVacancy.niceToHave,
        salary: feedVacancy.salary,
        discipline: feedVacancy.discipline,
        type: feedVacancy.type,
        posted: feedVacancy.posted,
      },
    });
  }

  // Fallback to static / legacy vacancy
  const list = t.raw("list") as Array<{
    id: string;
    title: string;
    location: string;
    description: string;
    about: string;
    responsibilities: string[];
    requirements: string[];
    nice_to_have: string[];
    salary: string;
  }>;
  const vacancyContent = list.find((v) => v.id === id);
  if (!vacancyContent) notFound();

  const staticData = vacancies.find((v) => v.id === id);
  if (!staticData) notFound();

  return renderVacancy({
    locale,
    t,
    vacancy: {
      ...vacancyContent,
      ...staticData,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderVacancy({ locale, t, vacancy }: { locale: string; t: any; vacancy: {
  id: string;
  title: string;
  location: string;
  description: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  salary: string;
  discipline: string;
  type: string;
  posted: string;
} }) {
  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(locale === "nl" ? "nl-NL" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const typeColors: Record<string, string> = {
    Contract: "border-blue-400/40 text-blue-300",
    Freelance: "border-purple-400/40 text-purple-300",
    Permanent: "border-green-400/40 text-green-300",
    Fulltime: "border-green-400/40 text-green-300",
  };

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: vacancy.about,
    datePosted: vacancy.posted,
    hiringOrganization: {
      "@id": ORG_ID,
      "@type": "Organization",
      name: "Q4S B.V.",
      sameAs: SITE_URL,
      logo: LOGO_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: vacancy.location,
        addressCountry: "NL",
      },
    },
    employmentType:
      vacancy.type === "Permanent" || vacancy.type === "Fulltime"
        ? "FULL_TIME"
        : vacancy.type === "Contract"
        ? "CONTRACTOR"
        : "OTHER",
    baseSalary: vacancy.salary
      ? { "@type": "MonetaryAmount", currency: "EUR", value: vacancy.salary }
      : undefined,
    industry: vacancy.discipline,
    occupationalCategory: vacancy.discipline,
    url: absoluteUrl(`/${locale === "nl" ? "nl/vacatures" : "en/vacancies"}/${vacancy.id}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(jobPostingSchema)}
      />
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-14 lg:pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
          <Link
            href="/vacancies"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/40 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            {t("detail.allVacancies")}
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {vacancy.discipline && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 border border-white/15 text-white/50">
                {vacancy.discipline}
              </span>
            )}
            {vacancy.type && (
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 border ${
                  typeColors[vacancy.type] ?? "border-white/15 text-white/50"
                }`}
              >
                {vacancy.type}
              </span>
            )}
          </div>

          <h1 className="text-[clamp(32px,5vw,72px)] font-black leading-[0.95] tracking-[-0.03em] text-white mb-6 max-w-3xl">
            {vacancy.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            {vacancy.location && (
              <span className="flex items-center gap-2">
                <MapPin size={14} />
                {vacancy.location}
              </span>
            )}
            {vacancy.type && (
              <span className="flex items-center gap-2">
                <Briefcase size={14} />
                {vacancy.type}
              </span>
            )}
            {vacancy.posted && (
              <span className="flex items-center gap-2">
                <Clock size={14} />
                {t("detail.postedOn")} {formatDate(vacancy.posted)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─── CONTENT ─── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Main content */}
            <div className="lg:col-span-8">
              <div className="mb-12">
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                  {t("detail.aboutRole")}
                </h2>
                <p className="text-base text-black/70 leading-relaxed">{vacancy.about}</p>
              </div>

              {vacancy.responsibilities.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                    {t("detail.responsibilities")}
                  </h2>
                  <ul className="space-y-3">
                    {vacancy.responsibilities.map((r, i) => (
                      <li key={i} className="flex gap-3 text-sm text-black/70 leading-relaxed">
                        <CheckCircle size={16} className="text-[#e8430a] mt-0.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vacancy.requirements.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                    {t("detail.requirements")}
                  </h2>
                  <ul className="space-y-3">
                    {vacancy.requirements.map((r, i) => (
                      <li key={i} className="flex gap-3 text-sm text-black/70 leading-relaxed">
                        <CheckCircle size={16} className="text-black/30 mt-0.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {vacancy.nice_to_have.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                    {t("detail.niceToHave")}
                  </h2>
                  <ul className="space-y-3">
                    {vacancy.nice_to_have.map((r, i) => (
                      <li key={i} className="flex gap-3 text-sm text-black/50 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-black/30 mt-2 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="border border-black/10 p-8 mb-6">
                  <h3 className="text-lg font-black text-black mb-2 tracking-[-0.02em]">
                    {t("detail.applyTitle")}
                  </h3>
                  <p className="text-sm text-black/50 leading-relaxed mb-6">
                    {t("detail.applyBody")}
                  </p>
                  <Link
                    href={{ pathname: "/upload-cv", query: { vacancy: vacancy.id } }}
                    className="group flex items-center justify-center gap-2 w-full py-3 bg-[#e8430a] text-white text-xs font-semibold uppercase tracking-[0.1em] hover:bg-[#c73508] transition-colors mb-3"
                  >
                    {t("detail.applyNow")}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/upload-cv"
                    className="flex items-center justify-center w-full py-3 border border-black/15 text-black text-xs font-semibold uppercase tracking-[0.1em] hover:border-black transition-colors"
                  >
                    {t("detail.uploadCv")}
                  </Link>
                </div>

                <div className="border border-black/10 p-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                    {t("detail.detailsTitle")}
                  </h3>
                  <dl className="space-y-4">
                    {vacancy.location && (
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                          {t("detail.location")}
                        </dt>
                        <dd className="text-sm font-medium text-black">{vacancy.location}</dd>
                      </div>
                    )}
                    {vacancy.type && (
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                          {t("detail.contractType")}
                        </dt>
                        <dd className="text-sm font-medium text-black">{vacancy.type}</dd>
                      </div>
                    )}
                    {vacancy.discipline && (
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                          {t("detail.discipline")}
                        </dt>
                        <dd className="text-sm font-medium text-black">{vacancy.discipline}</dd>
                      </div>
                    )}
                    {vacancy.salary && (
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                          {t("detail.compensation")}
                        </dt>
                        <dd className="text-sm font-medium text-black">{vacancy.salary}</dd>
                      </div>
                    )}
                    {vacancy.posted && (
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                          {t("detail.posted")}
                        </dt>
                        <dd className="text-sm font-medium text-black">{formatDate(vacancy.posted)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OTHER VACANCIES CTA ─── */}
      <section className="bg-black text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30 mb-2">
              {t("detail.seeMore")}
            </p>
            <h2 className="text-2xl font-black tracking-[-0.02em]">
              {t("detail.allOpenVacancies")}
            </h2>
          </div>
          <Link
            href="/vacancies"
            className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white font-semibold text-sm uppercase tracking-[0.1em] hover:border-white transition-colors shrink-0"
          >
            {t("detail.allVacanciesBtn")}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
