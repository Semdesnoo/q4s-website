# Q4S SEO-implementatieroadmap

130 bevindingen → 34 uitvoerbare items. Gededupliceerd, gefaseerd, met exacte bestandspaden.

**Volgorde-afhankelijkheden die je niet mag omdraaien:**
1. `proxy.ts`-matcher vóór alles wat op `/robots.txt`, `/sitemap.xml`, `/llms.txt`, PDF's of root-metadata leunt.
2. Hostkeuze (apex vs www) vóór elke schema-, canonical- of sitemap-wijziging.
3. JSON-LD-escaping vóór de HTML-`description` in JobPosting (anders breekt `</ul>` het script-blok).
4. `alternates`-fix op `upload-cv` vóór elke nieuwe route (het patroon dat je kopieert moet kloppen).
5. Content schrijven vóór URL's splitsen (4 lege URL's ranken slechter dan 1 volle).

---

## FASE 1 — Fundament (deze week)

### 1.1 `proxy.ts`-matcher — herstelt robots.txt, sitemap.xml, llms.txt én alle PDF's
**Effort: S · Blocker voor 6 andere items**

**Mechanisme:** de matcher sluit alleen afbeeldings-/video-extensies uit. Elk `.txt`, `.xml` en `.pdf` gaat door next-intl's middleware, wordt naar `/nl/<pad>` geredirect, en die route bestaat niet → 404. Google krijgt de sitemap dus nooit; 38 URL's worden alleen via interne links ontdekt. De SNA-verklaring — het zwaarste trustbewijs van een detacheerder — is een dode link op élke pagina.

**Bestand:** `proxy.ts:11-15`

```ts
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

Dit is de officiële next-intl-variant: alles met een punt valt buiten de proxy. Toekomstige assets zijn automatisch gedekt; je hoeft nooit meer een extensie na te lopen. `/media/home/hero/hero.mp4` blijft uitgesloten (bevat een punt).

**Verificatie:** `curl -sIL https://q4s.nl/robots.txt` → 200 `text/plain`; idem `/sitemap.xml` (200 `application/xml`), `/llms.txt`, `/SNA_VerklaringVanRegistratie.pdf`.

> Nuance: een 404 op robots.txt betekent voor Google "alles toegestaan", dus crawling loopt nu gewoon door. De échte schade is uitsluitend dat de sitemap nergens bereikbaar is.

---

### 1.2 Eén host: apex of www — nu wijst alles naar de verkeerde
**Effort: S (bij apex-keuze) / M (bij www-keuze)**

**Mechanisme:** productie serveert `www.q4s.nl`, alle canonicals/hreflang/sitemap-URL's/JSON-LD zeggen `https://q4s.nl`. Een sitemap op www die uitsluitend apex-URL's bevat wordt door Google als cross-host genegeerd. Alle 38 URL's rapporteren straks als "Pagina met omleiding" in GSC.

**Goedkoopste route: maak `q4s.nl` (apex) de primary domain in Vercel Domains** en laat `www` 308'en naar apex. Dan klopt de bestaande code in één klap en hoef je geen regel te wijzigen. Dit is een Vercel-dashboardactie, geen code.

**Kies je toch www**, dan moet je deze plekken aanraken:

| Bestand | Regel |
|---|---|
| `app/[locale]/layout.tsx` | 45 (`metadataBase`), 94 (`url`), 95 (`logo`) |
| `app/sitemap.ts` | 4 (`const base`) |
| `app/robots.ts` | 8 (`sitemap:`) |
| `app/[locale]/vacancies/[id]/page.tsx` | 92, 93, 114 |
| `app/[locale]/news/[id]/page.tsx` | 156, 161, 162, 164, 169 |
| `public/llms.txt` | 17× `q4s.nl` |

Maak in dat geval `lib/site.ts` met `export const SITE_URL = "https://www.q4s.nl";` en importeer die overal, zodat het niet opnieuw uiteenloopt.

---

### 1.3 Dubbele hreflang-annotatie uitzetten
**Effort: S · Na 1.2**

**Mechanisme:** `alternateLinks` staat in next-intl standaard op `true`, dus de proxy zet een HTTP `Link`-header met hreflang op de wwww-host, terwijl de HTML hreflang op apex zet — met een andere `x-default` (`/diensten` vs `/nl/diensten`). Twee tegenstrijdige clusters per URL, beide met redirectende bestemmingen.

**Bestand:** `i18n/routing.ts` — voeg toe naast `locales`/`defaultLocale`:
```ts
alternateLinks: false,
localeDetection: false,
localeCookie: false,
```
- `alternateLinks: false` → alleen de expliciete HTML-hreflang uit `generateMetadata` blijft over (die is compleet, dus nul risico).
- `localeDetection: false` → `/` gaat deterministisch naar `/nl` in plaats van op basis van `Accept-Language`. De root-response zet nu `Set-Cookie: NEXT_LOCALE` zonder `Vary: Accept-Language` — een cache-correctheidsfout die gevaarlijk wordt zodra caching gaat werken.
- `localeCookie: false` → noodzakelijk voor item 1.11; zolang de proxy op elke response een cookie zet, blijft de edge-cache omzeild.

**Verificatie:** `curl -sI https://q4s.nl/nl/diensten` mag geen `link: ...hreflang=...`-header meer bevatten.

---

### 1.4 `/cv-uploaden` canonicaliseert naar de homepage
**Effort: S · Blocker voor élke nieuwe route**

**Mechanisme:** `generateMetadata` retourneert alleen `{ title }`. Next merget metadata **shallow**, dus het `alternates`-blok van de locale-layout blijft staan → `<link rel="canonical" href="https://q4s.nl/nl">` op `/nl/cv-uploaden` én `/en/upload-cv`. Beide conversiepagina's verklaren zichzelf duplicaat van de homepage, terwijl ze wél in de sitemap staan. De opdrachtgever-CTA in de header stuurt hierheen.

**Bestand:** `app/[locale]/upload-cv/page.tsx:8-16`. Neem het patroon uit `services/page.tsx:15-30` letterlijk over:

```ts
return {
  title: t("hero.title"),
  description: locale === "nl"
    ? "Technisch personeel nodig of zelf op zoek naar een opdracht? Meld uw opdracht of upload uw CV bij Q4S — QA/QC, NDT en inspectie. Reactie binnen 24 uur."
    : "...",
  alternates: {
    canonical: locale === "nl" ? "/nl/cv-uploaden" : "/en/upload-cv",
    languages: {
      "x-default": "/nl/cv-uploaden",
      nl: "/nl/cv-uploaden",
      en: "/en/upload-cv",
    },
  },
  openGraph: { title: ..., description: ... },
};
```

**Structureel beter (doe dit meteen):** maak `lib/alternates.ts` die uit `i18n/routing.ts` de pathnames afleidt en het `alternates`-object genereert. Een vergeten override canonicaliseert dan nooit meer stilzwijgend naar de homepage. Dit is een harde voorwaarde voor Fase 2 — elke nieuwe landingspagina zonder eigen `alternates` is dood bij geboorte.

---

### 1.5 Logo-URL in alle JSON-LD is een 404
**Effort: S**

**Mechanisme:** `https://q4s.nl/q4s-logo.png` bestaat niet (public/ bevat alleen `Q4S-Transparent.png` en `q4slogoOriginalNEW.jpg`). Raakt 22 pagina's: Organization (elke pagina), JobPosting `hiringOrganization.logo` (5 vacatures × 2 talen), Article `publisher.logo` (6 × 2). Google for Jobs toont dan een lege plek naast elke Q4S-vacature terwijl Indeed/LinkedIn-listings wél een logo tonen.

**Aanpak:** maak één schoon `public/q4s-logo.png` van **512×512, <40 KB**, transparant. Hernoem `Q4S-Transparent.png` níet — dat is 2000×2000 / 263 KB.

Gebruik hetzelfde bestand meteen als:
- `app/icon.png` (nu 2000×2000, 270 KB, letterlijk identiek aan Q4S-Transparent.png, wordt ongeoptimaliseerd geserveerd met `sizes="2000x2000"`) → vervang door 96×96, <5 KB. Voeg `app/icon.svg` toe voor schaalbaarheid.
- `image` op de LocalBusiness (item 1.9).

**Bestanden:** `app/[locale]/layout.tsx:95`, `app/[locale]/vacancies/[id]/page.tsx:93`, `app/[locale]/news/[id]/page.tsx:162`, `app/icon.png`.

---

### 1.6 JobPosting-overhaul — de enige rich result die dit bedrijf direct verkeer levert
**Effort: M · 12 bevindingen samengevoegd**

Alles in `app/[locale]/vacancies/[id]/page.tsx:83-115` + `lib/vacancies.ts`.

**Stap 0 — escaping eerst (blocker).** Maak `lib/schema.ts`:
```ts
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
```
Gebruik in alle drie de `<script type="application/ld+json">`-plekken (`layout.tsx:179`, `vacancies/[id]:121`, `news/[id]:177`). Zonder dit breekt stap 2 het script-blok geruisloos — geen foutmelding in GSC, rich result gewoon weg. Overweeg `schema-dts` als devDependency; die had de ongeldige `baseSalary` bij het typen al gevangen.

**Stap 1 — `lib/vacancies.ts` uitbreiden.** Nu bevat het alleen `id/type/discipline/posted`, en alle vijf staan op `posted: "2026-04-01"` (117 dagen oud, identiek). Voeg toe:
```ts
export interface Vacancy {
  id: string; type: string; discipline: string; posted: string;
  validThrough: string;          // posted + 90 dagen
  jobTitle: string;              // schone functietitel, zonder contractvorm
  city?: string;                 // "Rotterdam" — laat weg als onbekend
  region?: string;               // "Zuid-Holland"
  salaryMin?: number; salaryMax?: number;
  salaryUnit?: "HOUR" | "DAY" | "MONTH" | "YEAR";
}
```

