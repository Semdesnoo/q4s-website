"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";

const dienstenItems = [
  { key: "ourServices", href: "/services" },
  { key: "wayWeWork", href: "/way-we-work" },
  { key: "ndt", href: "/ndt" },
  { key: "vacancies", href: "/vacancies" },
] as const;

const topNavKeys = [
  { key: "about", href: "/about" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dienstenOpen, setDienstenOpen] = useState(false);
  const [mobileDienstenOpen, setMobileDienstenOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDienstenOpen(false);
    setMobileDienstenOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDienstenOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLocale() {
    const next = locale === "nl" ? "en" : "nl";
    const pathWithoutLocale = pathname.replace(/^\/(nl|en)/, "") || "/";
    router.push(`/${next}${pathWithoutLocale}`);
  }

  const isDienstenActive = dienstenItems.some(({ href }) =>
    pathname.includes(href.replace(/^\//, ""))
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-sm border-b border-white/10"
          : "bg-black border-b border-white/10"
      }`}
      style={{ height: "68px" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Q4S-Transparent.png"
            alt="Q4S"
            width={120}
            height={60}
            className="h-14 w-auto object-contain invert"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0">
          {/* Diensten dropdown */}
          <div ref={dropdownRef} className="relative">
            <Link
              href="/services"
              onMouseEnter={() => setDienstenOpen(true)}
              onMouseLeave={() => setDienstenOpen(false)}
              className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                isDienstenActive ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {t("services")}
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${dienstenOpen ? "rotate-180" : ""}`}
              />
            </Link>

            {/* Dropdown panel */}
            <div
              onMouseEnter={() => setDienstenOpen(true)}
              onMouseLeave={() => setDienstenOpen(false)}
              className={`absolute top-full left-0 mt-0 w-52 bg-black border border-white/10 transition-all duration-200 ${
                dienstenOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              {dienstenItems.map(({ key, href }) => {
                const isActive = pathname.includes(href.replace(/^\//, ""));
                return (
                  <Link
                    key={key}
                    href={href as "/"}
                    className={`block px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-150 border-b border-white/5 last:border-0 ${
                      isActive
                        ? "text-white bg-white/5"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {t(key)}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Top-level nav items */}
          {topNavKeys.map(({ key, href }) => {
            const isActive = pathname.includes(href.replace(/^\//, ""));
            return (
              <Link
                key={key}
                href={href as "/"}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        {/* Right side: CTA + Lang switcher */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50 hover:text-white transition-colors duration-200 px-2 py-1"
          >
            {locale === "nl" ? "EN" : "NL"}
          </button>
          <Link
            href="/vacancies"
            className="px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] bg-[#e8430a] text-white hover:bg-[#c73508] transition-colors duration-200"
          >
            {t("findTalent")}
          </Link>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors px-2"
          >
            {locale === "nl" ? "EN" : "NL"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-white"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[68px] left-0 right-0 bg-black border-t border-white/10">
          <nav className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col gap-0">
            {/* Diensten accordion */}
            <div>
              <button
                onClick={() => setMobileDienstenOpen((v) => !v)}
                className="w-full flex items-center justify-between py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/60 hover:text-white border-b border-white/10 transition-colors"
              >
                {t("services")}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${mobileDienstenOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileDienstenOpen && (
                <div className="pl-4 bg-white/2">
                  {dienstenItems.map(({ key, href }) => (
                    <Link
                      key={key}
                      href={href as "/"}
                      className="block py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/50 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                    >
                      {t(key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {topNavKeys.map(({ key, href }) => (
              <Link
                key={key}
                href={href as "/"}
                className="py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/60 hover:text-white border-b border-white/10 last:border-0 transition-colors"
              >
                {t(key)}
              </Link>
            ))}
            <div className="mt-5 pt-5 border-t border-white/10">
              <Link
                href="/vacancies"
                className="block text-center py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#e8430a] text-white"
              >
                {t("findTalent")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
