import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import UploadCvForm from "@/components/UploadCvForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "uploadCv" });
  return { title: t("hero.title") };
}

export default async function UploadCvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "uploadCv" });
  const whyItems = t.raw("why.items") as string[];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-8">
            Q4S Kandidaten
          </p>
          <h1 className="text-[clamp(48px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-white/75 max-w-xl mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ─── FORM SECTION ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2 border border-black/10 p-8 lg:p-10">
              <h2 className="text-2xl font-black text-black mb-2 tracking-[-0.03em]">{t("hero.title")}</h2>
              <p className="text-base text-black/65 mb-8 leading-relaxed">{t("intro")}</p>
              <UploadCvForm
                t={{
                  firstName: t("form.firstName"),
                  lastName: t("form.lastName"),
                  email: t("form.email"),
                  phone: t("form.phone"),
                  discipline: t("form.discipline"),
                  experience: t("form.experience"),
                  availability: t("form.availability"),
                  location: t("form.location"),
                  message: t("form.message"),
                  cvUpload: t("form.cvUpload"),
                  cvUploadDesc: t("form.cvUploadDesc"),
                  submit: t("form.submit"),
                  submitting: t("form.submitting"),
                  success: t("form.success"),
                  error: t("form.error"),
                  required: t("form.required"),
                  disciplines: t.raw("form.disciplines") as string[],
                  availabilities: t.raw("form.availabilities") as string[],
                }}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-0 border-t border-black/10">
              <div className="py-8 border-b border-black/10">
                <h3 className="text-xl font-black text-black tracking-[-0.02em] mb-5">
                  {t("why.title")}
                </h3>
                <ul className="space-y-4">
                  {whyItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e8430a] mt-2 shrink-0" />
                      <span className="text-base text-black/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="py-8">
                <h3 className="text-xl font-black text-black tracking-[-0.02em] mb-4">
                  Direct bellen?
                </h3>
                <p className="text-base text-black/75 mb-5 leading-relaxed">
                  Neem direct contact op met een van onze recruiters.
                </p>
                <a
                  href="tel:+31857826818"
                  className="block text-center py-3 bg-black text-white text-xs font-semibold uppercase tracking-[0.12em] hover:bg-black/80 transition-colors"
                >
                  +31 (0) 85 7826818
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
