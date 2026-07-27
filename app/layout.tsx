import "./globals.css";

// Bewust géén `metadata` hier. De echte metadata staat in app/[locale]/layout.tsx
// en is locale-specifiek. Dit object werd alleen nog op de default-404 gebruikt —
// die rendert namelijk uitsluitend de root-layout — en produceerde daar een
// tweede <title> met een verouderde Engelse tekst naast "404: This page could
// not be found.".

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
