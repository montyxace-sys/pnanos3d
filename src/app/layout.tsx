import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SiteFooter from "@/components/SiteFooter";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tusplanos3d.es").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const title = "TusPlanos3D - Generador de planos online gratuito y calculadoras";
  const description =
    "La web principal en español para crear planos de vivienda gratis: dibuja muros, puertas, ventanas y mobiliario, calcula la potencia eléctrica contratada y la climatización (frigorías). Todo completamente gratis, sin registro ni instalación.";
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
      images: [{ url: "/img/og-image.svg", alt: "TusPlanos3D", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/img/og-image.svg"],
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
    "La web principal en español para crear planos de vivienda gratis y calcular la potencia eléctrica y de climatización de tu proyecto. Todo completamente gratis, sin registro ni instalación.",
  publisher: { "@type": "Organization", name: "TusPlanos3D", url: SITE, logo: `${SITE}/img/logo.svg` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TusPlanos3D",
  url: SITE,
  logo: `${SITE}/img/logo.svg`,
  description: "Generador de planos online gratuito y calculadoras de electricidad y climatización para vivienda.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "Spanish",
  },
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
    "Dibuja planos 2D de tu vivienda en el navegador: muros, puertas, ventanas, mobiliario. Calcula la potencia eléctrica contratada y la climatización (frigorías). Exporta a PDF, SVG o JSON. Todo completamente gratis, sin instalación ni registro.",
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
    {
      "@type": "Question",
      name: "¿Cómo se calcula la climatización?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Introduce los metros cuadrados útiles de tu vivienda. La herramienta multiplica por 130 frigorías por m² para darte la potencia de refrigeración recomendada. También calcula kW de frío y calor según exposición solar, ocupantes y equipos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Es completamente gratis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, TusPlanos3D es 100% gratuito. No requiere registro, no tiene publicidad y no envía datos a servidores. Puedes usar el generador de planos, la calculadora de electricidad y la de climatización sin coste alguno.",
      },
    },
    {
      "@type": "Question",
      name: "¿Funciona en el móvil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, la web es responsive y funciona en móviles y tablets. Para dibujar con mayor precisión se recomienda usar un ordenador con ratón.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://lgwaffbjlggfwwushjoz.supabase.co" />
        <link rel="dns-prefetch" href="https://lgwaffbjlggfwwushjoz.supabase.co" />
        
        <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-NVJSG5HN" crossOrigin="anonymous"></script>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer = window.dataLayer || [];" +
              "function gtag(){window.dataLayer.push(arguments);}" +
              "gtag(\"js\", new Date());" +
              "gtag(\"config\", \"GTM-NVJSG5HN\");" +
              "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NVJSG5HN');",
          }}
        />

      </head>
      <body className="min-h-screen bg-transparent text-gray-900 antialiased">
        
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NVJSG5HN" height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="GTM"></iframe></noscript>

        <AnalyticsTracker />
        {children}
                <SiteFooter />

<ChatWidget />
        <CookieBanner />
        <Script id="jsonld-website" type="application/ld+json">
          {JSON.stringify(jsonLdWebSite)}
        </Script>
        <Script id="jsonld-org" type="application/ld+json">
          {JSON.stringify(jsonLdOrganization)}
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
