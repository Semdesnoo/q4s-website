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
  const vacancy = vacancies.find((v) => v.id === id);
  if (!vacancy) return { title: t("noResults") };
  return { title: `${vacancy.title} | ${t("hero.label")}` };
}

export default async function VacancyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const vacancy = vacancies.find((v) => v.id === id);
  if (!vacancy) notFound();

  const t = await getTranslations({ locale, namespace: "vacancies" });

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
          {/* Breadcrumb */}
          <Link
            href="/vacancies"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/40 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            {locale === "nl" ? "Alle vacatures" : "All vacancies"}
          </Link>

          {/* Badges */}
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
              {locale === "nl" ? "Geplaatst op" : "Posted on"} {formatDate(vacancy.posted)}
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
              {/* About */}
              <div className="mb-12">
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                  {locale === "nl" ? "Over de functie" : "About the role"}
                </h2>
                <p className="text-base text-black/70 leading-relaxed">{vacancy.about}</p>
              </div>

              {/* Responsibilities */}
              <div className="mb-12">
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                  {locale === "nl" ? "Werkzaamheden" : "Responsibilities"}
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

              {/* Requirements */}
              <div className="mb-12">
                <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                  {locale === "nl" ? "Functie-eisen" : "Requirements"}
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

              {/* Nice to have */}
              {vacancy.nice_to_have.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                    {locale === "nl" ? "Pré" : "Nice to have"}
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
                {/* Apply card */}
                <div className="border border-black/10 p-8 mb-6">
                  <h3 className="text-lg font-black text-black mb-2 tracking-[-0.02em]">
                    {locale === "nl" ? "Direct solliciteren" : "Apply now"}
                  </h3>
                  <p className="text-sm text-black/50 leading-relaxed mb-6">
                    {locale === "nl"
                      ? "Stuur uw CV en motivatie naar ons toe of neem contact op voor meer informatie."
                      : "Send us your CV and motivation, or get in touch for more information."}
                  </p>
                  <Link
                    href={{ pathname: "/contact", query: { vacancy: vacancy.id } }}
                    className="group flex items-center justify-center gap-2 w-full py-3 bg-[#e8430a] text-white text-xs font-semibold uppercase tracking-[0.1em] hover:bg-[#c73508] transition-colors mb-3"
                  >
                    {locale === "nl" ? "Solliciteer nu" : "Apply now"}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/upload-cv"
                    className="flex items-center justify-center w-full py-3 border border-black/15 text-black text-xs font-semibold uppercase tracking-[0.1em] hover:border-black transition-colors"
                  >
                    {locale === "nl" ? "CV uploaden" : "Upload CV"}
                  </Link>
                </div>

                {/* Details card */}
                <div className="border border-black/10 p-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.15em] text-black mb-5">
                    {locale === "nl" ? "Details" : "Details"}
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {locale === "nl" ? "Locatie" : "Location"}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.location}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {locale === "nl" ? "Contractvorm" : "Contract type"}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.type}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {locale === "nl" ? "Discipline" : "Discipline"}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.discipline}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {locale === "nl" ? "Vergoeding" : "Compensation"}
                      </dt>
                      <dd className="text-sm font-medium text-black">{vacancy.salary}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30 mb-1">
                        {locale === "nl" ? "Geplaatst" : "Posted"}
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
              {locale === "nl" ? "Meer bekijken" : "See more"}
            </p>
            <h2 className="text-2xl font-black tracking-[-0.02em]">
              {locale === "nl" ? "Bekijk alle openstaande vacatures" : "View all open vacancies"}
            </h2>
          </div>
          <Link
            href="/vacancies"
            className="group inline-flex items-center gap-2 px-6 py-3.5 border border-white/20 text-white font-semibold text-sm uppercase tracking-[0.1em] hover:border-white transition-colors shrink-0"
          >
            {locale === "nl" ? "Alle vacatures" : "All vacancies"}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </>
  );
}
