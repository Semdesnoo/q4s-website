import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { LOGO_URL, SITE_URL } from "@/lib/site";
import { jsonLd, ORG_ID } from "@/lib/schema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingContact from "@/components/FloatingContact";
import RecruiterCard from "@/components/RecruiterCard";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "900"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const defaultTitle =
    locale === "nl"
      ? "Q4S | Technische Werving & Detachering | QA/QC Specialisten"
      : "Q4S | Technical Recruitment & Secondment | QA/QC Specialists";

  const defaultDescription =
    locale === "nl"
      ? "Q4S is gespecialiseerd in technische werving en detachering voor de industriële sector. Wij plaatsen QA/QC inspecteurs, NDT-specialisten en technisch personeel voor kritieke projecten in Nederland en internationaal."
      : "Q4S specialises in technical recruitment and secondment for the industrial sector. We place QA/QC inspectors, NDT specialists and technical personnel for critical projects in the Netherlands and internationally.";

  return {
    title: {
      default: defaultTitle,
      template: "%s | Q4S",
    },
    description: defaultDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: locale === "nl" ? "/nl" : "/en",
      languages: {
        "x-default": "/nl",
        nl: "/nl",
        en: "/en",
      },
    },
    openGraph: {
      siteName: "Q4S",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      alternateLocale: locale === "nl" ? "en_US" : "nl_NL",
    },
    twitter: {
      card: "summary_large_image",
      site: "@Q4S_nl",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "nl" | "en")) {
    notFound();
  }

  // Zonder dit leest next-intl de locale uit de request-headers en wordt élke
  // route dynamisch gerenderd — live betekende dat `Cache-Control: no-store` en
  // een serverfunctie in Washington DC voor Nederlandse bezoekers. TTFB is de
  // grootste vaste component van LCP, dus dit is puur snelheidswinst.
  setRequestLocale(locale);

  const allMessages = await getMessages();
  // Only send the "nav" namespace to the client — Header is the only client
  // component that calls useTranslations(). All other client components
  // receive their text as props from server components.
  const messages = { nav: allMessages.nav };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EmploymentAgency", "LocalBusiness"],
    // Gedeelde identifier: JobPosting en Article verwijzen hiernaar in plaats van
    // een eigen kale Organization te herhalen. Zonder dit ziet Google vier losse
    // "Q4S B.V."-knopen en telt het adres, oprichtingsjaar en knowsAbout niet mee
    // voor de geloofwaardigheid van de werkgever in Google for Jobs.
    "@id": ORG_ID,
    name: "Q4S B.V.",
    alternateName: "Q4S",
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: "+31857826818",
    description:
      locale === "nl"
        ? "Q4S B.V. is gespecialiseerd in technische werving en detachering voor de industriële sector. Wij plaatsen QA/QC inspecteurs, NDT-specialisten en technisch personeel voor kritieke projecten in Nederland en internationaal."
        : "Q4S B.V. specialises in technical recruitment and secondment for the industrial sector. We place QA/QC inspectors, NDT specialists and technical personnel for critical projects in the Netherlands and internationally.",
    foundingDate: "2015",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Arnhemseweg 12",
      // Mét spatie — dat is de notatie die KvK, Google Business Profile en
      // telefoonboek.nl hanteren. NAP-consistentie telt voor lokale rankings.
      postalCode: "2994 LA",
      addressLocality: "Barendrecht",
      addressRegion: "Zuid-Holland",
      addressCountry: "NL",
    },
    // Exact de coördinaten uit de Maps-embed op de homepage (page.tsx) — die
    // komen uit het Google Business Profile zelf. Schema en GBP moeten letterlijk
    // gelijk zijn; een eigen geocoding-gok maakt het signaal juist zwakker.
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.8593938,
      longitude: 4.51334,
    },
    hasMap: "https://maps.app.goo.gl/tYQRY1YnbHcG8aBR7",
    identifier: [
      { "@type": "PropertyValue", name: "KvK", value: "69073287" },
    ],
    vatID: "NL857718137B01",
    founder: [
      { "@type": "Person", name: "Simon van Houten" },
      { "@type": "Person", name: "Paul Boomsma" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      // Zelfde E.164-notatie als op topniveau en als in alle tel:-links.
      // Twee formats voor hetzelfde nummer verzwakt het NAP-signaal.
      telephone: "+31857826818",
      email: "info@q4s.nl",
      contactType: "customer service",
      availableLanguage: ["Dutch", "English"],
    },
    // Zonder sameAs kan Google Q4S niet als entiteit herkennen. De ?viewAsMember-
    // parameter is een sessieparameter en hoort er niet in.
    // TODO Q4S: voeg hier de Google Business Profile-URL aan toe zodra die geclaimd is.
    sameAs: ["https://www.linkedin.com/company/q4s/"],
    areaServed: ["NL", "BE", "DE", "NO", "GB"],
    knowsAbout: [
      "Technical Recruitment",
      "Technical Secondment",
      "QA/QC",
      "NDT",
      "Source Inspection",
      "Welding Inspection",
      "Detachering",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: locale === "nl" ? "Technische Werving & Selectie" : "Technical Recruitment & Selection",
          description:
            locale === "nl"
              ? "Gerichte werving van QA/QC professionals, NDT-inspecteurs en technische specialisten voor vaste en tijdelijke posities."
              : "Targeted recruitment of QA/QC professionals, NDT inspectors and technical specialists for permanent and temporary positions.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: locale === "nl" ? "Detachering Technisch Personeel" : "Technical Staffing & Secondment",
          description:
            locale === "nl"
              ? "Flexibele detachering van hooggekwalificeerd technisch personeel voor industriële projecten. Volledig ontzorgd — contract, loon en verzekering."
              : "Flexible secondment of highly qualified technical personnel for industrial projects. Fully managed — contract, payroll and insurance.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: locale === "nl" ? "NDT Consultancy" : "NDT Consultancy",
          description:
            locale === "nl"
              ? "Gecertificeerde NDT-inspecteurs (Level II & III) voor UT, RT, MT, PT en visuele inspectie."
              : "Certified NDT inspectors (Level II & III) for UT, RT, MT, PT and visual inspection.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Source Inspection & Expediting",
          description:
            locale === "nl"
              ? "Onafhankelijke source inspecteurs die leveranciersprestaties bewaken bij leveranciers wereldwijd."
              : "Independent source inspectors monitoring supplier performance at supplier sites worldwide.",
        },
      },
    ],
  };

  return (
    <html lang={locale} className={`h-full scroll-smooth ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema)}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <ScrollToTop />
          <FloatingContact />
          <RecruiterCard />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
