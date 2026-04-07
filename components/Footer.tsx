import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-black text-white">
      {/* Top border line */}
      <div className="border-t border-white/10" />

      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/Q4S-Transparent.png"
              alt="Q4S"
              width={120}
              height={60}
              className="h-14 w-auto object-contain invert mb-6"
            />
            <p className="text-base text-white/70 leading-relaxed max-w-[200px]">
              {t("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80 mb-5">
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
                      className="text-base text-white/75 hover:text-white transition-colors duration-200"
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
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80 mb-5">
              {t("forEmployers.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/vacancies" className="text-base text-white/75 hover:text-white transition-colors duration-200">
                  {t("forEmployers.findTalent")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-base text-white/75 hover:text-white transition-colors duration-200">
                  {t("forEmployers.services")}
                </Link>
              </li>
              <li>
                <Link href="/ndt" className="text-base text-white/75 hover:text-white transition-colors duration-200">
                  {t("forCandidates.ndt")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-white/75 hover:text-white transition-colors duration-200">
                  {t("forEmployers.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80 mb-5">
              {t("forCandidates.title")}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/vacancies" className="text-base text-white/75 hover:text-white transition-colors duration-200">
                  {t("forCandidates.vacancies")}
                </Link>
              </li>
              <li>
                <Link href="/upload-cv" className="text-base text-white/75 hover:text-white transition-colors duration-200">
                  {t("forCandidates.uploadCv")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Certificates */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white mb-5">
            Certificeringen &amp; Keurmerken
          </p>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            {[
              {
                label: "ISO 9001:2015",
                sub: "Gecertificeerd",
                href: "https://docs.google.com/viewerng/viewer?url=http://q4s.nl/onewebmedia/ISO-9001-251980-2017-AQ-NLD-RvA-3-en-US-20240131-20240131144352.pdf",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                ),
              },
              {
                label: "VCU",
                sub: "Veiligheid Gecertificeerd",
                href: "https://docs.google.com/viewerng/viewer?url=http://q4s.nl/onewebmedia/Signed_Cert_276993-2018-ASCC-NLD-RvA_ENG-20220210-20220211082743.pdf&_r=1",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                ),
              },
              {
                label: "SNA",
                sub: "NEN 4400-1",
                href: "https://docs.google.com/viewerng/viewer?url=http://q4s.nl/onewebmedia/SNA_VerklaringVanRegistratie%25209-05-2023.pdf",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                ),
              },
            ].map(({ label, sub, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 px-2 sm:px-4 py-3 border border-white/15 hover:border-white/50 hover:bg-white/5 transition-all duration-200 text-center sm:text-left"
              >
                <span className="text-white/50 group-hover:text-white transition-colors duration-200 shrink-0">
                  {icon}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-black text-white leading-none">{label}</p>
                  <p className="text-[10px] sm:text-[11px] text-white/40 group-hover:text-white/60 mt-0.5 transition-colors">{sub}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-white/60">
            Powered by Q4S
          </p>
          <div className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-6">
            <a href="mailto:info@q4s.nl" className="text-sm text-white/60 hover:text-white transition-colors duration-200">{t("email")}</a>
            <a href="tel:+31857826818" className="text-sm text-white/60 hover:text-white transition-colors duration-200">{t("phone")}</a>
            <span className="text-sm text-white/60">{t("kvk")}</span>
            <span className="text-sm text-white/60">{t("btw")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
