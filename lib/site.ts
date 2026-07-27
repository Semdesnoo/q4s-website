/**
 * Eén bron van waarheid voor het canonieke domein.
 *
 * De site draait live op www.q4s.nl — het apex-domein q4s.nl stuurt met een 307
 * door naar www. Canonicals, hreflang, sitemap-URL's en JSON-LD moeten daarom
 * allemaal naar www wijzen. Wees je bewust: als hier "https://q4s.nl" staat,
 * wijst élke canonical op de site naar een redirect en negeert Google ze.
 *
 * Wil je later terug naar het apex-domein? Wijzig deze constante én zet in
 * Vercel q4s.nl als primair domein (www.q4s.nl -> q4s.nl in plaats van andersom).
 */
export const SITE_URL = "https://www.q4s.nl";

/** Bouwt een absolute URL vanaf een pad: "/nl/diensten" -> "https://www.q4s.nl/nl/diensten". */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Organisatielogo voor JSON-LD (Organization, JobPosting, Article).
 * Moet naar een bestaand, publiek bereikbaar bestand wijzen — Google haalt deze
 * URL daadwerkelijk op en laat het schema-veld vallen als hij 404't.
 */
export const LOGO_URL = absoluteUrl("/Q4S-Transparent.png");
