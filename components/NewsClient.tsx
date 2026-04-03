"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
}

interface Props {
  articles: Article[];
  readMore: string;
  publishedOn: string;
  categories: { all: string; industry: string; company: string; insights: string };
  locale: string;
}

function ArticleCard({ article, readMore, catLabel, locale, index }: {
  article: Article;
  readMore: string;
  catLabel: string;
  locale: string;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(locale === "nl" ? "nl-NL" : "en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  }

  return (
    <Link
      ref={ref}
      href={{ pathname: "/news/[id]", params: { id: article.id } }}
      className="group bg-white p-8 flex flex-col hover:bg-black hover:shadow-2xl transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease, transform 0.6s ease, background-color 0.5s ease, box-shadow 0.5s ease`,
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Category tag */}
      <div className="mb-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8430a] border border-[#e8430a]/40 px-2 py-1 group-hover:border-[#e8430a] transition-colors duration-500">
          {catLabel}
        </span>
      </div>

      <h2 className="text-xl font-black text-black group-hover:text-white mb-4 leading-[1.2] tracking-[-0.02em] flex-1 transition-colors duration-500">
        {article.title}
      </h2>
      <p className="text-base text-black/55 group-hover:text-white/70 leading-relaxed mb-6 transition-colors duration-500">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto pt-5 border-t border-black/8 group-hover:border-white/15 transition-colors duration-500">
        <div className="flex items-center gap-3 text-xs text-black/35 group-hover:text-white/50 transition-colors duration-500">
          <span>{formatDate(article.date)}</span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {article.readTime}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-black group-hover:text-[#e8430a] transition-colors duration-500">
          {readMore}
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}

export default function NewsClient({ articles, readMore, publishedOn, categories, locale }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const cats = [
    { key: "all", label: categories.all },
    { key: "industry", label: categories.industry },
    { key: "company", label: categories.company },
    { key: "insights", label: categories.insights },
  ];

  return (
    <>
      {/* Category filter */}
      <div className="bg-black sticky top-[68px] z-40 border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {cats.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`relative shrink-0 px-6 py-5 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                  activeCategory === c.key
                    ? "text-white"
                    : "text-white/30 hover:text-white/70"
                }`}
              >
                {c.label}
                {/* Active indicator */}
                <span
                  className="absolute bottom-0 left-0 h-0.5 bg-[#e8430a] transition-all duration-300"
                  style={{ width: activeCategory === c.key ? "100%" : "0%" }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/8">
            {filtered.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                readMore={readMore}
                catLabel={cats.find((c) => c.key === article.category)?.label ?? ""}
                locale={locale}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
