import type { Metadata } from "next";
import { siteUrl } from "@/app/sitemap";
import ClimatizacionClient from "./ClimatizacionClient";

export const metadata: Metadata = {
  title: "Calculadora de climatización y frigorías",
  description:
    "Calcula la potencia de climatización recomendada para tu vivienda gratis: superficie útil × 130 frigorías, kW de frío y calor. Herramienta gratuita.",
  alternates: {
    canonical: `${siteUrl()}/climatizacion/`,
  },
  openGraph: {
    title: "Climatización mínima – TusPlanos3D",
    description:
      "Herramienta gratuita para calcular la potencia de climatización recomendada según m² y condiciones de tu vivienda.",
    url: `${siteUrl()}/climatizacion/`,
    siteName: "TusPlanos3D",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/img/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Climatización mínima – TusPlanos3D",
    description:
      "Herramienta gratuita para calcular la potencia de climatización recomendada según m² y condiciones de tu vivienda.",
    images: ["/img/og-image.svg"],
  },
};

export default function Page() {
  return <ClimatizacionClient />;
}