**Stap 2 — het schema herbouwen:**

| Veld | Nu | Moet worden | Waarom |
|---|---|---|---|
| `description` | `vacancy.about` (1 alinea platte tekst) | HTML-string met `<p>` + `<ul>` uit `about` + `responsibilities` + `requirements` + `nice_to_have` | ~70% van de vacaturetekst wordt nu niet aangeboden. Juist de requirements bevatten de long-tail: CSWIP, PCN, ASNT, PED, ISO 3834-2, ISO 9606, RLN 120/127, AWS D1.1. Google eist expliciet HTML met bullets. |
| `title` | `"Inspecteur Drukapparatuur (ZZP / Project)"` | `vacancy.jobTitle` = `"Inspecteur Drukapparatuur"` | `title` is een REQUIRED property en het primaire matchingsveld. Google verbiedt kwalificaties hier; contractvorm hoort in `employmentType`. Weergavetitel blijft op de H1 en de listingkaart. |
| `jobLocation.addressLocality` | `"Zuid-Holland, Nederland"`, `"Nederland / Internationaal"` | `city` (weglaten als er geen stad is), plus `addressRegion: region` | Google for Jobs is locatiegedreven. Een provincie of land in `addressLocality` is voor de geocoder onbruikbaar. Alleen v5 heeft nu een echte plaatsnaam. |
| `baseSalary.value` | vrije marketingtekst | `{ "@type": "QuantitativeValue", minValue, maxValue, unitText }` — of **veld volledig weglaten** | Schema.org eist een Number/QuantitativeValue. Bij de vier "marktconform"-vacatures: weglaten, niet forceren. Alleen v5 (€3.839–€5.920) heeft echte cijfers. |
| `jobBenefits` | bestaat niet | `benefits: string[]` uit messages | v4's hele salarisstring is "Uitstekend salaris + mobiliteitsbudget of leaseauto + opleidingsmogelijkheden" — nul salarisinfo, puur arbeidsvoorwaarden. Die verkoopargumenten mogen niet weggegooid worden bij het schrappen van `baseSalary`. |
| `validThrough` | ontbreekt | `posted + 90 dagen` | Zonder dit blijven vacatures eeuwig "open". Zodra er één vervuld is en de pagina blijft staan is dat exact het scenario waarop Google handmatige maatregelen uitdeelt — dat kost álle vacatures hun Google for Jobs-zichtbaarheid. |
| `identifier` | ontbreekt | `{ "@type": "PropertyValue", name: "Q4S", value: vacancy.id }` | Koppelt de NL- en EN-variant als één vacature en laat Google updates herkennen in plaats van er een nieuwe posting van te maken (wat recency reset). |
| `directApply` | ontbreekt | `true` | Google positioneert sinds 2023 directe werkgeverspagina's boven aggregators — precies waar Q4S van Indeed moet winnen. |
| `employmentType` | `Freelance → "OTHER"` | `Freelance → "CONTRACTOR"` | v1 is letterlijk een ZZP-opdracht. `OTHER` kost het zzp/contractor-filter waar NDT- en inspectiespecialisten op zoeken. |
| `occupationalCategory` | intern label (`"Inspection"`) | O*NET-SOC-code, bv. `"51-9061.00 Inspectors, Testers, Sorters, Samplers, and Weighers"` | Google matcht hierop bij beroepsclassificatie. |

**Niet doen:** `applicantLocationRequirements` toevoegen (alleen geldig bij 100% remote + `jobLocationType: TELECOMMUTE` — deze rollen zijn on-site/reizend); `employmentUnit` (duidt een afdeling aan, niet de werkgever); het JobPosting-blok alleen voor `nl` renderen (dat haalt de EN-vacatures uit Google for Jobs terwijl v3 expliciet internationaal is).

**Procesafspraak voor Q4S:** bij vervulling óf de vacature verwijderen (URL 404/410) óf `validThrough` op een datum in het verleden zetten. Actualiseer `posted` bij herplaatsing — `app/sitemap.ts:73` haalt `lastModified` uit hetzelfde veld, dus dat repareert sitemap-recency mee.

---

### 1.7 Homepage- en inner-page-titles zonder zoekwoord
**Effort: S**

**Mechanisme:** de layout definieert een sterke `title.default` — `"Q4S | Technische Werving & Detachering | QA/QC Specialisten"` — die door **geen enkele pagina** wordt gebruikt, want alle negen zetten zelf een title. De gerenderde titles zijn:

| URL | Nu | Wordt |
|---|---|---|
| `/nl` | `Q4S — Technisch Talent voor Uw Projecten` (0 zoektermen) | `Technische Detachering & Werving \| QA/QC en NDT \| Q4S` |
| `/nl/diensten` | `Onze Diensten \| Q4S` | `Technische Detachering & Werving \| QA/QC en NDT Inspecteurs` |
| `/nl/over-ons` | `Over Q4S \| Q4S` (merk 2×) | `Over Q4S — technisch detacheringsbureau Barendrecht` |
| `/nl/onze-aanpak` | `Onze Aanpak \| Q4S` | `Onze aanpak: technisch personeel werven en detacheren` |
| `/nl/cv-uploaden` | `Sluit je aan bij Q4S \| Q4S` | `CV uploaden — QA/QC, NDT en lasinspecteurs` |
| `/nl/contact` | `Contact \| Q4S` | `Contact \| Q4S technische detachering Barendrecht` |
| `/nl/nieuws/1` | `... \| Q4S \| Q4S` (merk 2×) | `title: article.title` — template voegt zelf `\| Q4S` toe |
| `/nl/vacatures/v1` | `... \| Q4S Vacatures \| Q4S` | `title: { absolute: \`${vacancy.title} — ${vacancy.location}\` }` |

**Aanpak:** ontkoppel de title van `hero.title`. Voeg per namespace in `messages/{nl,en}.json` een `meta.title` en `meta.description` toe en lees die in `generateMetadata`. Gebruik `title: { absolute: "..." }` waar de zoekterm-title zelf al "Q4S" bevat — dat omzeilt de template.

**Let op:** `title.default` in `layout.tsx:41` is géén verwijderbare dode code; Next 16.2.2 vereist een `default` zodra je een `template` zet.

**Meta descriptions in dezelfde beweging** (`services:17`, `about:19`, `way-we-work:17`, `vacancies:15`, `news:15`, `contact:18` gebruiken allemaal `t("hero.subtitle")`): `/nl/over-ons` is nu 44 tekens ("Quality Force — ons fundament, onze belofte."). Schrijf 150-160 tekens met dienst + bewijs + actie. Contact bijvoorbeeld: `"Q4S B.V., Arnhemseweg 12 Barendrecht (regio Rotterdam). Bel +31 85 782 6818 of mail info@q4s.nl — reactie op uw personeelsvraag binnen 24 uur."` Dit is CTR-winst, geen positiewinst — verwacht er geen ranking van.

---

### 1.8 Core Web Vitals: drie ingrepen op de homepage
**Effort: S + M + M**

**a) Logo-preload-storm — grootste winst, één regel.** `components/LogoSlider.tsx:47` heeft `loading="eager"` op 40 `<img>`-elementen. React 19 promoveert die tot preloads: 21 `<link rel=preload as=image>` in de HTML-response, samen **817 KB gzip / 1,14 MB ruw**, voor een strip die volledig onder de vouw staat. Ze concurreren rechtstreeks met het font en de hydratie-chunks om de LCP.

→ `loading="lazy"` + `fetchPriority="low"` + expliciete `width={240} height={72}`. Alle 21 preloads verdwijnen.
→ Daarna: `strukton.svg` (178 KB) en `hollandia.svg` (162 KB) zijn base64-rasters in een SVG-wrapper, geen echte vectoren. Converteer naar 240×72 WebP van 4-8 KB per stuk; doel <120 KB voor de hele strip.

**b) Hero-video van 21,96 MB.** `public/media/home/hero/hero.mp4`: h264, 1280×720, **58 seconden**, 3,02 Mbps totaal — inclusief een AAC-audiostream terwijl het element `muted` is (~1,9 MB volledig verspild). `components/HeroSection.tsx:46-52` zet de src onvoorwaardelijk na hydratie, geen `poster`, geen guard. Op 4G verzadigt dit de downlink ~18 seconden.

```bash
ffmpeg -i hero.mp4 -t 10 -vf scale=1280:-2 -c:v libx264 -crf 30 -preset slow -an -movflags +faststart hero-h264.mp4
```
Plus een WebM/AV1-variant via twee `<source>`-elementen, doel <2 MB elk. Voeg een `poster` toe (WebP, <60 KB) — sinds Chrome 112 telt de eerste geverfde videoframe mee als LCP-kandidaat, en dit element is `absolute inset-0 w-full h-full`. Gate het laden op `matchMedia("(min-width: 1024px)")` en sla over bij `navigator.connection?.saveData` of `prefers-reduced-motion`.

**c) H1 met `opacity:0` in de SSR-HTML.** `components/HeroSection.tsx:19-26` + `92-106`: elk woord van de H1 wordt server-side uitgeleverd als `<span style="opacity:0;transform:translateY(110%)">`. Een element met `opacity: 0` telt niet mee voor LCP, dus LCP = TTFB + JS-download + hydratie + 0,15 s delay. Hetzelfde patroon in `components/motion/FadeInView.tsx:37-45` (29 `opacity:0`-wrappers op `/nl`).

→ Vervang de reveal door CSS `@keyframes` met `animation-fill-mode: backwards` en **alleen `transform`** (geen opacity), of zet `initial={false}` en start de animatie via een na-mount-vlag. Geef `FadeInView` een `disabled`-prop voor above-the-fold gebruik. `app/globals.css:119-129` (`prefers-reduced-motion`) vangt framer-motion's inline styles niet af, dus die dekken dit nu niet.

