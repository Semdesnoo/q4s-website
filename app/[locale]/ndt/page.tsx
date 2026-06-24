import { permanentRedirect } from "@/i18n/navigation";

// NDT is samengevoegd met de Diensten-pagina. Oude /ndt-URL's worden
// permanent (308) doorgestuurd naar /diensten (NL) / /services (EN) #ndt.
export default async function NdtPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect({ href: "/services", locale });
}
