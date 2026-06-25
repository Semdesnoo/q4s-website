import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Q4S Website <onboarding@resend.dev>",
    to: "info@q4s.nl",
    replyTo: email,
    subject: subject ? `Contact: ${subject}` : `Nieuw contactbericht van ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #e8430a;">Nieuw contactbericht</h2>
        <table cellpadding="8" style="width:100%; border-collapse:collapse;">
          <tr style="border-bottom:1px solid #eee"><td><strong>Naam</strong></td><td>${name}</td></tr>
          <tr style="border-bottom:1px solid #eee"><td><strong>E-mail</strong></td><td>${email}</td></tr>
          ${subject ? `<tr style="border-bottom:1px solid #eee"><td><strong>Onderwerp</strong></td><td>${subject}</td></tr>` : ""}
        </table>
        <h3>Bericht</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
