import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { EmployerSteps, CandidateSteps } from "@/components/WayWeWorkSteps";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wayWeWork" });
  return { title: t("hero.title") };
}

export default function WayWeWorkPage() {
  const t = useTranslations("wayWeWork");
  const steps = t.raw("steps") as Array<{ step: string; title: string; desc: string }>;
  const candidateSteps = t.raw("forCandidates.steps") as Array<{
    step: string;
    title: string;
    desc: string;
  }>;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-8">
            Q4S Process
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

      {/* ─── FOR EMPLOYERS ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black mb-12">
            {t("forEmployersLabel")}
          </p>
          <EmployerSteps steps={steps} />
        </div>
      </section>

      {/* ─── FOR CANDIDATES ─── */}
      <section className="bg-black text-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60 mb-12">
            {t("forCandidates.title")}
          </p>
          <CandidateSteps steps={candidateSteps} />
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
                {t("cta.contact")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/upload-cv"
                className="group inline-flex items-center gap-2 px-6 py-3.5 border border-black/20 text-black font-semibold text-sm uppercase tracking-[0.1em] hover:border-black transition-colors"
              >
                {t("cta.uploadCv")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
