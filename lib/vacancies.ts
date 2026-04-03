export interface Vacancy {
  id: string;
  title: string;
  location: string;
  type: string;
  discipline: string;
  description: string;
  posted: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  salary: string;
}

export const vacancies: Vacancy[] = [
  {
    id: "v1",
    title: "Inspecteur Drukapparatuur (ZZP / Project)",
    location: "Zuid-Holland, Nederland",
    type: "Freelance",
    discipline: "Inspection",
    description: "Voor een project op een terminal zijn wij op zoek naar een ervaren inspecteur die zelfstandig een inventarisatie kan uitvoeren van drukapparatuur en toestellen. Project van ca. 3 maanden, circa 300–400 toestellen.",
    posted: "2026-04-01",
    about: "Voor een van onze opdrachtgevers op een terminal in Zuid-Holland zijn wij op zoek naar een ervaren inspecteur drukapparatuur. Het gaat om een project van approximately 3 maanden (fulltime), waarbij je circa 300–400 toestellen en drukvaten in kaart brengt. Je werkt zelfstandig op locatie en rapporteert rechtstreeks aan de leidinginspecteur. Project start op korte termijn.",
    responsibilities: [
      "Inventariseren van drukapparatuur en toestellen op locatie",
      "Vastleggen van technische gegevens per toestel",
      "Controleren van aanwezige documentatie (o.a. PED)",
      "Opstellen van duidelijke en gestructureerde rapportages",
      "Terugkoppeling naar de leidinginspecteur op de terminal",
      "Bijhouden van voortgangsoverzicht van geïnventariseerde toestellen",
    ],
    requirements: [
      "Ervaring als inspecteur in een industriële omgeving",
      "Bekend met drukvaten en drukapparatuur",
      "Kennis van de Pressure Equipment Directive (PED) is gewenst",
      "Zelfstandig kunnen werken en overzicht houden",
      "Goede rapportagevaardigheden in het Nederlands",
      "Beschikbaar voor ca. 3 maanden fulltime",
    ],
    nice_to_have: [
      "IKT2 certificering",
      "Ervaring op terminals of petrochemische installaties",
      "Kennis van relevante Nederlandse wet- en regelgeving voor drukapparatuur",
    ],
    salary: "Marktconform dagtarief, afhankelijk van ervaring",
  },
  {
    id: "v2",
    title: "Quality Assurance Business Partner",
    location: "Zuid-Holland, Nederland",
    type: "Permanent",
    discipline: "QA/QC",
    description: "Q4S zoekt een strategische QA Business Partner die het management uitdaagt, processen transformeert en kwaliteitsbeleid van strategie naar praktijk brengt. Geen uitvoerende rol — maar een positie op directieniveau.",
    posted: "2026-04-01",
    about: "Q4S zoekt een Quality Assurance Business Partner voor een opdrachtgever in Zuid-Holland. Geen uitvoerende rol — maar een positie waarin jij het management uitdaagt, processen transformeert en kwaliteitsbeleid van strategie naar praktijk brengt. Je opereert op zowel strategisch als operationeel niveau en bent de schakel tussen directie en werkvloer.",
    responsibilities: [
      "Strategische sparringpartner zijn voor het management op kwaliteitsgebied",
      "Bouwen aan een toekomstbestendig kwaliteitsframework",
      "Vertalen van complexe contracteisen naar werkbare oplossingen",
      "Uitvoeren van audits en root cause analyses",
      "Monitoren van KPI's en rapporteren aan directie",
      "Verbinden van teams en afdelingen rondom kwaliteitsdoelstellingen",
    ],
    requirements: [
      "Ruime ervaring in kwaliteitsmanagement (ISO 9001 o.v.)",
      "Thuis in een technische of industriële omgeving",
      "Sterk in adviseren én verbinden op directieniveau",
      "Zowel analytisch als pragmatisch ingesteld",
      "Uitstekende communicatieve vaardigheden in Nederlands en Engels",
    ],
    nice_to_have: [
      "Lead Auditor certificering ISO 9001",
      "Ervaring met kwaliteitsmanagement in offshore of petrochemie",
      "Kennis van risicomanagement methodologieën (FMEA, RCA)",
    ],
    salary: "Marktconform, afhankelijk van ervaring — loondienst via detachering of deta-vast",
  },
  {
    id: "v3",
    title: "Lasser — Zware Industrie / Offshore",
    location: "Nederland / Internationaal",
    type: "Contract",
    discipline: "Welding",
    description: "Wij zoeken lassers met een passie voor het vak en ervaring in de zware industrie of offshore. MIG/MAG, SAW of TIG gecertificeerd? Dan willen wij jou spreken.",
    posted: "2026-04-01",
    about: "Wij zijn op zoek naar lassers met een passie voor het vak en ervaring in de zware industrie of offshore. Mensen die trots zijn op hun werk en weten wat kwaliteit betekent. Je werkt aan uitdagende projecten in de zware industrie, offshore, windenergie of scheepsbouw, waarbij kwaliteit en veiligheid centraal staan.",
    responsibilities: [
      "Uitvoeren van las-werkzaamheden conform WPS-procedures",
      "Werken aan constructiestaal, speciale legeringen of pijpleidingen",
      "Samenwerken met welding inspectors en QC-personeel",
      "Bijhouden van lasregisters en kwaliteitsdocumentatie",
      "Signaleren en rapporteren van afwijkingen",
      "Naleven van veiligheids- en kwaliteitsstandaarden op locatie",
    ],
    requirements: [
      "Geldige lascertificaten: MIG/MAG (136/138), SAW (121) of TIG (141)",
      "ISO 9606 of AWS D1.1 kwalificatie",
      "Minimaal 3 jaar ervaring in de zware industrie, offshore, windenergie of scheepsbouw",
      "Gewend aan werken met WPS-procedures en kwaliteitsinspecties",
      "Bereid om op locatie of offshore te werken",
    ],
    nice_to_have: [
      "Ervaring met (hoog)constructiestaal of speciale legeringen",
      "VCA-certificering",
      "Offshore certificates (BOSIET, GWO)",
    ],
    salary: "Marktconform, afhankelijk van certificeringen en ervaring",
  },
  {
    id: "v4",
    title: "Lascoördinator Railinfra",
    location: "Nederland",
    type: "Permanent",
    discipline: "Welding",
    description: "Als lascoördinator stuur je lasprojecten aan in het spoorwegennet. Je coördineert projecten, adviseert op basis van expertise en zorgt voor kwalificaties van medewerkers.",
    posted: "2026-04-01",
    about: "Als Lascoördinator Railinfra stuur je lasprojecten aan in het spoorwegennet van Nederland. Je coördineert projecten, adviseert op basis van je expertise en zorgt voor kwalificaties van medewerkers. Je beheert KPI's, plant werkzaamheden en onderhoudt contact met interne teams, klanten en netbeheerders. Een verantwoordelijke fulltime positie in loondienst.",
    responsibilities: [
      "Aansturen en coördineren van lasprojecten in de railinfrastructuur",
      "Adviseren op basis van lastechnische expertise",
      "Zorgdragen voor kwalificaties en certificeringen van medewerkers",
      "Beheren van KPI's en bewaken van kwaliteitsnormen",
      "Plannen van werkzaamheden en afstemmen met interne teams",
      "Onderhouden van contact met klanten en netbeheerders",
    ],
    requirements: [
      "MBO 3-4 opleiding, bij voorkeur met IWT/IWE-cursus",
      "Ervaring in het spoor als lasser, of ervaren Thermietlasser met ambitie",
      "VCA-VOL certificering",
      "Kennis van ISO 3834-2, RLN 120 en RLN 127",
      "Uitstekende communicatieve vaardigheden in het Nederlands",
      "Oplossingsgericht en flexibel ingesteld",
    ],
    nice_to_have: [
      "IWE (International Welding Engineer) kwalificatie",
      "Ervaring met projectmanagement in railinfrastructuur",
      "Kennis van relevante spoornormen en certificeringen",
    ],
    salary: "Uitstekend salaris + mobiliteitsbudget of leaseauto + opleidingsmogelijkheden",
  },
  {
    id: "v5",
    title: "Projectleider Field Services",
    location: "Rotterdam, Nederland",
    type: "Permanent",
    discipline: "Engineering",
    description: "Zorg jij dat onze Field Service Engineers wereldwijd zorgeloos aan de slag kunnen? Als Projectleider heb jij de touwtjes in handen – van planning tot oplevering van internationale tandwielkastprojecten.",
    posted: "2026-04-01",
    about: "Vanuit ons kantoor in Rotterdam heb jij als Projectleider Field Services direct toegang tot de werkplaats. Je leidt internationale serviceprojecten — van een spoedreparie in Singapore tot preventief onderhoud in Noorwegen. Je bent het aanspreekpunt voor klanten en stakeholders en werkt nauw samen met een hecht team van specialisten. Zo zie je de techniek in de praktijk en spar je met ervaren collega's.",
    responsibilities: [
      "Leiden en coördineren van internationale Field Service projecten",
      "Aanspreekpunt zijn voor klanten en stakeholders",
      "Bewaken van budget, planning en kwaliteit",
      "Opstellen van projectplannen en VGM-documentatie",
      "Werkvoorbereiding voor Field Service Engineers",
      "Rapporteren van projectvoortgang aan management",
    ],
    requirements: [
      "HBO werk- en denkniveau (Werktuigbouwkunde of technisch)",
      "Enkele jaren ervaring als Projectleider in een technische omgeving",
      "Sterke communicatieve vaardigheden",
      "Beheersing van Nederlands en Engels",
      "Proactieve en klantgerichte instelling",
    ],
    nice_to_have: [
      "IPMA-certificering",
      "Ervaring met tandwielkasten of roterend mechanisch materieel",
      "Kennis van internationale servicelogistiek",
    ],
    salary: "€ 3.839 – € 5.920 bruto per maand + 40 verlofdagen + mobiliteitsbudget + thuiswerkmogelijkheid",
  },
];
