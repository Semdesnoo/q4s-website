import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  pathnames: {
    "/": "/",
    "/about": { nl: "/over-ons", en: "/about" },
    "/services": { nl: "/diensten", en: "/services" },
    "/way-we-work": { nl: "/onze-aanpak", en: "/way-we-work" },
    "/vacancies": { nl: "/vacatures", en: "/vacancies" },
    "/upload-cv": { nl: "/cv-uploaden", en: "/upload-cv" },
    "/ndt": "/ndt",
    "/news": { nl: "/nieuws", en: "/news" },
    "/news/[id]": { nl: "/nieuws/[id]", en: "/news/[id]" },
    "/vacancies/[id]": { nl: "/vacatures/[id]", en: "/vacancies/[id]" },
    "/contact": "/contact",
  },
});
