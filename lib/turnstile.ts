const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = { ok: true } | { ok: false; status: number; error: string };

/**
 * Controleert het Cloudflare Turnstile-token dat het formulier meestuurt.
 *
 * Zonder TURNSTILE_SECRET_KEY kan er niets geverifieerd worden. In productie
 * blokkeren we de inzending dan liever dan dat we bots ongemerkt doorlaten;
 * lokaal (next dev) blijven de formulieren gewoon werken.
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY is not set — submission blocked.");
      return { ok: false, status: 500, error: "Bot verification is not configured" };
    }
    console.warn("TURNSTILE_SECRET_KEY is not set — skipping verification (dev only).");
    return { ok: true };
  }

  if (!token) {
    return { ok: false, status: 400, error: "Bot verification missing" };
  }

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);

  let outcome: { success?: boolean; "error-codes"?: string[] };
  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    outcome = await res.json();
  } catch (err) {
    console.error("Turnstile verification request failed:", err);
    return { ok: false, status: 502, error: "Bot verification unavailable" };
  }

  if (!outcome.success) {
    console.warn("Turnstile rejected a submission:", outcome["error-codes"]);
    return { ok: false, status: 400, error: "Bot verification failed" };
  }

  return { ok: true };
}

/** Het IP van de bezoeker, zoals Vercel/Cloudflare het doorgeeft. */
export function clientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip");
}
