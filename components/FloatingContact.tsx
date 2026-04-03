"use client";

import { Phone, Mail } from "lucide-react";

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

const buttons = [
  {
    icon: <Phone size={20} className="text-white shrink-0" />,
    label: "Bellen",
    href: "tel:+31857826818",
    title: "+31 085 7826818",
  },
  {
    icon: <Mail size={20} className="text-white shrink-0" />,
    label: "Mailen",
    href: "mailto:info@q4s.nl",
    title: "info@q4s.nl",
  },
  {
    icon: <LinkedInIcon />,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/q4s/?viewAsMember=true",
    title: "Q4S op LinkedIn",
  },
];

export default function FloatingContact() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-px">
      {buttons.map(({ icon, label, href, title }) => (
        <a
          key={label}
          href={href}
          title={title}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex items-center justify-center w-12 h-12 bg-[#e8430a] hover:bg-[#c73508] transition-colors duration-200"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
