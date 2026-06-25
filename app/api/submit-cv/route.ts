import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Escape user-provided values before embedding them in the HTML email.
const esc = (s: string) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const data = await req.formData();
  const firstName = data.get("firstName") as string;
  const lastName = data.get("lastName") as string;
  const email = data.get("email") as string;
  const phone = (data.get("phone") as string) || "—";
  const discipline = data.get("discipline") as string;
  const availability = data.get("availability") as string;
  const location = (data.get("location") as string) || "—";
  const message = (data.get("message") as string) || "";
  const cvFile = data.get("cv") as File | null;

  const attachments: { filename: string; content: Buffer }[] = [];
  if (cvFile && cvFile.size > 0) {
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    attachments.push({ filename: cvFile.name, content: buffer });
  }

  const emailEsc = esc(email);
  const phoneEsc = esc(phone);

  const rows: [string, string][] = [
    ["Naam", esc(`${firstName} ${lastName}`.trim())],
    ["E-mail", `<a href="mailto:${emailEsc}" style="color:#e8430a; text-decoration:none;">${emailEsc}</a>`],
    ["Telefoon", phone !== "—" ? `<a href="tel:${phoneEsc.replace(/\s/g, "")}" style="color:#e8430a; text-decoration:none;">${phoneEsc}</a>` : "—"],
    ["Discipline", esc(discipline)],
    ["Beschikbaarheid", esc(availability)],
    ["Locatie", esc(location)],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
                <tr>
                  <td style="padding:13px 0; border-bottom:1px solid #f0f0f0; color:#9a9a9a; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:1px; vertical-align:top; width:150px;">${label}</td>
                  <td style="padding:13px 0; border-bottom:1px solid #f0f0f0; color:#111111; font-size:15px; vertical-align:top;">${value}</td>
                </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="nl">
  <body style="margin:0; padding:0; background-color:#f4f4f5; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid #e6e6e6;">
            <tr>
              <td style="background-color:#000000; padding:30px 36px;">
                <div style="height:3px; width:44px; background-color:#e8430a; margin-bottom:18px;"></div>
                <p style="margin:0; color:#e8430a; font-size:11px; font-weight:bold; letter-spacing:2.5px; text-transform:uppercase;">Q4S — Nieuwe sollicitatie</p>
                <h1 style="margin:8px 0 0; color:#ffffff; font-size:25px; font-weight:bold; letter-spacing:-0.5px;">Nieuwe CV-inschrijving</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 36px 4px;">
                <p style="margin:0; color:#555555; font-size:15px; line-height:1.55;">Er is een nieuwe CV-inschrijving binnengekomen via het formulier op q4s.nl. Het CV zit als bijlage bij deze e-mail.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 36px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}
                </table>
              </td>
            </tr>
            ${
              message
                ? `<tr>
              <td style="padding:20px 36px 4px;">
                <p style="margin:0 0 10px; color:#9a9a9a; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">Aanvullende informatie</p>
                <p style="margin:0; color:#333333; font-size:15px; line-height:1.6; background-color:#f9f9f9; border-left:3px solid #e8430a; padding:15px 18px;">${esc(message).replace(/\n/g, "<br>")}</p>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:20px 36px 30px;">
                <p style="margin:0; color:#7a3b1f; font-size:14px; background-color:#fff4f0; border:1px solid #f6d2c4; padding:14px 18px;"><strong>CV bijgevoegd</strong> als bijlage bij deze e-mail.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#fafafa; border-top:1px solid #eeeeee; padding:22px 36px;">
                <p style="margin:0; color:#9a9a9a; font-size:12px; line-height:1.55;">Verstuurd via het CV-formulier op <a href="https://q4s.nl" style="color:#e8430a; text-decoration:none;">q4s.nl</a> &middot; Antwoord op deze mail om rechtstreeks naar de kandidaat te reageren.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM ?? "Q4S Website <noreply@q4s.nl>",
    to: process.env.CV_MAIL_TO ?? "cv@q4s.nl",
    replyTo: email,
    subject: `Nieuw CV: ${firstName} ${lastName} — ${discipline}`,
    html,
    attachments,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
