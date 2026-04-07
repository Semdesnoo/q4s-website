import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, MapPin, Clock, Briefcase, CheckCircle } from "lucide-react";
import { vacancies } from "@/lib/vacancies";

export async function generateStaticParams() {
  return vacancies.map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "vacancies" });
  const list = t.raw("list") as Array<{ id: string; title: string }>;
  const vacancy = list.find((v) => v.id === id);
  if (!vacancy) return { title: t("noResults") };
  return { title: `${vacancy.title} | ${t("hero.label")}` };
}

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "vacancies" });

  // Get translated content from JSON
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

  // Get static fields (type, discipline, posted)
  const staticData = vacancies.find((v) => v.id === id);
  if (!staticData) notFound();

  const vacancy = { ...vacancyContent, ...staticData };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(locale === "nl" ? "nl-NL" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const typeColors: Record<string, string> = {
    Contract: "border-blue-400/40 text-blue-300",
    Freelance: "border-purple-400/40 text-purple-300",
    Permanent: "border-green-400/40 text-green-300",
  };

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
          <Link
            href="/vacancies"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/40 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            {t("detail.allVacancies")}
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 border border-white/15 text-white/50">
              {vacancy.discipline}
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 border ${
                typeColors[vacancy.type] ?? "border-white/15 text-white/50"
              }`}
            >
              {vacancy.type}
            </span>
          </div>

          <h1 className="text-[clamp(32px,5vw,72px)] font-black leading-[0.95] tracking-[-0.03em] text-white mb-6 max-w-3xl">
            {vacancy.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <MapPin size={14} />
              {vacancy.location}
            </span>
            <span className="flex items-center gap-2">
              <Briefcase size={14} />
              {vacancy.type}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {t("detail.postedOn")} {formatDate(vacancy.posted)}
            </span>
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
                    href={{ pathname: "/contact", query: { vacancy: vacancy.id } }}
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
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {t("detail.location")}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.location}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {t("detail.contractType")}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.type}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {t("detail.discipline")}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.discipline}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {t("detail.compensation")}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.salary}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {t("detail.posted")}
                      </dt>
                      <dd className="text-sm font-medium text-black">{formatDate(vacancy.posted)}</dd>
                    </div>
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