---

### 1.9 Entiteitsconsolidatie: `@id`, `sameAs`, LocalBusiness-velden
**Effort: S**

**Mechanisme:** Google ziet nu vier losse, niet-gekoppelde "Q4S B.V."-knopen: de Organization uit de layout, een kale `hiringOrganization` in JobPosting, en `author` + `publisher` in Article. Het adres, `foundingDate` en `knowsAbout` dragen dus niets bij aan de geloofwaardigheid van de werkgever in Google for Jobs. `sameAs` is een lege array terwijl de LinkedIn-pagina (3.206 volgers) sitewide gelinkt wordt vanuit `components/FloatingContact.tsx:32`.

In `lib/schema.ts` (die je bij 1.6 al maakte):
```ts
export const ORG_ID = "https://q4s.nl/#organization";
```

**`app/[locale]/layout.tsx:89-172`:**
- `"@id": ORG_ID` toevoegen
- `sameAs: ["https://www.linkedin.com/company/q4s/", "<GBP-URL>"]` — zónder `?viewAsMember=true` (sessieparameter). GBP: `https://maps.google.com/?cid=10301446474152191550`. **Let op:** in de oorspronkelijke audit stond hier `cid=10301226640163227198`; dat nummer was fout. De juiste waarde is berekend uit de hex-CID `0x8ef616fd248aa63e` in de Maps-link op de contactsectie en geeft een 200. Beide items zijn per 2026-07-27 doorgevoerd.
- `telephone: "+31857826818"` op **topniveau** (staat nu alleen genest in `contactPoint`), in E.164 gelijk aan de `tel:`-links
- `image: "https://q4s.nl/q4s-logo.png"` (het nieuwe bestand uit 1.5)
- `geo: { "@type": "GeoCoordinates", latitude: 51.8593938, longitude: 4.51334 }` — neem **exact** de coördinaten uit `app/[locale]/page.tsx:410`, want die komen uit het GBP zelf. Gok niet, en gebruik geen Nominatim-waarden: schema en GBP moeten letterlijk gelijk zijn.
- `hasMap: "https://maps.app.goo.gl/tYQRY1YnbHcG8aBR7"` (staat al op `page.tsx:399`)
- `addressRegion: "Zuid-Holland"` in het PostalAddress
- postcode als `"2994 LA"` mét spatie — dat is de vorm die KvK, GBP en telefoonboek.nl hanteren. Ook in `messages/nl.json:688,731` en `messages/en.json:563,601`.
- `identifier: [{ "@type": "PropertyValue", name: "KvK", value: "69073287" }]` en `vatID: "NL857718137B01"`
- `founder: [{ "@type": "Person", name: "Simon van Houten" }, { "@type": "Person", name: "Paul Boomsma" }]` — "Mede Oprichter" staat letterlijk in `lib/team.ts`
- `makesOffer` (regel 126-171) noemt 4 diensten, `messages/*.json` heeft er 6 — genereer het uit `t.raw("services.items")` in plaats van hardcoded.

**Elders:** vervang de kale Organizations door `{ "@id": ORG_ID, name: "Q4S B.V." }` in `vacancies/[id]/page.tsx:89-94` (houd `name` — Google's JobPosting-docs verwachten `hiringOrganization.name`) en `{ "@id": ORG_ID }` in `news/[id]/page.tsx:153-163` voor `author` én `publisher`.

**`openingHoursSpecification` nog NIET toevoegen** — er staan nergens openingstijden op de site. Markup zonder zichtbare tegenhanger is een richtlijnovertreding. Publiceer ze eerst (item 2.7). Laat `priceRange` weg; Google gebruikt dat niet meer.

---

### 1.10 Certificaatlinks in de footer: alle drie dood
**Effort: S (na 1.1) + M**

- `components/Footer.tsx:137` → `/SNA_VerklaringVanRegistratie.pdf`: opgelost door 1.1.
- `components/Footer.tsx:115` (ISO 9001) en `:126` (VCU) → `https://docs.google.com/viewerng/viewer?url=http://q4s.nl/onewebmedia/...` — dat pad is van de oude site en geeft 404. Over http, via een derde partij.

Het complete certificeringsblok is dus op elke pagina non-functioneel. **Host alle drie de PDF's zelf** onder `public/certificaten/` en link direct. Controleer of de SNA-verklaring van **10-11-2020** nog geldig is — een zes jaar oud bewijsstuk ondermijnt het signaal dat het moet dragen.

**Terminologie-correctie:** `public/llms.txt:30` zegt "VCA", de site voert **VCU** (`Footer.tsx:124`). VCA is voor aannemers/uitvoerend personeel, VCU voor uitzend- en detacheringsorganisaties. VCU is correct; corrigeer llms.txt.

---

### 1.11 Statische prerendering aanzetten
**Effort: M**

**Mechanisme:** `.next/prerender-manifest.json` bevat géén enkele `/[locale]`-route. `setRequestLocale` wordt nergens aangeroepen, dus `getTranslations()` leest de locale uit request-headers en elke route wordt dynamisch. Live: `Cache-Control: private, no-store`, `X-Vercel-Cache: MISS`, `X-Vercel-Id: fra1::iad1` — de functie draait in **Washington DC** voor Nederlandse bezoekers. TTFB is de grootste vaste component van LCP.

1. `import { setRequestLocale } from "next-intl/server"` en aanroepen direct na `await params` in `app/[locale]/layout.tsx:77` én bovenaan élke pagina in `app/[locale]/**`.
2. `localeCookie: false` in `i18n/routing.ts` (item 1.3) — zonder dat blijft `Set-Cookie: NEXT_LOCALE` de edge-cache omzeilen, óók als de pagina's statisch zijn.
3. `export const preferredRegion = "fra1";` in `app/[locale]/layout.tsx` als tussenoplossing.

`generateStaticParams` is **niet** nodig voor de detailroutes: `vacancies/[id]/page.tsx:8-10` en `news/[id]/page.tsx:17-27` hebben die al.

**Verificatie:** `next build` — routes moeten als ○/● in de routetabel staan.

---

### 1.12 404-pagina en legacy-URL's
**Effort: M**

Er is geen `not-found.tsx` op enig niveau. `app/layout.tsx:9-15` rendert alleen `children` zonder `<html>`/`<body>` (die staan in de locale-layout), terwijl de default-404 alléén de root-layout gebruikt. Resultaat op `/nl/onzin`: status 404 (goed), maar malformed HTML met **twee `<title>`-tags** — `"404: This page could not be found."` gevolgd door de verouderde Engelse `"Q4S — Technical Talent for Your Projects"` uit `app/layout.tsx:5`.

1. Verwijder het `metadata`-object uit `app/layout.tsx:4-7` (er staat geen `metadataBase` in, dus het kan volledig weg).
2. Maak `app/[locale]/not-found.tsx` met gebrande 404 (H1 + links naar `/vacatures`, `/diensten`, `/contact`) — die erft de volledige layout mét header/footer.
3. `experimental: { globalNotFound: true }` in `next.config.ts` + `app/global-not-found.tsx` mét eigen `import "./globals.css"` voor paden buiten `[locale]`.

**Legacy-redirects:** `https://q4s.nl/ndt-1`, `/news.html`, `/downloads`, `/waywework` staan nog in Google en geven 404. Voeg `async redirects()` toe aan `next.config.ts` met 308's. Die draaien blijkens `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:202-206` **vóór** de proxy, dus de redirectketen wordt vermeden. **Haal de echte lijst uit Search Console (Pagina's → Niet gevonden), werk niet op gok.**

---

### 1.13 Quick wins in dezelfde commit
**Effort: S totaal**

| Item | Bestand | Actie |
|---|---|---|
| Security headers | `next.config.ts` | `poweredByHeader: false` + `headers()` met `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`. **Laat HSTS weg** — Vercel zet die al; een eigen header overschrijft hem. |
| Teamfoto aansluiten | `lib/team.ts` | `photo: "gjil-de-jong.png"` bij Gjil. Het bestand bestaat en wordt al gebruikt in `RecruiterContact.tsx:15`. Wel eerst herexporteren: het is 96×96 en `TeamCard` rendert het in een `aspect-[3/4]`-kaart (~300×400) → wazig. |
| Sitemap-lastmod | `app/sitemap.ts:47,54` | `new Date()` → echt `lastMod`-veld per route in `SitemapEntry`. Elke deploy meldt nu dat alle 16 hoofdpagina's zojuist zijn gewijzigd; bij structureel onbetrouwbare lastmod negeert Google het veld domeinbreed. |
| Starter-assets weg | `public/` | `next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg` — nergens gebruikt. |
| Taalfouten | `messages/nl.json` | `:367` "approximately 3 maanden" → "circa 3 maanden" (belandt letterlijk in `JobPosting.description`); `:641` "Skandinavische" → "Scandinavische"; `:632` "Tezelfdertijd" → "Tegelijkertijd". Ook: `app/[locale]/way-we-work/page.tsx:48` hardcodeert de Engelse eyebrow "Q4S Process" op `/nl/onze-aanpak`, en `LogoSlider.tsx:60` heeft `aria-label="Client logos"` voor beide locales. |
| Merkkleur-contrast | diverse | `#e8430a` op wit = 4,01:1, onder AA. Gebruik `#c73508` (5,33:1, al aanwezig als hover-kleur) voor tekst-op-wit en knoplabels. Faalgevallen: `Header.tsx:75,87`, `page.tsx:68,362`, `RecruiterContact.tsx:10,29`, alle verplicht-sterretjes in de formulieren, alle wit-op-oranje knoppen. Oranje op zwart (5,24:1) is prima — laat die staan. |

