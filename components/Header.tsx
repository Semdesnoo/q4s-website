"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const navItems = [
  { key: "services", href: "/services" },
  { key: "about", href: "/about" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function switchLocale() {
    const next = locale === "nl" ? "en" : "nl";
    router.replace(
      { pathname, params } as unknown as Parameters<typeof router.replace>[0],
      { locale: next }
    );
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        scrolled
          ? "shadow-[0_2px_24px_rgba(0,0,0,0.09)]"
          : "border-b border-gray-100"
      }`}
      style={{ height: "68px" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/q4slogoOriginalNEW.jpg"
            alt="Q4S"
            width={150}
            height={111}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0">
          {navItems.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200 ${
                isActive(href) ? "text-[#e8430a]" : "text-gray-600 hover:text-[#e8430a]"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side: CTA buttons + Lang switcher */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/vacancies"
            className="px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] bg-[#e8430a] text-white hover:bg-[#c73508] transition-colors duration-200"
          >
            {t("vacancies")}
          </Link>
          <Link
            href="/way-we-work"
            className="px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] border border-gray-300 text-gray-700 hover:border-[#000000] hover:text-[#000000] transition-colors duration-200"
          >
            {t("forClients")}
          </Link>
          <button
            onClick={switchLocale}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 hover:text-gray-900 transition-colors duration-200 px-2 py-1"
          >
            {locale === "nl" ? "EN" : "NL"}
          </button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors px-2"
          >
            {locale === "nl" ? "EN" : "NL"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-gray-700"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[68px] left-0 right-0 bg-white border-t border-gray-100 shadow-xl">
          <nav className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col gap-0">
            {navItems.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="py-3 text-sm font-bold uppercase tracking-[0.12em] text-gray-600 hover:text-[#e8430a] border-b border-gray-100 last:border-0 transition-colors"
              >
                {t(key)}
              </Link>
            ))}
            <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-3">
              <Link
                href="/vacancies"
                className="block text-center py-2.5 text-xs font-semibold uppercase tracking-wider bg-[#e8430a] text-white hover:bg-[#c73508] transition-colors"
              >
                {t("vacancies")}
              </Link>
              <Link
                href="/way-we-work"
                className="block text-center py-2.5 text-xs font-semibold uppercase tracking-wider border border-gray-300 text-gray-700 hover:border-[#000000] hover:text-[#000000] transition-colors"
              >
                {t("forClients")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
