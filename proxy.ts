import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const handleI18n = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18n(request);
}

export const config = {
  matcher: [
    // Sla alles over wat een puntje in het laatste pad-segment heeft, dus élk
    // bestand: robots.txt, sitemap.xml, llms.txt, de SNA-PDF, afbeeldingen en
    // video. De vorige matcher somde alleen afbeeldings-extensies op, waardoor
    // /robots.txt en /sitemap.xml door de i18n-middleware naar /nl/robots.txt
    // werden gestuurd en met een 404 eindigden — Google kon de sitemap dus
    // nooit ophalen. Een extensielijst vergeet je altijd; "bevat een punt" niet.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
