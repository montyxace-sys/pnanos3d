import type { Metadata } from "next";
import { siteUrl } from "@/app/sitemap";
import ElectricidadClient from "./ElectricidadClient";

export const metadata: Metadata = {
  title: "Contratación mínima de electricidad",
  description:
    "Calcula la potencia eléctrica contratada mínima para tu vivienda: selecciona electrodomésticos, factor de coincidencia y margen de seguridad. Obtén el kW e ICP recomendados.",
  alternates: {
    canonical: `${siteUrl()}/electricidad/`,
  },
  openGraph: {
    title: "Contratación mínima de electricidad – TusPlanos3D",
    description:
      "Herramienta gratuita para calcular la potencia eléctrica contratada mínima según tus electrodomésticos y superficie.",
    url: `${siteUrl()}/electricidad/`,
    siteName: "TusPlanos3D",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/img/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contratación mínima de electricidad – TusPlanos3D",
    description:
      "Herramienta gratuita para calcular la potencia eléctrica contratada mínima según tus electrodomésticos y superficie.",
    images: ["/img/og-image.svg"],
  },
};

export default function ElectricidadPage() {
  return <ElectricidadClient />;
}
