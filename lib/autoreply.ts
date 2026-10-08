import type { Resend } from "resend";

/**
 * Automatische ontvangstbevestiging naar de kandidaat na een CV-inzending/sollicitatie.
 * Afzender info@q4s.nl; antwoorden komen ook daar binnen. Een fout hier mag de
 * inzending nooit laten mislukken (die is al binnen) — alleen loggen.
 */

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const COPY = {
  nl: {
    subject: (v?: string) => (v ? `Bedankt voor je sollicitatie: ${v}` : "Bedankt voor het opsturen van je CV"),
    hello: (n: string) => `Beste ${n},`,
    body: (v?: string) =>
      `Bedankt voor het opsturen van je CV${v ? ` voor de functie <strong>${esc(v)}</strong>` : ""}. We hebben je gegevens goed ontvangen en proberen je sollicitatie zo spoedig mogelijk te verwerken. Een van onze recruiters neemt contact met je op.`,
    questions: "Heb je in de tussentijd vragen? Reageer gerust op deze e-mail of bel ons op",
    regards: "Met vriendelijke groet,",
  },
  en: {
    subject: (v?: string) => (v ? `Thank you for applying: ${v}` : "Thank you for sending your CV"),
    hello: (n: string) => `Dear ${n},`,
    body: (v?: string) =>
      `Thank you for sending your CV${v ? ` for the position of <strong>${esc(v)}</strong>` : ""}. We have received your details and will process your application as soon as possible. One of our recruiters will be in touch.`,
    questions: "Any questions in the meantime? Simply reply to this email or call us on",
    regards: "Kind regards,",
  },
};

export function autoReplyEmail(opts: { firstName: string; locale?: string; vacancyTitle?: string }) {
  const c = opts.locale === "en" ? COPY.en : COPY.nl;
  const html = `<!DOCTYPE html>
<html lang="${opts.locale === "en" ? "en" : "nl"}">
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #e6e6e6;">
          <tr><td style="background-color:#000000; padding:28px 36px;">
            <div style="height:3px; width:44px; background-color:#e8430a; margin-bottom:16px;"></div>
            <p style="margin:0; color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:-0.5px;">Q4S</p>
          </td></tr>
          <tr><td style="padding:32px 36px 8px; color:#222222; font-size:15px; line-height:1.65;">
            <p style="margin:0 0 16px;">${esc(c.hello(opts.firstName || ""))}</p>
            <p style="margin:0 0 16px;">${c.body(opts.vacancyTitle)}</p>
            <p style="margin:0 0 24px;">${c.questions} <a href="tel:+31857826818" style="color:#e8430a; text-decoration:none;">+31 (0) 85 782 6818</a>.</p>
            <p style="margin:0;">${c.regards}<br><strong>Team Q4S</strong></p>
          </td></tr>
          <tr><td style="padding:24px 36px 28px;">
            <p style="margin:0; color:#9a9a9a; font-size:12px; line-height:1.6; border-top:1px solid #eeeeee; padding-top:18px;">
              Q4S B.V. &middot; Arnhemseweg 12, 2994 LA Barendrecht &middot; <a href="https://www.q4s.nl" style="color:#e8430a; text-decoration:none;">www.q4s.nl</a> &middot; info@q4s.nl
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  return { subject: c.subject(opts.vacancyTitle), html };
}

export async function sendAutoReply(
  resend: Resend,
  opts: { to: string; firstName: string; locale?: string; vacancyTitle?: string }
): Promise<void> {
  const { subject, html } = autoReplyEmail(opts);
  const { error } = await resend.emails.send({
    from: process.env.AUTOREPLY_FROM ?? "Q4S <info@q4s.nl>",
    to: opts.to,
    replyTo: "info@q4s.nl",
    subject,
    html,
  });
  if (error) console.error("[autoreply] mislukt voor", opts.to, error.message);
}