---

## FASE 2 — Structurele winst (2-4 weken)

> **Volgorde binnen deze fase: content schrijven, dán URL's splitsen.** De hele `services`-namespace is 3.270 JSON-tekens voor 6 diensten (~60-70 woorden per dienst); de `ndt`-namespace 2.064 tekens voor 6 methodes (~25-40 woorden elk). Er valt niets te "verdelen" — vier URL's met elk 70 woorden ranken slechter dan de huidige ene pagina en riskeren thin-contentsignalen.

### 2.1 Bestaande, al geschreven copy die nergens gerenderd wordt
**Effort: S · Doe dit eerst — het is gratis**

~130 woorden staan in `messages/` maar komen niet in de HTML:

| Key | Waar het hoort | Nu |
|---|---|---|
| `home.why.body` (`nl.json:32`, 45 woorden) | `app/[locale]/page.tsx:66-83` | `WhyCards.tsx` rendert alleen `title` + `desc`, `body` wordt nooit doorgegeven |
| `home.sectors.items[].desc` + `.tag` (`nl.json:97-102`, ~72 woorden) | `page.tsx:345-348` | rendert uitsluitend `{sector.title}` — "raffinaderijen en chemische installaties", "upstream en downstream", "FPSO-projecten" staan nergens in de HTML |
| `home.hero.ctaEmployerSub` / `ctaCandidateSub` (`nl.json:24-25`) | onder de hero-knoppen | `HeroSection.tsx` accepteert de props niet eens |
| `ndt.cta.*` (`nl.json:597-602`) | — | dode copy sinds `/ndt` een redirect werd; verwijderen uit nl.json én en.json |

De sectorbeschrijvingen zijn meteen de basis voor 2.5.

---

### 2.2 Homepage-H1 als losse woord-spans zonder spaties
**Effort: S**

`components/HeroSection.tsx:93-105` splitst de tagline op woorden en rendert elk in een eigen span, **zonder whitespace-tekstknoop ertussen**. De ruwe HTML-string is `TechnischTalentvoorUw Projecten`; de spatiëring komt uitsluitend uit `app/globals.css:60` (`gap: 0 0.22em`).

Chrome (en dus Googlebot na rendering) herstelt de woordgrenzen waarschijnlijk via de flex-blockificatie. Maar GPTBot/ClaudeBot/PerplexityBot, OG-scrapers en SEO-tools die de ruwe HTML parsen zien de aaneengeplakte string. Voor een site die bewust een `llms.txt` onderhoudt is dat een reëel verlies.

→ Render `{" "}` tussen de woorden, of zet de volledige tagline als tekst in de `<h1>` en animeer een wrapper. Zet hoe dan ook `aria-label={tagline}` op de `<h1>`.

---

### 2.3 Koppen die zoektermen dragen
**Effort: S**

Geen van de zeven hoofdpagina's heeft een H1 waarin "detachering", "werving", "technisch personeel", "inspecteur" of een plaatsnaam voorkomt. In `messages/{nl,en}.json`:

| Key | Nu | Wordt |
|---|---|---|
| `home.hero.tagline` (`:19`) | Technisch Talent voor Uw Projecten | Technisch talent voor uw projecten — detachering & werving |
| `services.hero.title` (`:174`) | Onze Diensten | Onze diensten: technische detachering, werving en inspectie |
| `about.hero.title` (`:125`) | Over Q4S | Over Q4S — technische werving en detachering sinds 2015 |
| `wayWeWork.hero.title` (`:254`) | Onze Aanpak | Onze aanpak: van intake tot plaatsing in 5 stappen |
| `uploadCv.hero.title` (`:438`) | Sluit je aan bij Q4S | CV uploaden of opdracht aanmelden bij Q4S |
| `home.services.title` (`:54`) | Onze Expertise | Onze diensten voor opdrachtgevers |
| `home.sectors.title` (`:94`) | Waar precisie het verschil maakt. | Sectoren waarin wij detacheren |
| `about.team.title` (`:163`) | **Onze Aanpak** | Het team achter Q4S |

Die laatste is een echte kannibalisatie: de H2 op `/nl/over-ons` is letterlijk identiek aan de H1 van `/nl/onze-aanpak`, in beide talen — en de kop is inhoudelijk fout (het blok gaat over het team).

**Ontbrekende H2's** (eyebrow-`<p>`'s die een sectie inleiden zonder dat er een `<h2>` boven staat): `services/page.tsx:101, 131, 146` en `way-we-work/page.tsx:74, 84`. Promoveer naar `<h2>` met dezelfde Tailwind-klassen (visueel identiek). `/nl/onze-aanpak` heeft nu 1×h1, 1×h2 (de CTA!), 12×h3.

**Niet promoveren:** `page.tsx:92` en `:300` — die eyebrows staan pal boven een echte `<h2>`; promoveren geeft twee concurrerende koppen. Daar is de herschrijving hierboven de juiste ingreep.

Voeg een `<h2>` toe boven de resultatenlijst op `/vacatures` (nu 1×h1, 0×h2, 9×h3), bv. "Openstaande vacatures voor QA/QC-, NDT- en inspectiepersoneel". Idem `renderContent` in `news/[id]/page.tsx:96`, dat alle artikelkoppen als `h3` rendert.

---

### 2.4 Dienstcluster: 4 landingspagina's
**Effort: L · De zwaarste strategische leemte**

**Mechanisme:** alle 6 diensten leven op `/nl/diensten` met ~90 woorden elk. Google kiest per query één URL; `/nl/diensten` is te breed om er één te winnen. De NL-top-10 voor "technisch detacheringsbureau" bestaat uit exact-match landingspagina's: `certos.nl/detachering-technisch-personeel/`, `etmaal.com/technisch-detacheringsbureau/`, `aditech.nl/technische-detachering`. Bureautechniek.nl (nr. 1) heeft aparte `/diensten/detacheren` en `/diensten/werving-en-selectie`.

De `id` op elk service-item wordt alleen als React-key gebruikt (`ServiceItems.tsx:82`) — er staat geen DOM-`id` op de secties, dus zelfs `/diensten#detachering` werkt niet.

| NL-URL | EN-URL | Doelzoekwoord | Type |
|---|---|---|---|
| `/nl/diensten/detachering-technisch-personeel` | `/en/services/technical-secondment` | detachering technisch personeel, technisch detacheringsbureau | Dienst-landingspagina |
| `/nl/diensten/technische-werving-en-selectie` | `/en/services/technical-recruitment` | werving en selectie techniek | Dienst-landingspagina |
| `/nl/diensten/source-inspection-expediting` | `/en/services/source-inspection` | source inspection, third party inspection Nederland | Dienst-landingspagina |
| `/nl/diensten/qa-qc-detachering` | `/en/services/qa-qc-support` | QA/QC inspecteur inhuren | Dienst-landingspagina |

**Per pagina 700-1.000 woorden nieuw geschreven:** probleem, aanpak, doorlooptijd, contractvormen (detavast / ZZP / payroll / G-rekening), certificeringen, 3 FAQ's, Service-schema. Gebruik de vaktermen die al bewezen in `messages/nl.json` staan maar nu uitsluitend op de 5 vacaturedetailpagina's leven: IWI-C, IWT/IWE, ISO 3834-2, ISO 9606, RLN 120/127, PED, CSWIP/PCN/ASNT, ASME/EN/API.

**Verwerk hierin de head-termen die nu letterlijk 0× voorkomen** in 44 KB site-copy: "uitzendbureau", "detacheringsbureau", "detacheren", "technisch personeel inhuren", "inhuren", "interim", "payrolling", "werving en selectie" (alleen de ampersand-variant bestaat), "G-rekening". Natuurlijk verwerken in nieuwe tekst — **geen keyword-injectie in bestaande dunne teksten**.

**Technisch:**
- Routes in `i18n/routing.ts` + `app/[locale]/services/[slug]/page.tsx`
- **Elke pagina MOET zelf `alternates` zetten** (zie 1.4) — anders canonicaliseert hij naar `/nl` en rankt nooit
- Toevoegen aan `app/sitemap.ts` `staticRoutes`
- `Service`-JSON-LD per pagina met `provider: { "@id": ORG_ID }`
- `/nl/diensten` blijft de hub met korte samenvattingen + links

---

### 2.5 NDT terug als eigen URL
**Effort: M**

`app/[locale]/ndt/page.tsx:11` doet `permanentRedirect({ href: "/services", locale })` — zonder de hash, terwijl de comment op regel 3-4 `#ndt` belooft. Elke oude `/nl/ndt`-link landt dus bovenaan de dienstenpagina. "NDT" komt 50× voor in `nl.json` en is het meest onderscheidende én minst competitieve onderwerp van Q4S. Voor "NDT inspecteur detachering inhuren" ranken NDT-diénstverleners (SGS, DEKRA, qis-ndt.nl) — géén detacheerders. Dat gat staat open.

**Laat de 308 staan** maar richt hem op een nieuwe pagina — niet terugdraaien, anders krijg je `/ndt` en `/diensten#ndt` met dezelfde inhoud.

- **NL:** `/nl/ndt-inspecteur` · **EN:** `/en/ndt-inspector`
- **Doelzoekwoord:** "NDT inspecteur inhuren", "NDT detachering", "NDT Level II inspecteur"
- **Type:** dienst-/expertise-landingspagina, 1.000+ woorden
- H1: "NDT-inspecteurs inhuren — Level II & III"
- Per methode (UT/RT/MT/PT/ET/VT) een blok met toepassing, sector en normverwijzing
- Sectie "ISO 9712 / EN 473, CSWIP, PCN, ASNT — wat betekent welk certificaat" (ISO 9712 en EN 473 komen nu 0× voor)
- Verplaats de NDT-secties uit `services/page.tsx:83-166`; laat daar een teaser + link
- `public/llms.txt:44-45` bijwerken, route toevoegen aan `app/sitemap.ts`

