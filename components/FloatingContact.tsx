"use client";

import { Phone, Mail } from "lucide-react";

function LinkedInIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

const buttons = [
  {
    icon: (size: number) => <Phone size={size} className="text-white shrink-0" />,
    label: "Bellen",
    href: "tel:+31857826818",
    title: "+31 085 7826818",
  },
  {
    icon: (size: number) => <Mail size={size} className="text-white shrink-0" />,
    label: "Mailen",
    href: "mailto:info@q4s.nl",
    title: "info@q4s.nl",
  },
  {
    icon: (size: number) => <LinkedInIcon size={size} />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/q4s/?viewAsMember=true",
    title: "Q4S op LinkedIn",
  },
];

export default function FloatingContact() {
  return (
    <div className="fixed right-0 top-1/3 -translate-y-1/2 z-50 flex flex-col gap-1.5">
      {buttons.map(({ icon, label, href, title }) => (
        <a
          key={label}
          href={href}
          title={title}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="group flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-[#e8430a] hover:bg-[#c73508] transition-colors duration-200"
        >
          <span className="sm:hidden">{icon(16)}</span>
          <span className="hidden sm:flex">{icon(20)}</span>
        </a>
      ))}
    </div>
  );
}
