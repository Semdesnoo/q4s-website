import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";

/**
 * 404 voor URL's die geen enkele route raken (bv. /onzin of /oude-pagina.html).
 *
 * Nodig omdat de root layout in een dynamisch segment zit (app/[locale]/layout.tsx).
 * Next kan daar geen consistente 404 uit samenstellen en viel terug op de kale
 * root-layout — die geen <html>/<body> rendert. Resultaat was malformed HTML met
 * twee <title>-tags.
 *
 * Dit bestand omzeilt de normale rendering, dus styles en font moeten hier zelf
 * geïmporteerd worden. Bewust één font-gewicht: dit is een foutpagina.
 */
const inter = Inter({ subsets: ["latin"], display: "swap", weight: ["400", "900"] });

export const metadata: Metadata = {
  title: "404 — Pagina niet gevonden | Q4S",
  description: "Deze pagina bestaat niet. Ga terug naar q4s.nl voor technische detachering en werving.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="nl" className={inter.className}>
      <body className="bg-[#0d1f3c] text-white antialiased">
        <main className="min-h-screen flex items-center">
          <div className="max-w-[1280px] mx-auto px-6 py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8430a] mb-8">
              404
            </p>
            <div className="flex gap-5 items-stretch">
              <div className="w-1 bg-[#e8430a] shrink-0 self-stretch rounded-sm" />
              <h1 className="text-[clamp(36px,6vw,80px)] font-black leading-[0.95] tracking-[-0.04em] max-w-3xl">
                Deze pagina bestaat niet
              </h1>
            </div>
            <p className="text-lg text-white/70 max-w-xl mt-8 leading-relaxed">
              De pagina die u zoekt is verplaatst, hernoemd of heeft nooit bestaan.
            </p>
            <a
              href="/nl"
              className="inline-flex items-center gap-2 mt-10 px-6 py-3.5 bg-[#e8430a] text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#c73508] transition-colors"
            >
              Terug naar home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
