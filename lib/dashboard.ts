/**
 * Doorsturen van formulierinzendingen naar het Q4S-dashboard.
 *
 * De e-mail blijft leidend: die is de garantie dat een inzending niet verloren
 * gaat. Het dashboard is een tweede bestemming, geen vervanging. Een storing
 * aan die kant mag daarom nooit een kandidaat een foutmelding opleveren of de
 * e-mail tegenhouden.
 */

import nlMessages from "@/messages/nl.json";
import enMessages from "@/messages/en.json";

const DASHBOARD_URL =
  process.env.DASHBOARD_SUBMIT_URL ??
  "https://q4s-dashboard-eta.vercel.app/api/public/sollicitatie";

/**
 * Het formulier verstuurt mensvriendelijke labels ("NDT Inspector", "Binnen 1
 * maand") omdat diezelfde waarde in de e-mail naar cv@q4s.nl belandt. Het
 * dashboard wil codes. Hieronder de vertaling.
 *
 * LET OP: deze arrays lopen op VOLGORDE gelijk met `uploadCv.form.disciplines`
 * en `uploadCv.form.availabilities` in messages/nl.json en messages/en.json.
 * Verander je daar de volgorde of voeg je een optie toe, pas dan ook hier aan.
 * Een label dat niet gevonden wordt valt terug op OVERIG / ONBEKEND — dat is
 * rommelig maar breekt niets.
 */
const DISCIPLINE_CODES = [
  "QC", // QA/QC Inspector
  "NDO", // NDT Inspector      — NDO is de Nederlandse afkorting voor NDT
  "LASSEN", // Welding Inspector
  "OVERIG", // Source Inspector   — geen eigen code in het dashboard
  "OVERIG", // Expeditor          — idem
  "QC", // QC Engineer
  "OVERIG", // Inspection Coordinator — idem
  "OVERIG", // Anders / Other
] as const;

const AVAILABILITY_CODES = [
  "BESCHIKBAAR", // Direct beschikbaar
  "BINNENKORT", // Binnen 1 maand
  "BINNENKORT", // Binnen 3 maanden
  "ONBEKEND", // Op zoek naar vast dienstverband — dit is een wens, geen termijn
] as const;

/** Bouwt een label → code-tabel uit beide talen, zodat EN-inzendingen ook kloppen. */
function buildLookup(
  nlLabels: string[],
  enLabels: string[],
  codes: readonly string[]
): Map<string, string> {
  const map = new Map<string, string>();
  for (const labels of [nlLabels, enLabels]) {
    labels.forEach((label, i) => {
      if (codes[i]) map.set(label.trim().toLowerCase(), codes[i]);
    });
  }
  return map;
}

const DISCIPLINE_LOOKUP = buildLookup(
  nlMessages.uploadCv.form.disciplines,
  enMessages.uploadCv.form.disciplines,
  DISCIPLINE_CODES
);

const AVAILABILITY_LOOKUP = buildLookup(
  nlMessages.uploadCv.form.availabilities,
  enMessages.uploadCv.form.availabilities,
  AVAILABILITY_CODES
);

/** Vertaalt een formulierlabel naar de dashboardcode; valt terug op `fallback`. */
function toCode(label: string, lookup: Map<string, string>, fallback: string): string {
  if (!label) return fallback;
  return lookup.get(label.trim().toLowerCase()) ?? fallback;
}

/** Hoe lang we maximaal op het dashboard wachten voor we opgeven. */
const TIMEOUT_MS = 10_000;

export type DashboardResult = "ok" | "failed";

export type CandidateSubmission = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  discipline: string;
  availability: string;
  location: string;
  /** Het CV zoals aangeleverd; wordt als bestand meegestuurd. */
  cv: { buffer: Buffer; filename: string; type: string } | null;
};

/**
 * Stuurt een CV-inschrijving door naar "Binnengekomen CV's" in het dashboard.
 *
 * Gooit nooit. De aanroeper krijgt "ok" of "failed" terug en kan zelf bepalen
 * wat dat betekent — bij het CV-formulier is dat: loggen, maar de kandidaat
 * gewoon een bevestiging tonen, want de e-mail is al verstuurd.
 */
export async function sendToDashboard(
  submission: CandidateSubmission
): Promise<DashboardResult> {
  const fd = new FormData();
  fd.append("firstName", submission.firstName);
  fd.append("lastName", submission.lastName);
  fd.append("email", submission.email);
  fd.append("phone", submission.phone);
  fd.append("discipline", toCode(submission.discipline, DISCIPLINE_LOOKUP, "OVERIG"));
  fd.append(
    "availability",
    toCode(submission.availability, AVAILABILITY_LOOKUP, "ONBEKEND")
  );
  fd.append("location", submission.location);

  if (submission.cv) {
    const blob = new Blob([new Uint8Array(submission.cv.buffer)], {
      type: submission.cv.type || "application/octet-stream",
    });
    fd.append("cv", blob, submission.cv.filename);
  }

  try {
    const res = await fetch(DASHBOARD_URL, {
      method: "POST",
      body: fd,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      // Body meelezen: bij een 400 staat daar meestal welk veld ontbreekt.
      const body = await res.text().catch(() => "");
      console.error(
        `[dashboard] ${res.status} ${res.statusText} bij doorsturen van ${submission.email}`,
        body.slice(0, 500)
      );
      return "failed";
    }

    return "ok";
  } catch (err) {
    // Timeout, DNS, dashboard offline — allemaal hier. Bewust geen rethrow.
    console.error(
      `[dashboard] doorsturen van ${submission.email} mislukt:`,
      err instanceof Error ? err.message : err
    );
    return "failed";
  }
}
