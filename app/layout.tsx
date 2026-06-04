import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BIA CO | BIZIMANA FILS — Portfolio",
  description:
    "Portfolio of BIZIMANA FILS — Electric Vehicle Technician, AI Engineer, Web Developer. BIA CO (Bizimana Idea Agency Company). Kigali, Rwanda.",
  keywords: [
    "BIZIMANA FILS",
    "BIA CO",
    "Rwanda",
    "Portfolio",
    "EV Technician",
    "AI Engineer",
    "Web Developer",
  ],
  openGraph: {
    title: "BIA CO | BIZIMANA FILS",
    description:
      "Electric Vehicle Technician · AI Engineer · Web Developer · Kigali, Rwanda",
    type: "website",
    locale: "en_US",
    siteName: "BIA CO",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
