# Q4S — zoekwoorden & Google-setup

Bron van waarheid voor titles/descriptions: `messages/{nl,en}.json` → `seo.*` (gelezen door `lib/seo.ts`).

## 1. Zoekwoord per pagina (waar de site nu op is ingericht)

| Pagina | Hoofdzoekwoord | Neven-zoekwoorden |
|---|---|---|
| `/nl` | technische detachering | technische werving, detacheringsbureau techniek, QA/QC specialisten |
| `/nl/diensten` | technisch personeel inhuren | detachering technisch personeel, werving en selectie techniek, NDT consultancy, source inspection |
| `/nl/vacatures` | vacature QA/QC inspecteur | vacature NDT inspecteur, vacature lasinspecteur, vacatures staalbouw, ZZP opdracht inspecteur |
| `/nl/over-ons` | technisch detacheringsbureau Barendrecht | detacheringsbureau regio Rotterdam |
| `/nl/contact` | Q4S Barendrecht | technische detachering Barendrecht / Rotterdam |
| `/nl/onze-aanpak` | technisch personeel werven | hoe werkt detachering |
| `/nl/cv-uploaden` | werk als QA/QC inspecteur | NDT inspecteur werk, lasinspecteur werk, cv uploaden techniek |
| `/nl/vacatures/<slug>` | "<functietitel> vacature" | functie + plaats (staat automatisch in de title) |

Engels (`/en/...`): technical recruitment agency Netherlands, QA/QC inspector jobs, NDT inspector jobs, welding inspector jobs, hire technical staff.

## 2. Zoekwoordenlijst voor Google Ads (kopieer per advertentiegroep)

Notatie: `[exact]`, `"woordgroep"`. Plaats/regio-targeting: Nederland (+ België voor EN).

**Opdrachtgevers — detachering/inhuur** (hoogste waarde)
```
"technisch personeel inhuren"
"technische detachering"
[technisch detacheringsbureau]
"detachering technisch personeel"
"QA/QC inspecteur inhuren"
"NDT inspecteur inhuren"
"lasinspecteur inhuren"
"inspecteurs inhuren"
"werving en selectie techniek"
"technisch uitzendbureau staalbouw"
"source inspection"
"third party inspection"
"detacheringsbureau rotterdam"
```

**Kandidaten — vacatures**
```
"vacature QA/QC inspecteur"
"vacature NDT inspecteur"
"vacature lasinspecteur"
"welding inspector vacature"
"vacature quality manager staalbouw"
"QC inspecteur vacature"
"NDT level 2 vacature"
"zzp inspecteur opdracht"
"vacature supervisor staalbouw"
```

**Uitsluitingswoorden (negatief)** — voorkomt verspild budget
```
opleiding, cursus, salaris, cao, stage, gratis, wat is, betekenis, auto, apk, bouwkundig, woning
```

## 3. Google Search Console (eenmalig, ±10 min) — doet Sem zelf

1. Ga naar https://search.google.com/search-console → **Property toevoegen** → kies **Domein** → vul `q4s.nl` in.
2. Google geeft een TXT-record. Zet dat in de DNS van q4s.nl (bij de domeinregistrar of Vercel → Domains → q4s.nl → DNS). Klik **Verifiëren**.
   - Gebruik de DNS-methode, niet het HTML-bestand.
3. **Sitemaps** → `https://www.q4s.nl/sitemap.xml` indienen.
4. **URL-inspectie** → `https://www.q4s.nl/nl` en `/nl/diensten` → **Indexering aanvragen** (versnelt het oppakken van de nieuwe titles).
5. Na 2–4 weken: **Prestaties** → tab **Zoekopdrachten** laat zien op welke zoekwoorden Q4S echt verschijnt. Deze lijst bijwerken op basis van die data.

Ook doen: **Google Bedrijfsprofiel** (business.google.com) claimen/aanvullen met dezelfde naam, adres en telefoonnummer als de site:
Q4S B.V., Arnhemseweg 12, 2994 LA Barendrecht, +31 (0) 85 782 6818. Categorie: *Detacheringsbureau* / *Uitzendbureau*.

## 4. Nog open (grootste volgende winst)

Zie `SEO-ROADMAP.md`. Grootste resterende hefbomen:
- Aparte landingspagina's per dienst (detachering, werving, NDT-inspecteur, opdrachtgevers), 700–1.000 woorden elk.
- H1's met zoekwoord (nu "Onze Diensten", "Over Q4S", ...) — visuele wijziging, vraagt akkoord.
- Echte foto's (team, inspecteurs aan het werk) voor Google Afbeeldingen en vertrouwen.
