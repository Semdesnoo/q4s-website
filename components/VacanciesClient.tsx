"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { Search, MapPin, Clock, ArrowRight } from "lucide-react";
import { vacancies } from "@/lib/vacancies";

const disciplines = ["QA/QC", "NDT", "Welding", "Inspection", "Engineering"];
const types = ["Contract", "Permanent", "Freelance"];

interface Props {
  translations: {
    searchPlaceholder: string;
    filter: string;
    allDisciplines: string;
    allLocations: string;
    allTypes: string;
    results: string;
    noResults: string;
    applyNow: string;
    learnMore: string;
    openApplicationTitle: string;
    openApplicationBody: string;
    openApplicationButton: string;
  };
  locale: string;
}

export default function VacanciesClient({ translations: tr, locale }: Props) {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    return vacancies.filter((v) => {
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.discipline.toLowerCase().includes(q);
      const matchDiscipline = !discipline || v.discipline === discipline;
      const matchType = !type || v.type === type;
      return matchQuery && matchDiscipline && matchType;
    });
  }, [query, discipline, type]);

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale === "nl" ? "nl-NL" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <>
      {/* Search + Filters */}
      <div className="bg-black border-b border-white/10 sm:sticky top-[68px] z-40">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder={tr.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#e8430a] bg-transparent transition-colors duration-200"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="h-11 px-3 border border-white/15 text-sm text-white/60 bg-black focus:outline-none focus:border-[#e8430a] cursor-pointer transition-colors duration-200"
              >
                <option value="">{tr.allDisciplines}</option>
                {disciplines.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-11 px-3 border border-white/15 text-sm text-white/60 bg-black focus:outline-none focus:border-[#e8430a] cursor-pointer transition-colors duration-200"
              >
                <option value="">{tr.allTypes}</option>
                {types.map((tp) => (
                  <option key={tp} value={tp}>{tp}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[11px] text-white/30 mt-2 uppercase tracking-[0.15em]">
            {filtered.length} {tr.results}
          </p>
        </div>
      </div>

      {/* Vacancy list */}
      <div className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {filtered.length === 0 ? (
            <p className="text-black/40 text-center py-20">{tr.noResults}</p>
          ) : (
            <div className="border-t border-black/10">
              {filtered.map((v) => (
                <div
                  key={v.id}
                  className="group border-b border-black/10 py-8 hover:bg-black/[0.02] transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 border border-black/15 text-black/50">
                          {v.discipline}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] px-2.5 py-1 border border-black/15 text-black/50">
                          {v.type}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-black mb-2 tracking-[-0.02em]">
                        {v.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-xs text-black/40 mb-3">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={12} />
                          {v.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {formatDate(v.posted)}
                        </span>
                      </div>
                      <p className="text-sm text-black/50 leading-relaxed line-clamp-2 max-w-2xl">
                        {v.description}
                      </p>
                    </div>
                    <div className="flex gap-2 sm:gap-3 shrink-0">
                      <Link
                        href={{
                          pathname: "/vacancies/[id]",
                          params: { id: v.id },
                        }}
                        className="group/btn inline-flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 border border-black/20 text-black text-[10px] sm:text-xs font-semibold uppercase tracking-[0.08em] sm:tracking-[0.1em] hover:border-black transition-colors duration-200"
                      >
                        {tr.learnMore}
                      </Link>
                      <Link
                        href={{ pathname: "/contact", query: { vacancy: v.id } }}
                        className="group/btn inline-flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 bg-black text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.08em] sm:tracking-[0.1em] hover:bg-black/80 transition-colors duration-200"
                      >
                        {tr.applyNow}
                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Open application CTA */}
          <div className="mt-16 border border-black/10 p-10 text-center">
            <h3 className="text-2xl font-black text-black mb-3 tracking-[-0.03em]">{tr.openApplicationTitle}</h3>
            <p className="text-sm text-black/50 mb-8 max-w-md mx-auto leading-relaxed">{tr.openApplicationBody}</p>
            <Link
              href="/upload-cv"
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-[#e8430a] text-white font-semibold text-sm uppercase tracking-[0.1em] hover:bg-[#c73508] transition-colors"
            >
              {tr.openApplicationButton}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
