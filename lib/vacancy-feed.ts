/**
 * Live vacature-feed van het Q4S-dashboard.
 *
 * Haalt PUBLISHED vacatures op via de publieke API. Server-side only (RSC),
 * met ISR-revalidatie zodat de pagina niet bij elk bezoek wacht op de API.
 */

const FEED_URL =
  process.env.DASHBOARD_FEED_URL ??
  "https://q4s-dashboard-eta.vercel.app/api/public/vacatures";

const DETAIL_URL =
  process.env.DASHBOARD_DETAIL_URL ??
  "https://q4s-dashboard-eta.vercel.app/api/public/vacatures";

export interface FeedVacancy {
  /** slug from dashboard — used as id on the website */
  id: string;
  source: "feed";
  title: string;
  location: string;
  description: string;
  discipline: string;
  disciplineLabel: string;
  type: string;
  posted: string;
  salary: string;
  company: string;
}

export interface FeedVacancyDetail extends FeedVacancy {
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  descriptionHtml: string | null;
}

/**
 * Fetch all published vacancies from the dashboard. Returns [] on failure
 * so the page always renders (possibly empty).
 */
export async function fetchFeedVacancies(): Promise<FeedVacancy[]> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.ok || !Array.isArray(data.vacatures)) return [];

    return data.vacatures.map((v: Record<string, unknown>) => ({
      id: v.slug as string,
      source: "feed" as const,
      title: v.title as string,
      location: (v.location as string) ?? "",
      description: (v.summary as string) ?? "",
      discipline: (v.disciplineLabel as string) ?? "",
      disciplineLabel: (v.disciplineLabel as string) ?? "",
      type: (v.employmentType as string) ?? "",
      posted: (v.publishedAt as string) ?? "",
      salary: (v.salary as string) ?? "",
      company: (v.company as string) ?? "",
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch a single vacancy by slug for the detail page.
 */
export async function fetchFeedVacancy(
  slug: string
): Promise<FeedVacancyDetail | null> {
  try {
    const res = await fetch(`${DETAIL_URL}/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !data.vacature) return null;

    const v = data.vacature;
    return {
      id: v.slug,
      source: "feed",
      title: v.title,
      location: v.location ?? "",
      description: v.summary ?? "",
      discipline: v.disciplineLabel ?? v.discipline ?? "",
      disciplineLabel: v.disciplineLabel ?? "",
      type: v.employmentType ?? "",
      posted: v.publishedAt ?? "",
      salary: v.salary ?? "",
      company: v.company ?? "",
      responsibilities: v.responsibilities ?? [],
      requirements: v.requirements ?? [],
      niceToHave: v.niceToHave ?? [],
      descriptionHtml: v.descriptionHtml ?? null,
    };
  } catch {
    return null;
  }
}
