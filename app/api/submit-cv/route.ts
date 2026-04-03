import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

  const { error } = await resend.emails.send({
    from: "Q4S Website <onboarding@resend.dev>",
    to: "cv@q4s.nl",
    replyTo: email,
    subject: `Nieuw CV: ${firstName} ${lastName} — ${discipline}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #e8430a;">Nieuwe CV inschrijving</h2>
        <table cellpadding="8" style="width:100%; border-collapse:collapse;">
          <tr style="border-bottom:1px solid #eee"><td><strong>Naam</strong></td><td>${firstName} ${lastName}</td></tr>
          <tr style="border-bottom:1px solid #eee"><td><strong>E-mail</strong></td><td>${email}</td></tr>
          <tr style="border-bottom:1px solid #eee"><td><strong>Telefoon</strong></td><td>${phone}</td></tr>
          <tr style="border-bottom:1px solid #eee"><td><strong>Discipline</strong></td><td>${discipline}</td></tr>
          <tr style="border-bottom:1px solid #eee"><td><strong>Beschikbaarheid</strong></td><td>${availability}</td></tr>
          <tr style="border-bottom:1px solid #eee"><td><strong>Locatie</strong></td><td>${location}</td></tr>
        </table>
        ${message ? `<h3>Aanvullende informatie</h3><p>${message}</p>` : ""}
      </div>
    `,
    attachments,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
