import { LoadingProvider } from "@/contexts/LoadingContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus AI - Academia de Inteligencia Artificial + Sistema Binario",
  description: "Aprende Inteligencia Artificial y genera ingresos con nuestro innovador sistema binario. Educación de calidad + Oportunidad de negocio.",
  metadataBase: new URL("https://nexusai.com"),
  openGraph: {
    title: "Nexus AI - Academia de IA + Red Binaria",
    description: "Formación en IA, membresías mensuales y compensación binaria transparente con carry over ilimitado.",
    url: "https://nexusai.com",
    siteName: "Nexus AI",
    images: [
      {
        url: "https://nexusai.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nexus AI - Academia + Sistema Binario",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus AI - Academia de Inteligencia Artificial",
    description: "Aprende IA y genera ingresos con nuestro sistema binario innovador.",
    images: ["https://nexusai.com/og-image.jpg"],
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