Methodepagina's (`/nl/ndt-inspecteur/ultrasoon-onderzoek-ut` etc., 300-500 woorden) zijn fase 3 — pas nadat de hub aantoonbaar rankt.

---

### 2.6 Opdrachtgever- en kandidaatfunnel splitsen
**Effort: M**

**Mechanisme:** de hoogste commerciële intentie in de header ("Voor Opdrachtgevers", `Header.tsx:92` en `:144`) linkt naar `/nl/cv-uploaden#opdrachtgever` — een slug die letterlijk "cv uploaden" heet, dus een kandidaat-signaal. De hash werkt bovendien alleen client-side (`RegisterTabs.tsx:22-24` leest `window.location.hash` in een `useEffect`), dus voor Googlebot bestaat het onderscheid niet. `RegisterTabs.tsx:43-44` zet de niet-actieve tab op `hidden` (`display:none`) en de kandidaat-tab is de default — de opdrachtgeverinhoud staat standaard verborgen. Twee tegengestelde intenties delen één title, één H1, één description.

J&J Inspections (Ridderkerk, 4 km verderop, meest directe concurrent) heeft `/opdrachtgevers/` én `/kandidaten/` als aparte URL's. Technical Valley heeft `/voor-opdrachtgevers/`.

| NL-URL | EN-URL | Doelzoekwoord | Type |
|---|---|---|---|
| `/nl/opdrachtgevers` | `/en/for-clients` | technisch personeel inhuren, inspecteurs inhuren | Commerciële landingspagina + formulier |
| `/nl/cv-uploaden` (bestaand) | `/en/upload-cv` | cv uploaden technische vacature, open sollicitatie inspecteur | Kandidaat-conversiepagina |

**Aanpak:**
- Nieuwe route in `i18n/routing.ts`, H1 "Technisch personeel inhuren voor uw project"
- Verplaats het volledige `uploadCv.employer`-blok uit `messages/*.json` (nu ~70 woorden) en `EmployerForm` hierheen; breid uit naar 700-900 woorden: inhuurvormen (detachering/werving/ZZP), SNA/NEN 4400-1-garantie, doorlooptijd, tarieven, sectoren
- `Header.tsx:92` en `:144` naar de nieuwe route
- Verwijder `RegisterTabs`; `/cv-uploaden` wordt puur kandidaat, H1 "Werken via Q4S — schrijf je in als QA/QC-, NDT- of inspectiespecialist"
- Beide eigen title, description, canonical, sitemap-entry (opdrachtgevers priority 0.95)

---

### 2.7 Certificeringen: van drie footer-chips naar echte content
**Effort: M**

**Mechanisme:** "NEN 4400" komt precies 1× voor in `messages/nl.json` — het footer-sublabel. "G-rekening": 0. "Inlenersaansprakelijkheid": 0. SNA/NEN 4400-1 is voor een Nederlandse inlener geen sierkeurmerk maar de directe basis voor vrijwaring van hoofdelijke aansprakelijkheid voor loonheffingen. Q4S **heeft** de keurmerken maar vertelt er nergens over, dus rankt er niet op en overtuigt er niemand mee. De zoekvraag wordt nu beantwoord door payroll-kennisbanken (please.nl, flexhub.nl, sfaa.nl).

- **NL:** `/nl/certificeringen` · **EN:** `/en/certifications`
- **Doelzoekwoord:** SNA-keurmerk, NEN 4400-1, inlenersaansprakelijkheid detachering
- **Type:** trust-/compliancepagina, 150-250 woorden per keurmerk

Per certificaat: wat het is, wat het voor de opdrachtgever betekent, geldigheid, PDF vanaf eigen domein. Neem de SNA/G-rekening-uitleg óók op als kernblok op `/nl/opdrachtgevers` en op de detacheringsdienstpagina.

**Bouw dit primair voor het vertrouwenssignaal, niet voor het zoekvolume** — "certificeringen detacheringsbureau" heeft nauwelijks volume. De waardevolle zoekvraag zit in het kennisbankartikel (3.2).

Voeg tegelijk openingstijden toe (`/nl/contact` + footer), zodat `openingHoursSpecification` uit 1.9 mag.

---

### 2.8 Contactpagina als lokale entiteitspagina
**Effort: M**

`app/[locale]/contact/page.tsx` (153 regels) heeft 134 woorden copy, geen kaart, geen routebeschrijving, geen openingstijden, geen GBP-link. De Maps-embed staat op de **homepage** (`page.tsx:394-420`).

- Verplaats de map-sectie naar `contact/page.tsx` (om inhoudelijke redenen — de iframe heeft `loading="lazy"` en staat als laatste sectie, dus hij kost geen LCP)
- Voeg toe: openingstijden, routetekst ("ca. 10 minuten van de A15/A29, 15 minuten vanaf Rotterdam-Zuid, 15 minuten van Botlek en Europoort"), GBP-link met tekst "Bekijk Q4S op Google Maps", "wat gebeurt er na uw aanvraag"
- Naar 350+ woorden
- `ContactPage`-JSON-LD met `mainEntity: { "@id": ORG_ID }` — **geen tweede losse LocalBusiness**, dat maakt twee ongekoppelde entiteitsknopen op één URL

Voeg in `components/Footer.tsx` een **zichtbaar NAP-blok** toe (Q4S B.V. / Arnhemseweg 12 / 2994 LA Barendrecht / telefoon). `messages/nl.json:688` bevat `footer.address` maar `Footer.tsx` roept `t("address")` nergens aan — in de live HTML komt "Arnhemseweg" uitsluitend binnen het JSON-LD voor, nooit als zichtbare tekst.

Harmoniseer meteen de telefoonnotatie: `FloatingContact.tsx:21` heeft `"+31 085 7826818"` (ongeldig: landcode + nationale 0).

---

### 2.9 Interne links met beschrijvende ankertekst
**Effort: M · Zonder dit krijgen de nieuwe pagina's uit 2.4/2.5/2.6 geen relevantie**

**Mechanisme:** alle 6 sectorkaarten linken naar `/services` (`page.tsx:314`) en `ServiceRows.tsx:30` voegt nog eens 5 identieke `/services`-links toe — 11 identieke interne links naar één URL op de homepage. `renderContent` (`news/[id]/page.tsx:87-141`) genereert alleen `<p>`, `<ul>`, `<li>`, `<strong>` — **geen enkel anker**, dus artikelen eindigen in doodlopende tekst ("Neem contact op voor een vrijblijvend gesprek" zonder link). Er is geen enkele interne link waarvan de ankertekst "detachering", "technisch personeel", "QA/QC inspecteur" of een plaatsnaam bevat.

- Breid `renderContent` uit met markdown-link-ondersteuning `[tekst](/pad)`; bouw 2-3 links per artikel naar de relevante dienstpagina
- Laat sectorkaarten naar de sectorpagina linken (of, zolang die er niet zijn, naar de relevante dienstpagina)
- `ServiceItems.tsx`: "Meer over {dienst}" per dienst
- Footer-ankers verrijken in `messages/*.json`: `footer.forEmployers.services` → "Detachering & werving technisch personeel"; `footer.forCandidates.ndt` → "NDT-inspecteurs detacheren" (en naar de nieuwe `/nl/ndt-inspecteur`)
- **Bug:** `Footer.tsx:63` zet "Vind talent" onder de kop "Opdrachtgevers" maar linkt naar `/vacancies` (de kandidaten-vacaturelijst) → moet naar `/nl/opdrachtgevers`
- Voeg `/way-we-work` toe aan `navItems` (`Header.tsx:10-15`) — de key `nav.wayWeWork` bestaat al. Doe dit pas nadat die pagina van 331 woorden inhoudelijk iets voorstelt.
- 10 dode vertaalsleutels opruimen (`nav.home`, `nav.ourServices`, `nav.wayWeWork`, `nav.uploadCv`, `nav.ndt`, `nav.findTalent`, `nav.findProject`, `footer.links.services/vacancies/ndt`)

---

### 2.10 BreadcrumbList + WebSite-schema
**Effort: M**

Er zijn exact drie `ld+json`-blokken in de repo. Geen BreadcrumbList, geen WebSite.

**Belangrijk:** wat op `vacancies/[id]:126-132` en `news/[id]:183-189` staat is géén breadcrumb maar één terug-link ("Alle vacatures"). De comment `{/* Breadcrumb */}` is misleidend. **Bouw eerst een écht zichtbaar kruimelpad**, dan pas markeren — markup mag de zichtbare content niet overtreffen.

Maak `components/Breadcrumbs.tsx` (server component) die zowel het zichtbare pad als de JSON-LD rendert, met de gelokaliseerde pathnames uit `i18n/routing.ts`. Laatste item zonder `item`-property, conform Google. Plaats op alle detail- en dienstpagina's.

**WebSite-schema** alleen op `app/[locale]/page.tsx` (niet in de layout):
```ts
{ "@context":"https://schema.org", "@type":"WebSite", "@id":"https://q4s.nl/#website",
  url: "https://q4s.nl/", name: "Q4S", alternateName: ["Q4S B.V.", "Q4S Detachering"],
  inLanguage: locale === "nl" ? "nl-NL" : "en-GB",
  publisher: { "@id": ORG_ID } }
```
Dit is Google's belangrijkste signaal voor de sitenaam boven zoekresultaten. **Voeg géén `potentialAction: SearchAction` toe** — de sitelinks-searchbox is op 21 november 2024 wereldwijd uitgezet.

