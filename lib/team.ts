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
// via `photo`. Velden die je weglaat (bv. email) tonen simpelweg geen icoon.
export const team: TeamMember[] = [
  {
    name: "Gjil de Jong",
    role: "Talent & Business Consultant",
    phone: "+31 6 83859566",
    whatsapp: "31683859566",
    photo: "gjil-de-jong.png",
  },
  // Voorbeeld — kopieer dit blok per teamlid en vul de echte gegevens in:
  // {
  //   name: "Naam Achternaam",
  //   role: "Functie",
  //   region: "Regio",
  //   email: "naam@q4s.nl",
  //   phone: "+31 6 12345678",
  //   whatsapp: "31612345678",
  //   photo: "naam-achternaam.jpg",
  // },
];
