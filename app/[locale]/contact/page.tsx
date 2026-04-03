import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("hero.title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-8">
            Q4S
          </p>
          <h1 className="text-[clamp(48px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-white/75 max-w-xl mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Contact details */}
            <div className="space-y-0 border-t border-black/10">
              <div className="py-8 border-b border-black/10">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-5">
                  {t("details.title")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-black/50 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-base font-black text-black">Q4S B.V.</p>
                      <p className="text-base text-black/70">{t("details.address")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-black/50 shrink-0" />
                    <a href="mailto:info@q4s.nl" className="text-base font-semibold text-black hover:text-black/50 transition-colors">
                      {t("details.email")}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-black/50 shrink-0" />
                    <a href="tel:+31857826818" className="text-base font-semibold text-black hover:text-black/50 transition-colors">
                      {t("details.phone")}
                    </a>
                  </div>
                  <div className="pt-3 border-t border-black/5 text-sm text-black/50 space-y-1">
                    <p>{t("details.kvk")}</p>
                    <p>{t("details.btw")}</p>
                  </div>
                </div>
              </div>

              <div className="py-8 border-b border-black/10">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4">
                  {t("forEmployers.title")}
                </h3>
                <p className="text-base text-black/80 mb-4 leading-relaxed">{t("forEmployers.body")}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black hover:text-black/50 transition-colors"
                >
                  Onze diensten <ArrowRight size={12} />
                </Link>
              </div>

              <div className="py-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4">
                  {t("forCandidates.title")}
                </h3>
                <p className="text-base text-black/80 mb-4 leading-relaxed">{t("forCandidates.body")}</p>
                <Link
                  href="/upload-cv"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-black hover:text-black/50 transition-colors"
                >
                  CV uploaden <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 border border-black/10 p-8 lg:p-10">
              <ContactForm
                t={{
                  title: t("form.title"),
                  name: t("form.name"),
                  email: t("form.email"),
                  subject: t("form.subject"),
                  subjects: t.raw("form.subjects") as string[],
                  message: t("form.message"),
                  submit: t("form.submit"),
                  submitting: t("form.submitting"),
                  success: t("form.success"),
                  error: t("form.error"),
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
