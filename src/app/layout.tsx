import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iaencolombia.org"),
  icons: {
    icon: "/logos/LOGO ACIA CIRCULAR FONDO AZUL OSCURO.png",
    apple: "/logos/LOGO ACIA CIRCULAR FONDO AZUL OSCURO.png",
  },
  title: "Asociación Colombiana de Inteligencia Artificial",
  description:
    "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
  keywords: [
    "inteligencia artificial",
    "Colombia",
    "ACIA",
    "IA",
    "gobernanza",
    "ecosistema",
    "asociación",
  ],
  openGraph: {
    title: "ACIA - Asociación Colombiana de Inteligencia Artificial",
    description:
      "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
    url: "https://iaencolombia.org",
    siteName: "ACIA",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACIA - Asociación Colombiana de Inteligencia Artificial",
    description:
      "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Asociación Colombiana de Inteligencia Artificial",
    alternateName: "ACIA",
    url: "https://iaencolombia.org",
    logo: "https://iaencolombia.org/logos/LOGO%20ACIA%20CIRCULAR%20FONDO%20AZUL%20OSCURO.png",
    description: "Articulamos el ecosistema de inteligencia artificial en Colombia para impulsar desarrollo, competitividad y gobernanza responsable.",
  };

  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
