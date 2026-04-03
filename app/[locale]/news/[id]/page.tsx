import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  content: string;
}

export function generateStaticParams() {
  // IDs are stable — match the article IDs in messages/*.json
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const articles = t.raw("articles") as Article[];
  const article = articles.find((a) => a.id === id);
  if (!article) return { title: "Artikel niet gevonden" };
  return {
    title: `${article.title} | Q4S`,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const articles = t.raw("articles") as Article[];
  const article = articles.find((a) => a.id === id);
  if (!article) notFound();

  const categoryLabels: Record<string, string> = {
    industry: t("categories.industry"),
    company: t("categories.company"),
    insights: t("categories.insights"),
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(locale === "nl" ? "nl-NL" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // Parse content into paragraphs, supporting **bold** markdown
  function renderContent(content: string) {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("**") && block.includes("**\n")) {
        // It's a heading line like "**Title**\n rest"
        const parts = block.split("\n");
        const heading = parts[0].replace(/\*\*/g, "");
        const rest = parts.slice(1).join("\n");
        return (
          <div key={i} className="mb-8">
            <h3 className="text-2xl font-black text-black mb-4 tracking-[-0.02em]">{heading}</h3>
            {rest && <p className="text-lg text-black/75 leading-relaxed">{rest}</p>}
          </div>
        );
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul key={i} className="mb-6 space-y-2 pl-4">
            {items.map((item, j) => {
              const text = item.slice(2);
              // Handle **bold**: in list items
              const parts = text.split(/\*\*(.*?)\*\*/);
              return (
                <li key={j} className="text-lg text-black/75 leading-relaxed list-disc">
                  {parts.map((part, k) =>
                    k % 2 === 1 ? (
                      <strong key={k} className="text-black font-semibold">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </li>
              );
            })}
          </ul>
        );
      }
      // Regular paragraph — handle **bold**
      const parts = block.split(/\*\*(.*?)\*\*/);
      return (
        <p key={i} className="text-lg text-black/75 leading-relaxed mb-6">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-black font-semibold">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });
  }

  const otherArticles = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="bg-black text-white pt-[68px]">
        <div className="max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
          {/* Breadcrumb */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/40 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            {locale === "nl" ? "Alle artikelen" : "All articles"}
          </Link>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8430a] border border-[#e8430a]/30 px-2 py-1">
              {categoryLabels[article.category] ?? article.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/75">
              <Clock size={14} />
              {article.readTime}
            </span>
            <span className="text-sm text-white/75">
              {t("publishedOn")} {formatDate(article.date)}
            </span>
          </div>

          <h1 className="text-[clamp(28px,4.5vw,64px)] font-black leading-[1.0] tracking-[-0.03em] text-white max-w-4xl">
            {article.title}
          </h1>
        </div>
      </section>

      {/* ─── ARTICLE CONTENT ─── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Article body */}
            <article className="lg:col-span-8">
              {/* Lead paragraph */}
              <p className="text-xl text-black/80 leading-relaxed font-medium mb-10 pb-10 border-b border-black/10">
                {article.excerpt}
              </p>

              {/* Content */}
              <div>{renderContent(article.content)}</div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                {/* CTA card */}
                <div className="bg-black text-white p-8 mb-8">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
                    Q4S
                  </p>
                  <h3 className="text-xl font-black leading-tight tracking-[-0.02em] mb-4">
                    {locale === "nl"
                      ? "Op zoek naar technisch talent?"
                      : "Looking for technical talent?"}
                  </h3>
                  <p className="text-base text-white/75 leading-relaxed mb-6">
                    {locale === "nl"
                      ? "Q4S levert gecertificeerde QA/QC en NDT professionals voor uw kritieke projecten."
                      : "Q4S delivers certified QA/QC and NDT professionals for your critical projects."}
                  </p>
                  <Link
                    href="/contact"
                    className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#e8430a] hover:text-white transition-colors"
                  >
                    {locale === "nl" ? "Neem contact op" : "Get in touch"}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* More articles */}
                {otherArticles.length > 0 && (
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-black mb-5">
                      {locale === "nl" ? "Meer artikelen" : "More articles"}
                    </p>
                    <div className="space-y-0 border-t border-black/10">
                      {otherArticles.map((a) => (
                        <Link
                          key={a.id}
                          href={{
                            pathname: "/news/[id]",
                            params: { id: a.id },
                          }}
                          className="group block py-5 border-b border-black/10 hover:pl-2 transition-all duration-200"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e8430a] mb-2">
                            {categoryLabels[a.category] ?? a.category}
                          </p>
                          <h4 className="text-base font-black text-black group-hover:text-black/60 transition-colors leading-snug">
                            {a.title}
                          </h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
