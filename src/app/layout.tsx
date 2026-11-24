import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/url";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Misiones académicas internacionales y visitas técnicas que conectan a estudiantes, docentes y profesionales con universidades, empresas y proyectos reales.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "INGEVIAJES | Especialistas en Turismo Pedagógico",
    template: "%s | INGEVIAJES",
  },
  description,
  icons: { icon: "/brand/isotipo.png", apple: "/brand/isotipo.png" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "INGEVIAJES",
    title: "INGEVIAJES | Especialistas en Turismo Pedagógico",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}