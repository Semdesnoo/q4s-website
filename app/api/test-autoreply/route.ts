import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendAutoReply } from "@/lib/autoreply";

// TIJDELIJK: één testmail van de automatische bevestiging naar een vast adres. Wordt na de test verwijderd.
export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await sendAutoReply(resend, { to: "semdesnoo@q4s.nl", firstName: "Sem", locale: "nl", vacancyTitle: "Voorman / NDO" });
  return NextResponse.json({ ok: true });
}
