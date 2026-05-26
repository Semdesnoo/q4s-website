import type { MetadataRoute } from "next";
import { vacancies } from "@/lib/vacancies";

const base = "https://q4s.nl";

const staticRoutes: Array<{ nl: string; en: string; priority?: number }> = [
  { nl: "/nl",              en: "/en",              priority: 1.0 },
  { nl: "/nl/over-ons",    en: "/en/about",         priority: 0.8 },
  { nl: "/nl/diensten",    en: "/en/services",      priority: 0.9 },
  { nl: "/nl/onze-aanpak", en: "/en/way-we-work",   priority: 0.7 },
  { nl: "/nl/vacatures",   en: "/en/vacancies",     priority: 0.9 },
  { nl: "/nl/ndt",         en: "/en/ndt",           priority: 0.8 },
  { nl: "/nl/nieuws",      en: "/en/news",          priority: 0.7 },
  { nl: "/nl/contact",     en: "/en/contact",       priority: 0.8 },
  { nl: "/nl/cv-uploaden", en: "/en/upload-cv",     priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    const alternates = {
      languages: {
        nl: `${base}${route.nl}`,
        en: `${base}${route.en}`,
      },
    };
    entries.push(
      {
        url: `${base}${route.nl}`,
        lastModified: new Date(),
        priority: route.priority,
        alternates,
      },
      {
        url: `${base}${route.en}`,
        lastModified: new Date(),
        priority: route.priority,
        alternates,
      }
    );
  }

  for (const v of vacancies) {
    const alternates = {
      languages: {
        nl: `${base}/nl/vacatures/${v.id}`,
        en: `${base}/en/vacancies/${v.id}`,
      },
    };
    entries.push(
      {
        url: `${base}/nl/vacatures/${v.id}`,
        lastModified: new Date(v.posted),
        priority: 0.7,
        alternates,
      },
      {
        url: `${base}/en/vacancies/${v.id}`,
        lastModified: new Date(v.posted),
        priority: 0.7,
        alternates,
      }
    );
  }

  return entries;
}
