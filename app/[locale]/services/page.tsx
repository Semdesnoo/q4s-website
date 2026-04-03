import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight, CheckCircle } from "lucide-react";
import ServiceItems from "@/components/ServiceItems";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("hero.title") };
}

export default function ServicesPage() {
  const t = useTranslations("services");
  const items = t.raw("items") as Array<{
    id: string;
    title: string;
    desc: string;
    features: string[];
  }>;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-8">
            Q4S Services
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

      {/* ─── SERVICE ITEMS ─── */}
      <section className="bg-white py-8 pb-24 lg:pb-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <ServiceItems items={items} />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-black text-white py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div>
              <h2 className="text-[clamp(32px,4.5vw,64px)] font-black leading-[0.95] tracking-[-0.04em] mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-white/75 max-w-lg leading-relaxed">{t("cta.body")}</p>
            </div>
            <div className="shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#e8430a] text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#c73508] transition-colors duration-200"
              >
                {t("cta.button")}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
