This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Omgevingsvariabelen

Zet deze in `.env.local` (lokaal) en in Vercel bij **Project Settings → Environment Variables** (productie):

| Variabele | Waarvoor |
| --- | --- |
| `RESEND_API_KEY` | Versturen van de formulier-mails via Resend. |
| `MAIL_FROM` | Afzender, standaard `Q4S Website <noreply@q4s.nl>`. |
| `CV_MAIL_TO` | Ontvanger CV-formulier, standaard `cv@q4s.nl`. |
| `ASSIGNMENT_MAIL_TO` | Ontvanger opdrachtgever-formulier, standaard `info@q4s.nl`. |
| `CONTACT_MAIL_TO` | Ontvanger contactformulier, standaard `info@q4s.nl`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Publieke sleutel van de Cloudflare Turnstile-widget. |
| `TURNSTILE_SECRET_KEY` | Geheime sleutel waarmee de server het token controleert. |

### Turnstile (bot-beveiliging)

De drie formulieren (CV, opdrachtgever, contact) laten zich pas versturen nadat de
bezoeker de Cloudflare Turnstile-check heeft gehaald. De server controleert het
token opnieuw in `lib/turnstile.ts` voordat er een mail uitgaat.

Sleutels aanmaken: [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile** →
widget toevoegen voor domein `q4s.nl` (gratis, Managed-modus).

- Ontbreekt `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, dan wordt de widget niet getoond.
- Ontbreekt `TURNSTILE_SECRET_KEY` in productie, dan worden inzendingen geweigerd
  (liever een storing die opvalt dan spam die stilletjes doorloopt). Lokaal wordt
  de controle overgeslagen.
- Voor lokaal testen kun je de testsleutels van Cloudflare gebruiken:
  site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.