**Service-schema** op `/diensten` als `ItemList` van `Service`-objecten met `provider: { "@id": ORG_ID }`.

---

### 2.11 Formulieren: conversie en meetbaarheid
**Effort: M**

| Probleem | Bestand | Fix |
|---|---|---|
| **CV-upload is als verplicht gelabeld maar niet afgedwongen** | `UploadCvForm.tsx:166-188`, `app/api/submit-cv/route.ts:43,107` | De `<input type="file">` heeft geen `required` én geen `name`. Een kandidaat die het bestand vergeet krijgt het successcherm, en de e-mail meldt onvoorwaardelijk "**CV bijgevoegd** als bijlage". Guard in `handleSubmit` + 400 vanuit de API. |
| **Dropzone onbereikbaar voor toetsenbord/schermlezer** | `UploadCvForm.tsx:169-171`, `EmployerForm.tsx:160-181` | `<div onClick={...}>` zonder `tabIndex`/`role`/keyboard-handler, echte input op `className="hidden"` (`display:none` = niet focusbaar). → `role="button" tabIndex={0} onKeyDown={...}` en `sr-only` i.p.v. `hidden`. |
| **Sollicitatie-CTA gooit vacaturecontext weg** | `vacancies/[id]/page.tsx:236-242` | Linkt naar `/contact?vacancy=v1`, maar `contact/page.tsx` leest nergens `searchParams` en `ContactForm.tsx:46-56` stuurt het niet mee. De recruiter krijgt een e-mail zonder vacaturereferentie. → `searchParams` accepteren, hidden field + zichtbare regel "Je reageert op: <titel>", meesturen naar `/api/contact`. |
| **Turnstile-faalmodus blokkeert verzending permanent** | `Turnstile.tsx:87-90`, alle drie de forms | Bij een geblokkeerd `challenges.cloudflare.com` (adblockers, bedrijfsproxies, privacy-DNS) wordt alleen `console.error` gedaan en blijft de knop `disabled` — zonder foutmelding. → `onError`-callback + zichtbare melding met mailto/tel-alternatief + timeout van ~8 s waarna de knop weer aan gaat (server-side verificatie vangt het af). |
| **21 labels niet gekoppeld, geen autocomplete** | alle drie de forms | `htmlFor`: 0 treffers in de repo; `id=`: 1 treffer in heel `components/`. Geef elk veld een `id` + matching `htmlFor`, plus `autoComplete="given-name\|family-name\|email\|tel\|address-level2"`. Nul rankingimpact — puur drop-off op de 9-velden-cv-pagina. |
| **Geen bedankt-URL, geen conversie-event** | alle drie | Inline state-swap, geen route-wijziging; `track(` komt 0× voor. → `app/[locale]/thank-you/page.tsx` (nl: `/bedankt`) met `robots: { index: false, follow: true }`, `router.push()` uit `@/i18n/navigation`, plus `track('cv_upload'\|'contact_submit'\|'assignment_request')`. **Let op:** Vercel custom events vereisen een betaald plan; op Hobby worden ze stil weggegooid. GA4/GTM of server-side events vanuit de API-routes is betrouwbaarder. |

---

### 2.12 OG-images
**Effort: M · Na de fotografie uit 3.1, of met ImageResponse zonder foto's**

`twitter:card=summary_large_image` staat aan maar er is nergens een `og:image` — het platform reserveert de grote-kaartlayout en vult die met niets. Ook geen `og:url`. LinkedIn is hét kanaal voor vacaturedistributie.

- `app/[locale]/opengraph-image.tsx` — site-breed vangnet (1200×630, ImageResponse uit `next/og`)
- `app/[locale]/vacancies/[id]/opengraph-image.tsx` — vacaturetitel + locatie + logo
- `app/[locale]/news/[id]/opengraph-image.tsx` — koppel dezelfde URL aan `articleSchema.image` (`news/[id]/page.tsx:146`)

**Bijkomend defect:** elke pagina die zelf `openGraph` definieert **wist** `og:site_name` en `og:locale` van de layout (Next vervangt het object, mergt niet diep). `/nl` heeft ze wel, `/nl/vacatures/v1` alleen `og:title` + `og:description`. Maak `lib/og.ts` met een helper die `siteName`, `locale`, `alternateLocale`, `type`, `url` en `images` altijd meezet, en gebruik die in alle acht `generateMetadata`-functies.

Voeg meteen `app/apple-icon.png` (180×180) en `app/manifest.ts` toe, plus `export const viewport: Viewport = { themeColor: "#000000" }` (aparte export, niet in het metadata-object).

---

## FASE 3 — Autoriteit & content (doorlopend)

### 3.1 Fotografie — de moederoorzaak onder drie andere bevindingen
**Effort: M (dev) · Q4S levert het materiaal**

Alle 18 mappen onder `public/media/**` bevatten uitsluitend een `.gitkeep` van 0 bytes. De enige media is `hero.mp4`. De enige portretfoto is `public/team/gjil-de-jong.png` (96×96). `/nl/diensten`, `/nl/over-ons`, `/nl/onze-aanpak`, alle 6 nieuwsartikelen, alle 5 vacatures en `/nl/contact` bevatten **samen nul foto's**.

Dit blokkeert tegelijk: `og:image`, `Article.image` (dus Discover-geschiktheid), Google Images-verkeer, en het E-E-A-T-bewijs waarmee je van een concurrent met echte projectfoto's wint.

**Minimale set (12-15 beelden):** kantoor/team Barendrecht, inspecteurs aan het werk (NDT, lasinspectie, source inspection), 1 hero per dienstpagina, 1200px+ breed. Lever via `next/image` met expliciete `width`/`height`, beschrijvende bestandsnamen (`ndt-inspecteur-ultrasoon-onderzoek.webp`) en alt-teksten die dienst + locatie benoemen.

**Header-/footerlogo:** komt van een 4096×3031 JPG van 1,1 MB. Het loopt wél door `next/image` (bezoekers krijgen geen 1,1 MB), maar: elke transformatie van die bron is duur bij koude cache, er is geen `sizes` (dus 384px voor een 76px-logo), en `Footer.tsx:21` gebruikt CSS `invert` op een JPG — waardoor het merkoranje `#e8430a` naar cyaan `rgb(23,188,245)` kantelt in de footer van elke pagina. → echte SVG of 300×222 WebP + aparte witte variant + `sizes`.

---

### 3.2 Kennisbank — de complete informationele long-tail
**Effort: M (geen nieuwe route nodig)**

**Mechanisme:** elke informationele SERP die een inkoper van detachering doorloopt wordt bezet door kennisbanken van concurrerende bureaus: "wat kost detachering" → wtbe.nl, lakehouse.nl, randstad.nl; "verschil detacheren en uitzenden" → unique.nl, maandag.com, etmaal.com; "NEN 4400-1 / G-rekening" → please.nl, flexhub.nl, sfaa.nl; "salaris NDT inspecteur" → nationaleberoepengids.nl, indeed. **Geen van die SERP's bevat een technisch-industriële specialist.**

**Bouw géén nieuwe `/kennisbank`-route.** `app/[locale]/news/[id]/page.tsx` levert al per artikel een eigen URL met correcte canonical + hreflang, Article-JSON-LD en een `articleSection`-veld. Voeg de artikelen toe als `news.articles`-items 7-12 met categorie "kennisbank". Effort van L naar M.

| # | Artikel | Doelzoekwoord |
|---|---|---|
| 7 | Wat kost detachering van technisch personeel? Tarieven en opslagfactor 2026 | wat kost detachering, uurtarief inspecteur |
| 8 | Detachering, uitzenden of ZZP: wat kies je voor technisch personeel? | verschil detachering uitzenden |
| 9 | NEN 4400-1 en het SNA-keurmerk: wat het betekent voor uw inlenersaansprakelijkheid | SNA keurmerk, NEN 4400-1, G-rekening |
| 10 | CSWIP, PCN of ASNT — welke NDT-certificering heb je in Nederland nodig? | ISO 9712 Level II, CSWIP vs PCN |
| 11 | Wat verdient een NDT-inspecteur in Nederland? (2026) | salaris NDT inspecteur |
| 12 | WPS en PQR uitgelegd: van lasprocedure tot kwalificatie | WPS PQR uitleg |

800-1.500 woorden elk. Elk artikel linkt contextueel naar de bijbehorende dienstpagina uit 2.4/2.5.

**Twee praktische punten:** de artikel-ids in `app/sitemap.ts:24-31` zijn handmatig gehardcodeerd en moeten mee-uitgebreid worden; en artikel 11 (salaris) heeft alleen waarde met **echte cijfers uit Q4S' eigen plaatsingen** — dat is de vakkennis waarmee je van nationaleberoepengids.nl wint.

**Bestaande 6 artikelen:** 185-265 woorden, auteurloos, nieuwste van 15-03-2026. Breid uit naar 800+, voeg een `author`-veld toe met een echte Person-byline (`worksFor: { "@id": ORG_ID }`), en een echt `updated`-veld voor `dateModified` (nu altijd gelijk aan `datePublished`). Verwijder of onderbouw de claim "in 2025 met meer dan 30% gegroeid" (`nl.json:632`).

---

### 3.3 FAQ-blokken — voor AI-citatie, niet voor rich results
**Effort: M**

`grep -i "faq|veelgestel"` over de hele repo: nul treffers. De bestaande copy is grotendeels claim-taal zonder toetsbare inhoud ("wij worden een betrouwbare projectpartner", "kandidaten die direct inzetbaar zijn") — per definitie niet citeerbaar.

