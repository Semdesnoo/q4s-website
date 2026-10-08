import type { Resend } from "resend";

/**
 * Automatische ontvangstbevestiging naar de kandidaat na een CV-inzending/sollicitatie.
 * Altijd Engels (internationale kandidaten). Twee varianten: sollicitatie op een
 * vacature, of een open sollicitatie (CV uploaden zonder vacature).
 * Afzender info@q4s.nl; antwoorden komen ook daar binnen. Een fout hier mag de
 * inzending nooit laten mislukken (die is al binnen) — alleen loggen.
 */

const PHONE = "+31 6 83859566";
const PHONE_TEL = "+31683859566";

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function autoReplyEmail(opts: { firstName: string; vacancyTitle?: string }) {
  const v = opts.vacancyTitle;
  const subject = v ? `Thank you for your application: ${v}` : "Thank you for your open application";
  const body = v
    ? `Thank you for applying for the position of <strong>${esc(v)}</strong> and for sending us your CV. We have received your application and will process it as soon as possible. One of our recruiters will contact you about the next steps.`
    : `Thank you for sending us your CV. We have received your open application and will process it as soon as possible. We will add your profile to our talent pool, and as soon as a suitable assignment comes up, one of our recruiters will contact you.`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #e6e6e6;">
          <tr><td style="background-color:#000000; padding:28px 36px;">
            <div style="height:3px; width:44px; background-color:#e8430a; margin-bottom:16px;"></div>
            <p style="margin:0; color:#ffffff; font-size:22px; font-weight:bold; letter-spacing:-0.5px;">Q4S</p>
          </td></tr>
          <tr><td style="padding:32px 36px 8px; color:#222222; font-size:15px; line-height:1.65;">
            <p style="margin:0 0 16px;">Dear ${esc(opts.firstName || "applicant")},</p>
            <p style="margin:0 0 16px;">${body}</p>
            <p style="margin:0 0 24px;">Any questions in the meantime? Simply reply to this email or call us on <a href="tel:${PHONE_TEL}" style="color:#e8430a; text-decoration:none;">${PHONE}</a>.</p>
            <p style="margin:0;">Kind regards,<br><strong>Team Q4S</strong></p>
          </td></tr>
          <tr><td style="padding:24px 36px 28px;">
            <p style="margin:0; color:#9a9a9a; font-size:12px; line-height:1.6; border-top:1px solid #eeeeee; padding-top:18px;">
              Q4S B.V. &middot; Arnhemseweg 12, 2994 LA Barendrecht, the Netherlands &middot; <a href="https://www.q4s.nl" style="color:#e8430a; text-decoration:none;">www.q4s.nl</a> &middot; info@q4s.nl
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  return { subject, html };
}

export async function sendAutoReply(
  resend: Resend,
  opts: { to: string; firstName: string; vacancyTitle?: string }
): Promise<string | null> {
  const { subject, html } = autoReplyEmail(opts);
  const { error } = await resend.emails.send({
    from: process.env.AUTOREPLY_FROM ?? "Q4S <info@q4s.nl>",
    to: opts.to,
    replyTo: "info@q4s.nl",
    subject,
    html,
  });
  if (error) console.error("[autoreply] mislukt voor", opts.to, error.message);
  return error ? error.message : null;
}
