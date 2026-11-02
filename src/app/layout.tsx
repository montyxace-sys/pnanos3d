import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tusplanos3d.es").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const title = "TusPlanos3D - Generador de planos online gratuito";
  const description =
    "Dibuja planos técnicos de tu vivienda online y gratis: muros, puertas, ventanas, mobiliario. Calcula la contratación mínima de electricidad y climatización.";
  return {
    metadataBase: new URL(SITE),
    title: { default: title, template: "%s | TusPlanos3D" },
    description,
    manifest: "/manifest.json",
    appleWebApp: { capable: true, title: "TusPlanos3D", statusBarStyle: "default" },
    icons: {
      icon: "/icon.svg",
      apple: "/img/logo.svg",
    },
    alternates: { canonical: SITE, languages: { "es-ES": SITE } },
    openGraph: {
      title,
      description,
      url: SITE,
      siteName: "TusPlanos3D",
      type: "website",
      locale: "es_ES",
      images: [{ url: "/img/logo.svg", alt: "TusPlanos3D", width: 205, height: 50 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/img/logo.svg"],
      site: "@TusPlanos3D",
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#f6821f" };

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TusPlanos3D",
  url: SITE,
  inLanguage: "es",
  description:
    "Generador de planos online gratuito para vivienda con calculadora de electricidad y climatización.",
  publisher: { "@type": "Organization", name: "TusPlanos3D" },
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TusPlanos3D – Generador de planos",
  url: SITE,
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  inLanguage: "es",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  description:
    "Dibuja planos 2D de tu vivienda en el navegador: muros, puertas, ventanas, mobiliario. Exporta a PDF, SVG o JSON. Sin instalación.",
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo se exporta el plano a PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pulsa el botón «Exportar Plano PDF» (verde). Se abre el diálogo de impresión: selecciona A4 apaisado al 100 % de escala para obtener un PDF con cotas, membrete y escala.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se introduce una medida exacta en metros?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mientras arrastras el muro aparece un campo de cota. Escribe el valor (ej. 5.20) y pulsa Enter para fijar la medida exacta. Mantén Shift para forzar ángulos a 90 grados.",
      },
    },
    {
      "@type": "Question",
      name: "¿Para qué sirve la calculadora de electricidad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Calcula la potencia contratada mínima recomendada para tu vivienda según los electrodomésticos, superficie, factor de coincidencia y margen de seguridad. Obtienes los kW e ICP recomendados.",
      },
    },
    {
      "@type": "Question",
      name: "¿Se guardan mis datos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El proyecto se guarda automáticamente en el localStorage de tu navegador. No se envía nada a servidores externos. Puedes descargarlo como JSON y volver a importarlo.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-900 text-white antialiased">
        {children}
        <footer className="fixed bottom-0 z-50 mb-2 flex w-full justify-center gap-4 text-xs text-gray-400">
          <Link href="/ayuda/" className="hover:text-orange-400 underline">Ayuda</Link>
          <Link href="/cookies/" className="hover:text-orange-400 underline">Cookies</Link>
        </footer>
        <ChatWidget />
        <CookieBanner />
        <Script id="jsonld-website" type="application/ld+json">
          {JSON.stringify(jsonLdWebSite)}
        </Script>
        <Script id="jsonld-app" type="application/ld+json">
          {JSON.stringify(jsonLdApp)}
        </Script>
        <Script id="jsonld-faq" type="application/ld+json">
          {JSON.stringify(jsonLdFaq)}
        </Script>
      </body>
    </html>
  );
}
