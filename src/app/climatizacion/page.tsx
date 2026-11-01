import type { Metadata } from "next";
import { siteUrl } from "@/app/sitemap";
import ClimatizacionClient from "./ClimatizacionClient";

export const metadata: Metadata = {
  title: "Climatización mínima",
  description:
    "Calcula la potencia de climatización recomendada según la superficie y condiciones de tu vivienda. Estimación en kW de frío y calor.",
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
    images: ["/img/logo.svg"],
  },
};

export default function Page() {
  return <ClimatizacionClient />;
}
