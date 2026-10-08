import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendAutoReply } from "@/lib/autoreply";

// TIJDELIJK: testmails (vacature + open sollicitatie) naar een vast adres. Wordt na de test verwijderd.
export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = "semdesnoo@q4s.nl";
  const vacature = await sendAutoReply(resend, { to, firstName: "Sem", vacancyTitle: "Foreman / NDT" });
  const open = await sendAutoReply(resend, { to, firstName: "Sem" });
  return NextResponse.json({ vacature, open });
}
