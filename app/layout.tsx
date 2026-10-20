import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shahbaa Café | شهبا كافيه",
  description: "Explore the Shahbaa Café menu in Arabic and English.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
