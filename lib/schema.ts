/**
 * Helpers voor JSON-LD (schema.org) structured data.
 */

/**
 * Vaste `@id` voor de Q4S-organisatie.
 *
 * Zonder dit ziet Google vier losse, niet-gekoppelde "Q4S B.V."-knopen: de
 * Organization uit de layout, de `hiringOrganization` in JobPosting, en de
 * `author` + `publisher` in Article. Het adres, oprichtingsjaar en `knowsAbout`
 * dragen dan niets bij aan de geloofwaardigheid van de werkgever in Google for
 * Jobs. Met één gedeelde `@id` smelten ze samen tot één entiteit.
 *
 * Let op: dit is een identifier, geen URL die opgehaald wordt — de waarde moet
 * stabiel blijven, ook als het canonieke domein ooit wijzigt.
 */
export const ORG_ID = "https://www.q4s.nl/#organization";

/**
 * Serialiseert data voor een `<script type="application/ld+json">`-blok.
 *
 * `JSON.stringify` escapet `<` niet, dus zodra er HTML in een veld staat (bv. de
 * `<ul>` in een JobPosting-description) sluit de eerste `</...>` het script-blok
 * voortijdig. Dat breekt de rich result geruisloos — geen foutmelding, alleen
 * een schema dat verdwijnt. `<` is binnen JSON gelijkwaardig aan `<` maar
 * wordt door de HTML-parser niet als tagbegin gezien.
 */
export function jsonLd(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
