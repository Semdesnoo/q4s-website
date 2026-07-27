import { routing } from "@/i18n/routing";

/**
 * Genereert het `alternates`-blok (canonical + hreflang) voor een route.
 *
 * Waarom dit bestaat: Next merget metadata **shallow**. Een `generateMetadata`
 * die alleen `{ title }` teruggeeft, erft daardoor het `alternates`-blok van
 * app/[locale]/layout.tsx — en dat wijst naar de homepage. De pagina verklaart
 * zichzelf dan duplicaat van `/nl` en verdwijnt uit de index. Dat is precies wat
 * er met /cv-uploaden en /en/upload-cv gebeurde.
 *
 * Gebruik dit in ELKE `generateMetadata`. De paden komen uit i18n/routing.ts,
 * dus ze kunnen niet uit de pas lopen met de echte routes.
 */

type Locale = (typeof routing.locales)[number];
type RouteKey = keyof typeof routing.pathnames;

/** Bouwt het locale-geprefixte pad voor één taal, bv. "/nl/diensten". */
function localizedPath(
  key: RouteKey,
  locale: Locale,
  params?: Record<string, string>
): string {
  const entry = routing.pathnames[key] as string | Record<Locale, string>;
  let path = typeof entry === "string" ? entry : entry[locale];

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      path = path.replace(`[${name}]`, value);
    }
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * @param key    routesleutel uit i18n/routing.ts, bv. "/services" of "/news/[id]"
 * @param locale de huidige taal
 * @param params waarden voor dynamische segmenten, bv. `{ id: "v1" }`
 */
export function alternatesFor(
  key: RouteKey,
  locale: string,
  params?: Record<string, string>
) {
  const nl = localizedPath(key, "nl", params);
  const en = localizedPath(key, "en", params);

  return {
    canonical: locale === "nl" ? nl : en,
    // x-default wijst naar NL: dat is de defaultLocale en de primaire markt.
    languages: { "x-default": nl, nl, en },
  };
}
