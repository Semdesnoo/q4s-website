import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
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
    metadataBase: new URL("https://q4s.nl"),
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

  const allMessages = await getMessages();
  // Only send the "nav" namespace to the client — Header is the only client
  // component that calls useTranslations(). All other client components
  // receive their text as props from server components.
  const messages = { nav: allMessages.nav };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EmploymentAgency", "LocalBusiness"],
    name: "Q4S B.V.",
    alternateName: "Q4S",
    url: "https://q4s.nl",
    logo: "https://q4s.nl/q4s-logo.png",
    description:
      locale === "nl"
        ? "Q4S B.V. is gespecialiseerd in technische werving en detachering voor de industriële sector. Wij plaatsen QA/QC inspecteurs, NDT-specialisten en technisch personeel voor kritieke projecten in Nederland en internationaal."
        : "Q4S B.V. specialises in technical recruitment and secondment for the industrial sector. We place QA/QC inspectors, NDT specialists and technical personnel for critical projects in the Netherlands and internationally.",
    foundingDate: "2015",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Arnhemseweg 12",
      postalCode: "2994LA",
      addressLocality: "Barendrecht",
      addressCountry: "NL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+31-85-7826818",
      email: "info@q4s.nl",
      contactType: "customer service",
      availableLanguage: ["Dutch", "English"],
    },
    sameAs: [],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
      </body>
    </html>
  );
}
