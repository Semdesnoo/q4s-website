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
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: {
      default: "Q4S — Technical Talent for Critical Projects",
      template: "%s | Q4S",
    },
    description: t("hero.intro"),
    metadataBase: new URL("https://q4s.nl"),
    alternates: {
      canonical: locale === "nl" ? "/nl" : "/en",
      languages: {
        nl: "/nl",
        en: "/en",
        "x-default": "/nl",
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
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    name: "Q4S B.V.",
    alternateName: "Q4S",
    url: "https://q4s.nl",
    logo: "https://q4s.nl/q4s-logo.png",
    description:
      locale === "nl"
        ? "Q4S B.V. verbindt hooggekwalificeerde technische professionals met complexe industriële en infrastructuurprojecten. Gespecialiseerd in QA/QC, NDT, Source Inspection en technische werving."
        : "Q4S B.V. connects highly qualified technical professionals with complex industrial and infrastructure projects. Specialised in QA/QC, NDT, Source Inspection and technical recruitment.",
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
    serviceType: [
      "Technical Recruitment",
      "QA/QC Staffing",
      "NDT Consultancy",
      "Source Inspection",
      "Technical Secondment",
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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
