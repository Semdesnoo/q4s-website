import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q4S — Technical Talent for Critical Projects",
  description: "Q4S verbindt hooggekwalificeerde technische professionals met complexe industriële en infrastructuurprojecten.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
