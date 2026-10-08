import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesFor } from "@/lib/alternates";
import { absoluteUrl } from "@/lib/site";
import type { routing } from "@/i18n/routing";

/** Deelbaar OG-plaatje (1200×630) voor elke pagina zonder eigen beeld. */
export const OG_IMAGE = { url: absoluteUrl("/og-image.png"), width: 1200, height: 630, alt: "Q4S" };

/**
 * Volledige Open Graph-set. Next vervangt `openGraph` per pagina in z'n geheel
 * (geen deep merge), dus siteName/locale/image moeten op elke pagina mee.
 */
export function openGraphFor(locale: string, path: string, title: string, description: string, extra: Record<string, unknown> = {}) {
  return {
    title,
    description,
    url: absoluteUrl(path),
    siteName: "Q4S",
    locale: locale === "nl" ? "nl_NL" : "en_US",
    alternateLocale: locale === "nl" ? "en_US" : "nl_NL",
    type: "website" as const,
    images: [OG_IMAGE],
    ...extra,
  };
}

/** Kort een tekst af tot een meta description (~155 tekens) op een woordgrens. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max - 1)).replace(/[,.;:\s]+$/, "") + "…";
}

/** Metadata voor een vaste pagina: title + description uit `seo.<page>` in messages. */
export async function pageMetadata(
  locale: string,
  page: string,
  route: keyof typeof routing.pathnames
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `seo.${page}` });
  const title = t("title");
  const description = t("description");
  const alternates = alternatesFor(route, locale);
  return {
    // absolute: de SEO-title bevat zelf al "| Q4S"; de layout-template zou hem verdubbelen.
    title: { absolute: title },
    description,
    alternates,
    openGraph: openGraphFor(locale, alternates.canonical, title, description),
  };
}
