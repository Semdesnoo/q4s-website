export interface Vacancy {
  id: string;
  type: string;
  discipline: string;
  posted: string;
}

// Language-neutral fields only — all translatable content lives in messages/{locale}.json under vacancies.list
// All vacancies removed per request — page stays active for open applications.
export const vacancies: Vacancy[] = [];
