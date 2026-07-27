import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

/**
 * 404 binnen een locale-route — bijvoorbeeld een vacature- of artikel-id dat
 * niet bestaat. Rendert binnen app/[locale]/layout.tsx, dus mét header en
 * footer. Volledig onbekende paden (die geen enkele route raken) komen bij
 * app/global-not-found.tsx terecht.
 */
export default async function LocaleNotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  const links = [
    { href: "/vacancies" as const, label: t("vacancies") },
    { href: "/services" as const, label: t("services") },
    { href: "/contact" as const, label: t("contact") },
    { href: "/" as const, label: t("home") },
  ];

  return (
    <section className="bg-[#0d1f3c] text-white pt-14 lg:pt-[68px]">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-8">
          {t("label")}
        </p>
        <div className="flex gap-5 items-stretch">
          <div className="w-1 bg-[#e8430a] shrink-0 self-stretch rounded-sm" />
          <h1 className="text-[clamp(36px,6vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-3xl">
            {t("title")}
          </h1>
        </div>
        <p className="text-lg text-white/70 max-w-xl mt-8 leading-relaxed">{t("body")}</p>

        <ul className="mt-12 border-t border-white/10 max-w-xl">
          {links.map(({ href, label }) => (
            <li key={href} className="border-b border-white/10">
              <Link
                href={href}
                className="group flex items-center justify-between py-5 text-base font-semibold text-white/80 hover:text-[#e8430a] transition-colors"
              >
                {label}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
