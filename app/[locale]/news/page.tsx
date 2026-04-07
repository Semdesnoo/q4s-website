import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import NewsClient from "@/components/NewsClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("hero.title") };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const articles = t.raw("articles") as Array<{
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
  }>;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10 lg:py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 mb-8">
            {t("hero.label")}
          </p>
          <h1 className="text-[clamp(48px,7vw,96px)] font-black leading-[0.95] tracking-[-0.04em] text-white max-w-4xl">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-white/75 max-w-xl mt-8 leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      <NewsClient
        articles={articles}
        readMore={t("readMore")}
        publishedOn={t("publishedOn")}
        locale={locale}
        categories={{
          all: t("categories.all"),
          industry: t("categories.industry"),
          company: t("categories.company"),
          insights: t("categories.insights"),
        }}
      />
    </>
  );
}
