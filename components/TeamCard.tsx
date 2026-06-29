"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import type { TeamMember } from "@/lib/team";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.5 9.5 0 01-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.45 9.45 0 01-1.45-5.04c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.92.99 6.72 2.79a9.43 9.43 0 012.78 6.71c0 5.24-4.26 9.5-9.5 9.5zM20.5 3.5A11.4 11.4 0 0012.05.5C5.8.5.7 5.6.7 11.86c0 2 .52 3.96 1.52 5.68L.6 23.5l6.1-1.6a11.36 11.36 0 005.35 1.36h.01c6.25 0 11.34-5.1 11.34-11.36 0-3.03-1.18-5.88-3.32-8.04z" />
    </svg>
  );
}

export default function TeamCard({ member }: { member: TeamMember }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const iconLink =
    "flex h-10 w-10 items-center justify-center bg-[#e8430a]/15 text-[#e8430a] transition-colors duration-200 hover:bg-[#e8430a] hover:text-white";

  return (
    <div className="group relative aspect-[3/4] overflow-hidden bg-[#111418]">
      {member.photo && !imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/team/${member.photo}`}
          alt={member.name}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1f25] text-5xl font-black text-white/15 select-none">
          {initials}
        </div>
      )}

      {/* Gradient for legible text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-white">{member.name}</h3>
        <p className="mt-1.5 text-sm leading-snug text-white/75">{member.role}</p>
        {member.region && <p className="mt-2 text-sm text-white/50">{member.region}</p>}

        {(member.email || member.phone || member.whatsapp) && (
          <div className="mt-4 flex items-center gap-2">
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label={`E-mail ${member.name}`} className={iconLink}>
                <Mail size={17} />
              </a>
            )}
            {member.phone && (
              <a href={`tel:${member.phone.replace(/\s/g, "")}`} aria-label={`Bel ${member.name}`} className={iconLink}>
                <Phone size={17} />
              </a>
            )}
            {member.whatsapp && (
              <a
                href={`https://wa.me/${member.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${member.name}`}
                className={iconLink}
              >
                <WhatsAppIcon size={17} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