Voeg 4-6 vragen toe onderaan elke dienstpagina en `/nl/vacatures`, elk beantwoord in **40-60 woorden die zelfstandig leesbaar zijn**: "Wat is het verschil tussen detachering en werving & selectie?", "Welke NDT-certificeringen moet een inspecteur in Nederland hebben?", "Hoe lang duurt het om een QA/QC-inspecteur geplaatst te krijgen?", "Wat betekent het SNA-keurmerk voor mij als opdrachtgever?", "Wat is source inspection en wanneer heb ik het nodig?"

**Kritieke uitvoeringseis:** het antwoord moet als losse alinea **in de HTML** staan, niet pas na een JS-klik in een accordeon.

FAQPage-JSON-LD mag mee, maar **verwacht er geen rich result van** — zie "wat geen zin heeft".

---

### 3.4 Regionale content — gefaseerd, niet als paginafabriek
**Effort: M**

"Rijnmond", "Botlek", "Europoort", "Moerdijk", "Maasvlakte", "Antwerpen", "Eemshaven": alle 0× in de site-copy. "Rotterdam" komt 2× voor — beide als vacaturelocatie, en één daarvan staat in de tekst van de *opdrachtgever*. Q4S zit fysiek naast het Botlek/Pernis-cluster en claimt die regio nergens.

**Stap 1 (nu):** verweef de regio in bestaande copy. `about.story` (`nl.json:129-130`) → "vanuit Barendrecht, in het hart van de Rotterdamse haven- en petrochemieregio"; `services.intro` (`:177`) → de concrete clusters. Plus de contactpagina-uitbreiding uit 2.8.

**Stap 2 (na meting):** **één** echte regiopagina.
- **NL:** `/nl/technische-detachering-rotterdam` · **EN:** `/en/technical-secondment-rotterdam`
- **Doelzoekwoord:** technisch detacheringsbureau Rotterdam, technisch personeel inhuren Rotterdam
- **Type:** regio-landingspagina, 800+ woorden
- H1: "Technische detachering Rotterdam — QA/QC- en NDT-inspecteurs voor Botlek, Pernis en Maasvlakte"
- Unieke inhoud: welke industrie er zit, welke disciplines Q4S daar plaatst, turnaround-/onderhoudsstopseizoenen, reistijd, concrete klanttypes

Voor "detacheringsbureau Barendrecht" is er géén dominante speler — alleen directories. Dat is de goedkoopste eerste positie.

**Uitbreiden pas als deze pagina aantoonbaar rankt.** Zie hieronder waarom.

---

### 3.5 Sector- en functiehubs
**Effort: L · Na 2.4, niet ervoor**

**Sectorpagina's** (`/nl/sectoren/[slug]`, EN `/en/sectors/[slug]`) — start met drie waar Q4S bewijs heeft: petrochemie, offshore-en-maritiem, energie-en-windenergie. Doelzoekwoorden: "detachering petrochemie", "QA/QC offshore inhuur", "inspecteurs offshore wind". Per pagina: welke functies Q4S daar levert, normen (ASME, EN, API, PED), sector-CTA.

**Let op:** `home.sectors.items` en `ndt.sectors.items` zijn twee aparte lijsten in `messages/nl.json`. Wijs één canonieke sectorbron aan, anders krijg je twee afwijkende lijsten over drie pagina's.

**Functiehubs** (`/nl/vacatures/functie/[slug]`, EN `/en/vacancies/discipline/[slug]`): qa-qc-inspecteur, ndt-inspecteur, lasinspecteur-welding-inspector, source-inspector, inspecteur-drukapparatuur.

**Mechanisme:** `vacancies/[id]/page.tsx:60-65` doet `notFound()` zodra een id ontbreekt, en `app/sitemap.ts` itereert over dezelfde array — een gesloten vacature geeft dus een harde 404 en verdwijnt uit de sitemap. Er wordt **nul blijvende kandidaat-autoriteit** opgebouwd. Een functiehub is een permanente pagina met functieomschrijving, vereiste certificeringen, doorgroei en salarisindicatie, plus de actuele vacatures gefilterd op discipline (en een open-sollicitatie-CTA als er geen open staat). Zo win je van Indeed/LinkedIn, die deze SERP's nu volledig bezetten.

---

### 3.6 E-E-A-T: team, cases, Person-schema
**Effort: M · Q4S levert het materiaal**

