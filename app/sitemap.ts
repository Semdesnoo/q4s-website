import type { MetadataRoute } from "next";
import { vacancies } from "@/lib/vacancies";

const base = "https://q4s.nl";

type SitemapEntry = {
  nl: string;
  en: string;
  priority?: number;
  changeFrequency?: MetadataRoute.Sitemap[0]["changeFrequency"];
};

const staticRoutes: SitemapEntry[] = [
  { nl: "/nl",             en: "/en",             priority: 1.0,  changeFrequency: "daily"   },
  { nl: "/nl/diensten",    en: "/en/services",    priority: 1.0,  changeFrequency: "weekly"  },
  { nl: "/nl/vacatures",   en: "/en/vacancies",   priority: 0.95, changeFrequency: "daily"   },
  { nl: "/nl/ndt",         en: "/en/ndt",         priority: 0.85, changeFrequency: "monthly" },
  { nl: "/nl/over-ons",    en: "/en/about",       priority: 0.8,  changeFrequency: "monthly" },
  { nl: "/nl/nieuws",      en: "/en/news",        priority: 0.8,  changeFrequency: "weekly"  },
  { nl: "/nl/contact",     en: "/en/contact",     priority: 0.8,  changeFrequency: "monthly" },
  { nl: "/nl/onze-aanpak", en: "/en/way-we-work", priority: 0.7,  changeFrequency: "monthly" },
  { nl: "/nl/cv-uploaden", en: "/en/upload-cv",   priority: 0.6,  changeFrequency: "monthly" },
];

const newsArticles = [
  { id: "1", date: "2026-03-15" },
  { id: "2", date: "2026-02-28" },
  { id: "3", date: "2026-02-10" },
  { id: "4", date: "2026-01-20" },
  { id: "5", date: "2026-01-05" },
  { id: "6", date: "2025-12-18" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    const alternates = {
      languages: {
        "x-default": `${base}${route.nl}`,
        nl: `${base}${route.nl}`,
        en: `${base}${route.en}`,
      },
    };
    entries.push(
      {
        url: `${base}${route.nl}`,
        lastModified: new Date(),
        priority: route.priority,
        changeFrequency: route.changeFrequency,
        alternates,
      },
      {
        url: `${base}${route.en}`,
        lastModified: new Date(),
        priority: route.priority,
        changeFrequency: route.changeFrequency,
        alternates,
      }
    );
  }

  for (const v of vacancies) {
    const alternates = {
      languages: {
        "x-default": `${base}/nl/vacatures/${v.id}`,
        nl: `${base}/nl/vacatures/${v.id}`,
        en: `${base}/en/vacancies/${v.id}`,
      },
    };
    entries.push(
      {
        url: `${base}/nl/vacatures/${v.id}`,
        lastModified: new Date(v.posted),
        priority: 0.8,
        changeFrequency: "weekly",
        alternates,
      },
      {
        url: `${base}/en/vacancies/${v.id}`,
        lastModified: new Date(v.posted),
        priority: 0.8,
        changeFrequency: "weekly",
        alternates,
      }
    );
  }

  for (const article of newsArticles) {
    const alternates = {
      languages: {
        "x-default": `${base}/nl/nieuws/${article.id}`,
        nl: `${base}/nl/nieuws/${article.id}`,
        en: `${base}/en/news/${article.id}`,
      },
    };
    entries.push(
      {
        url: `${base}/nl/nieuws/${article.id}`,
        lastModified: new Date(article.date),
        priority: 0.6,
        changeFrequency: "monthly",
        alternates,
      },
      {
        url: `${base}/en/news/${article.id}`,
        lastModified: new Date(article.date),
        priority: 0.6,
        changeFrequency: "monthly",
        alternates,
      }
    );
  }

  return entries;
}
