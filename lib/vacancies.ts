export interface Vacancy {
  id: string;
  type: string;
  discipline: string;
  posted: string;
}

// Language-neutral fields only — all translatable content lives in messages/{locale}.json under vacancies.list
export const vacancies: Vacancy[] = [
  { id: "v1", type: "Freelance",  discipline: "Inspection", posted: "2026-04-01" },
  { id: "v2", type: "Permanent",  discipline: "QA/QC",      posted: "2026-04-01" },
  { id: "v3", type: "Contract",   discipline: "Welding",    posted: "2026-04-01" },
  { id: "v4", type: "Permanent",  discipline: "Welding",    posted: "2026-04-01" },
  { id: "v5", type: "Permanent",  discipline: "Engineering",posted: "2026-04-01" },
];
