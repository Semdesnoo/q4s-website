import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q4S — Technical Talent for Your Projects",
  description: "Q4S connects highly qualified technical professionals with complex industrial and infrastructure projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