- **Teamkaarten:** drie initialenblokjes onder de kop "Maak kennis met het Q4S-team". Vul `photo` in `lib/team.ts` (foto's van 600×800), breid `TeamMember` uit met `bio`, `yearsExperience`, `specialisms: string[]` en `linkedin`, render in `TeamCard.tsx`.
- **Person-schema** op `/over-ons` met `worksFor: { "@id": ORG_ID }` en LinkedIn in `sameAs`. Zet `id`-ankers op de kaarten zodat de `@id`'s naar echte fragmenten wijzen. **Weeg bewust af** of je e-mail en telefoon van medewerkers in JSON-LD zet — dat maakt ze machineleesbaar voor scrapers.
- **Testimonials:** er is er precies één, anoniem ("Project Manager, Technip Energies"). Vervang door minimaal drie met naam, functie en bedrijf; markeer met `Review`-schema.
- **Cases:** `/nl/cases/[slug]`, 400-600 woorden (situatie, gevraagd profiel, doorlooptijd, resultaat), gelinkt vanaf de bijbehorende sector- en dienstpagina. Q4S toont 20 echte klantlogo's (Bilfinger, Van Oord, Damen, Strukton, DEME, Feadship) zonder één case erachter — dat is het sterkste ongebruikte asset op de site.
- **Statistieken:** `page.tsx:34-39` hardcodeert 10+/200+/50+/96%. Onderbouw met peildatum ("200+ plaatsingen sinds 2015") of haal de 96% weg als die niet meetbaar is.

---

### 3.7 llms.txt + Privacy/Voorwaarden
**Effort: S**

**`public/llms.txt`** (pas zinvol ná item 1.1 — het bestand geeft nu 404):
- Regel 44-45: `/nl/ndt` en `/en/ndt` → de nieuwe NDT-URL
- Regel 30: "VCA" → "VCU"
- Services-sectie (regels 8-14): 5 diensten terwijl er 6 zijn — "Projectuitvoering" ontbreekt
- Ontbrekend in Pages: `/nl/cv-uploaden`, `/en/upload-cv`, `/en/contact`
- Alle URL's naar de gekozen host
- Lijstitems als `- [Naam](url): notitie` conform de llmstxt-spec (nu platte tekst)
- Voeg NL-termen toe — het bestand is volledig Engelstalig op een NL-first domein: "detachering technisch personeel", "technische werving en selectie", "QA/QC inspecteurs inhuren", "NDT-inspecteur detacheren", "Barendrecht / regio Rotterdam / Botlek"
- "Founded: 2015" **eerst tegen het KvK-uittreksel checken** voordat je iets wijzigt — LinkedIn zegt 2017. Consistent maken met `layout.tsx:100`.
- Claims "200+ placements, 96% client satisfaction" alleen laten staan als er een bronpagina is

**Privacy/voorwaarden:** `messages/nl.json:761-762` definieert `"privacy"` en `"terms"`, maar er is geen route en `Footer.tsx` rendert ze niet — terwijl drie endpoints cv's en persoonsgegevens verwerken. Voeg routes toe (`/privacybeleid`, `/algemene-voorwaarden`), render de bestaande keys in `Footer.tsx:166-176`, en verwijs vanaf elke verzendknop naar het privacybeleid. AVG + conversie, niet SEO.

---

## Wat Q4S zelf moet doen — niet in code op te lossen

| Actie | Waarom het blokkerend is | Prioriteit |
|---|---|---|
| **Google Search Console koppelen** (DNS-TXT of HTML-metatag, niet het HTML-bestand — dat 404't) en sitemap indienen na item 1.1 | Zonder GSC geen indexdekkingsdata, geen zoekwoorddata, geen URL-inspectie, en geen manier om de effecten van deze roadmap te meten. Randvoorwaarde, geen extraatje. | **Nu** |
| **Vercel Domains:** apex als primary domain zetten (of www + code aanpassen) | De 307 komt uit de Vercel-config, niet uit de codebase. Item 1.2 kan zonder deze beslissing niet af. | **Nu** |
| **Google Business Profile claimen/optimaliseren** (place-id `/g/11hyzxfg7v`, categorie employment_agency bestaat al) | Het GBP stuurt het local pack aan — LocalBusiness-markup doet dat niet. Levert meteen het tweede `sameAs`-anker. | **Nu** |
| **LinkedIn-bedrijfspagina** consistent maken met de site (oprichtingsjaar!) en persoonlijke profielen van Simon, Paul en Gjil aanleveren | `sameAs` en Person-schema kunnen niet naar niet-bestaande URL's wijzen. Google gebruikt de LinkedIn-pagina óók als corroboratie voor `hiringOrganization`. | Fase 1-3 |
| **Actuele SNA-verklaring + ISO 9001- en VCU-PDF's** aanleveren | De SNA-verklaring is van 10-11-2020; de ISO/VCU-documenten staan op een verdwenen oude-site-URL. | Fase 1 |
| **Vacaturedatums en salarisbandbreedtes** per vacature bij de opdrachtgever opvragen | 4 van de 5 vacatures hebben alleen "marktconform" — dat mag niet in `baseSalary` en kost het salarislabel/-filter in Google for Jobs. Alle 5 hebben dezelfde datePosted van 4 maanden geleden. | Fase 1 |
| **Echte plaatsnamen per vacature** ("Botlek, Rotterdam" i.p.v. "Zuid-Holland, Nederland") | `jobLocation` is een REQUIRED property en Google for Jobs is locatiegedreven. 4 van de 5 zijn nu ongeocodeerbaar. | Fase 1 |
| **Openingstijden vaststellen en publiceren** | `openingHoursSpecification` mag pas in schema als het zichtbaar op de site staat. | Fase 2 |
| **Fotografie** (12-15 beelden: kantoor, team, inspecteurs aan het werk) + **portretten** van Simon en Paul | Blokkeert og:image, Article.image, Discover, Google Images en het complete E-E-A-T-bewijs. Zonder dit blijft de site beeldloos. | Fase 2/3 |
| **3-5 klantcases + 3 testimonials met naam/functie/bedrijf** | 20 klantlogo's zonder één case erachter. Dit is het sterkste ongebruikte asset. | Fase 3 |
| **Echte tarief- en salariscijfers** uit eigen plaatsingen voor de kennisbank | Artikel 7 en 11 hebben alleen waarde met eigen cijfers — dat is de vakkennis waarmee je van de aggregators wint. Ook het meest gelinkte contenttype in deze markt. | Fase 3 |
| **Backlinks:** SNA-register, brancheorganisaties, KvK-vestigingspagina, sectorplatforms, klantpagina's ("onze leveranciers") | Geen enkele codewijziging levert autoriteit. De SNA-registerpagina op normeringarbeid.nl is een gezaghebbend, geïndexeerd profiel — verifieer de vermelding en link er sitewide naartoe. | Doorlopend |
| **NL-proefleesronde** over `messages/nl.json` vóór de nieuwe landingspagina's | "approximately", "Skandinavische", "Tezelfdertijd" — machinaal-vertaalsignalen op de pagina's die vakspecialisme moeten uitstralen. | Fase 1 |

---

## Wat ik afraad — expliciet niet doen

| Voorstel | Waarom niet |
|---|---|
| **5-6 regiopagina's tegelijk** (`/regio/rotterdam-rijnmond`, `/moerdijk`, `/eemshaven`, `/antwerpen`, `/noordzeekanaalgebied`) | Bij 8 statische routes is dit letterlijk doorway-terrein: dezelfde brontekst met een plaatsnaam-vervanging. Google straft dit actief af en het kannibaliseert `/diensten`. Bouw er **één**, met unieke inhoud, en breid pas uit als die aantoonbaar rankt. |
| **6 sectorpagina's uit de bestaande copy "recyclen"** | De sectorcontent is één zin per sector (~15 woorden), en die wordt momenteel niet eens gerenderd. "Recyclen" levert 6 lege pagina's. Alles moet nieuw geschreven — en het is tweede-orde na de dienstpagina's. |
| **FAQPage-schema bouwen vóór de rich result** | Google beperkt FAQ-rich-results sinds 8 augustus 2023 tot "well-known, authoritative government and health websites". q4s.nl krijgt die snippet niet. Bouw FAQ's voor de citeerbare HTML-alinea's en de long-tail; schema mag mee, maar verkoop het niet als SERP-winst. |
| **HowTo-markup op `wayWeWork.steps`** | Google heeft de HowTo-rich-result in 2023 volledig ingetrokken. Nul opbrengst. |
| **`potentialAction: SearchAction` / sitelinks-searchbox** | Wereldwijd uitgezet op 21 november 2024. Het `WebSite`-type zelf blijft nuttig voor de sitenaam — de SearchAction niet. |
| **Expliciete allow-regels voor GPTBot/ClaudeBot/PerplexityBot in robots.txt** | Die crawlers zijn standaard toegestaan zolang er geen Disallow staat. Een expliciete `Allow: /` voegt letterlijk nul toe aan wat er al geldt. |
| **`Host:`-directive in robots.txt** | Yandex-only; Google en Bing negeren het. Lost het www-probleem niet op — dat hoort in Vercel + canonicals. |
| **`<link rel="alternate" type="text/markdown" href="/llms.txt">`** | Geen erkend discovery-mechanisme voor enige crawler. |
| **`applicantLocationRequirements` op de huidige vacatures** | Google staat die property alleen toe bij 100% remote functies, gecombineerd met `jobLocationType: TELECOMMUTE`. Deze vijf rollen zijn on-site/reizend — het is onjuiste markup. |
| **`employmentUnit: { "@id": ORG_ID }`** | Duidt een afdeling/subOrganization aan, niet de werkgever. Betekenisloos hier. |
| **Het JobPosting-blok alleen voor `locale === "nl"` renderen** | Haalt de EN-vacatures uit Google for Jobs terwijl v3 letterlijk "Nederland / Internationaal" is en `areaServed` NL/BE/DE/NO/GB claimt. Netto verlies. De juiste oplossing is een gedeelde `identifier` op beide talen. |
| **Keyword-injectie in bestaande dunne teksten** | De 20 ontbrekende head-termen horen in de nieuwe landingspagina's, niet als losse zinnen in 90-woordige dienstblokken. |
| **`priceRange` op LocalBusiness** | Google gebruikt het niet meer voor LocalBusiness. |
| **`vatID`/`hasCertification` als rankingmaatregel verkopen** | Geen enkele Google-functie consumeert deze velden. Ze kosten drie regels en zijn goed voor entiteitsreconciliatie — verwacht er geen positiewinst van. |
| **`ItemList` op `/vacatures` als rich-result-play** | Google's carrousels dekken een vaste lijst contenttypes waar JobPosting niet bij zit. Het blijft een zwak inhoudsopgave-signaal. Bovendien is de premisse onjuist dat de detaillinks client-side-only zijn — `VacanciesClient.tsx` heeft geen mount-guard, dus de `<Link>`-anchors staan gewoon in de SSR-HTML. |
| **JSON-LD uit `<head>` verplaatsen** | De Next-docs raden dat nergens aan; de waarschuwing over handmatige `<head>`-tags gaat over `<title>`/`<meta>`. De json-ld-guide zegt expliciet dat het script in `layout.js` of `page.js` hoort. Laat staan. |
| **`humans.txt`** | Dode conventie, nul lezers. `security.txt` heeft merit als security-hygiëne, niet als SEO-maatregel — laagste prioriteit van de hele lijst. |
| **Google-verificatie via `googleXXXX.html` in `public/`** | Wordt door de proxy-matcher naar `/nl/...` geredirect en 404't. Gebruik DNS-TXT of de metatag. |
| **`generateStaticParams` toevoegen aan de detailroutes** | Bestaat al (`vacancies/[id]:8-10`, `news/[id]:17-27`). Alleen `setRequestLocale` ontbreekt. |
| **`/ndt` in de legacy-redirectlijst** | `/nl/ndt` 308't al correct via `app/[locale]/ndt/page.tsx:11`. |
| **Redirectketen voor niet-geprefixte paden "oplossen"** | Die komt uit `localePrefix: "always"` en is inherent aan deze routingopzet. `alternateLinks: false` haalt alleen de Link-header weg. Accepteer het; voeg alleen 308's toe voor bekende oude URL's. |

---

## De 5 acties met de meeste rankingwinst — in volgorde

**1. `proxy.ts`-matcher fixen (item 1.1) — S**
De enige bevinding die daadwerkelijk indexatie-infrastructuur breekt. Google krijgt de sitemap nu nergens binnen; 38 URL's — inclusief alle 10 JobPosting-URL's, waarvoor Google expliciet een sitemap aanbeveelt — worden alleen via interne links ontdekt. Ontgrendelt tegelijk `llms.txt`, de SNA-PDF en elke toekomstige root-metadata-route. Eén regel, grootste effect.

**2. Eén host kiezen + `/cv-uploaden` canonical + logo-404 (items 1.2, 1.4, 1.5) — S**
Elke pagina verklaart zichzelf nu canoniek op een host die redirect, en een sitemap op www met uitsluitend apex-URL's wordt als cross-host genegeerd. `/cv-uploaden` en `/en/upload-cv` — de volledige conversiefunnel — canonicaliseren naar de homepage en zijn effectief de-geïndexeerd. En het organisatielogo is op 22 pagina's een 404. Dit zijn drie kleine ingrepen die de fundering onder alle andere SEO-inspanning leggen: zolang ze open staan, is elk item hieronder rendementloos.

**3. JobPosting-overhaul (item 1.6) — M**
Google for Jobs is de enige rich result die voor een technisch detacheringsbureau direct verkeer levert, en die van kandidaten die Q4S vervolgens aan opdrachtgevers verkoopt. Nu wordt ~70% van elke vacaturetekst niet aangeboden (de requirements met CSWIP/PCN/ASNT/PED/ISO 9606 — precies de long-tail), zijn 4 van de 5 locaties ongeocodeerbaar, ontbreekt `validThrough` bij vier maanden oude postings (handhavingsrisico op het hele domein), staat marketingtekst in `baseSalary` en mapt de ZZP-vacature naar `OTHER` in plaats van `CONTRACTOR`.

**4. Dienstcluster + NDT-URL, mét de content erbij (items 2.4 + 2.5) — L**
De grootste structurele leemte. Zes diensten van ~90 woorden op één URL, terwijl elke NL-concurrent die op deze termen rankt exact-match landingspagina's van 1.000+ woorden heeft. NDT is Q4S' meest onderscheidende én minst competitieve onderwerp — en heeft sinds de merge geen eigen URL meer, alleen een anchor. Schrijf eerst, splits daarna: vier lege URL's ranken slechter dan de huidige ene pagina.

**5. Opdrachtgeverspagina afsplitsen + keyword-dragende titles en H1's (items 2.6 + 1.7 + 2.3) — M**
De commercieel waardevolste intentie landt nu op een URL die "cv-uploaden" heet, achter een `display:none`-tab, met een title die naar kandidaten schreeuwt. En geen van de zeven hoofdpagina's heeft een title of H1 waarin "detachering", "werving", "technisch personeel" of "inspecteur" voorkomt — terwijl de goede keyword-titel ongebruikt in `layout.tsx` staat. Title en H1 zijn de twee zwaarste on-page signalen; dit is de goedkoopste positiewinst op pagina's die vandaag al autoriteit hebben.