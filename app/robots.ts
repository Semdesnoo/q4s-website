import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    // Geen `host:` — die directive is Yandex-only; Google en Bing negeren hem.
    // De hostkeuze hoort in de canonicals (lib/site.ts) en in Vercel Domains.
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
