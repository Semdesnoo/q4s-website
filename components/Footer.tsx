import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-[#000000] text-white">
      <div className="border-t border-white/8" />

      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/q4slogoOriginalNEW.jpg"
              alt="Q4S"
              width={150}
              height={111}
              className="h-14 w-auto object-contain invert mb-6"
            />
            <p className="text-base text-white/60 leading-relaxed max-w-[200px]">
              {t("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/70 mb-5">
              {t("links.title")}
            </h3>
            <ul className="space-y-3">
              {(["home", "about", "wayWeWork", "news", "contact"] as const).map((k) => {
                const hrefs: Record<string, string> = {
                  home: "/",
                  about: "/about",
                  wayWeWork: "/way-we-work",
                  news: "/news",
                  contact: "/contact",
                };
                return (
                  <li key={k}>
                    <Link
                      href={hrefs[k] as "/"}
                      className="text-base text-white/55 hover:text-white transition-colors duration-200"
                    >
                      {t(`links.${k}` as Parameters<typeof t>[0])}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/70 mb-5">
              {t("forEmployers.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/vacancies" className="text-base text-white/55 hover:text-white transition-colors duration-200">
                  {t("forEmployers.findTalent")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-base text-white/55 hover:text-white transition-colors duration-200">
                  {t("forEmployers.services")}
                </Link>
              </li>
              <li>
                <Link href={{ pathname: "/services", hash: "ndt" }} className="text-base text-white/55 hover:text-white transition-colors duration-200">
                  {t("forCandidates.ndt")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-white/55 hover:text-white transition-colors duration-200">
                  {t("forEmployers.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/70 mb-5">
              {t("forCandidates.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/vacancies" className="text-base text-white/55 hover:text-white transition-colors duration-200">
                  {t("forCandidates.vacancies")}
                </Link>
              </li>
              <li>
                <Link href="/upload-cv" className="text-base text-white/55 hover:text-white transition-colors duration-200">
                  {t("forCandidates.uploadCv")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Certificates */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-5">
            {t("certificationsTitle")}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              {
                label: "ISO 9001:2015 — DNV",
                href: "https://docs.google.com/viewerng/viewer?url=http://q4s.nl/onewebmedia/ISO-9001-251980-2017-AQ-NLD-RvA-3-en-US-20240131-20240131144352.pdf",
                logo: "/logos/cert/dnv-white.png",
              },
              {
                label: "VCU",
                href: "https://docs.google.com/viewerng/viewer?url=http://q4s.nl/onewebmedia/Signed_Cert_276993-2018-ASCC-NLD-RvA_ENG-20220210-20220211082743.pdf&_r=1",
                logo: "/logos/cert/vcu-white.png",
              },
              {
                label: "SNA — NEN 4400-1",
                href: "/SNA_VerklaringVanRegistratie.pdf",
                logo: "/logos/cert/sna-white.png",
              },
            ].map(({ label, href, logo }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="group flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-white/12 hover:border-[#e8430a] hover:bg-white/5 transition-all duration-200"
              >
                <Image
                  src={logo}
                  alt={label}
                  width={64}
                  height={64}
                  className="max-h-14 max-w-14 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            {t("poweredBy")}
          </p>
          <div className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="mailto:info@q4s.nl" className="text-sm text-white/40 hover:text-white transition-colors duration-200">{t("email")}</a>
            <a href="tel:+31857826818" className="text-sm text-white/40 hover:text-white transition-colors duration-200">{t("phone")}</a>
            <span className="text-sm text-white/40">{t("kvk")}</span>
            <span className="text-sm text-white/40">{t("btw")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
