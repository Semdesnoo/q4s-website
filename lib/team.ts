export interface TeamMember {
  name: string;
  role: string;
  region?: string;
  email?: string;
  /** Weergave, bv. "+31 6 83859566" */
  phone?: string;
  /** Alleen cijfers met landcode, bv. "31683859566" */
  whatsapp?: string;
  /** Bestand in public/team/, bv. "gjil-de-jong.png" */
  photo?: string;
}

// Vul hier het Q4S-team aan. Zet de foto's in public/team/ en verwijs ernaar
// via `photo`. Velden die je weglaat (bv. photo) tonen een nette fallback.
export const team: TeamMember[] = [
  {
    name: "Simon van Houten",
    role: "Mede Oprichter",
    email: "simon.vanhouten@q4s.nl",
    phone: "+31 6 81599581",
    whatsapp: "31681599581",
  },
  {
    name: "Paul Boomsma",
    role: "Mede Oprichter",
    email: "paul.boomsma@q4s.nl",
    phone: "+31 6 28641249",
    whatsapp: "31628641249",
  },
  {
    name: "Gjil de Jong",
    role: "Talent & Business Consultant",
    email: "Gjil.deJong@q4s.nl",
    phone: "+31 6 83859566",
    whatsapp: "31683859566",
  },
];
