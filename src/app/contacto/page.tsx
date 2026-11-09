import type { Metadata } from "next";
import { siteUrl } from "@/app/sitemap";
import ContactoClient from "./ContactoClient";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con TusPlanos3D: formulario de contacto para consultas sobre planos, electricidad, climatización y colaboraciones. Respuesta en menos de 24 horas.",
  alternates: {
    canonical: `${siteUrl()}/contacto/`,
  },
  openGraph: {
    title: "Contacto | TusPlanos3D",
    description:
      "Formulario de contacto para consultas sobre planos, electricidad, climatización y colaboraciones.",
    url: `${siteUrl()}/contacto/`,
    siteName: "TusPlanos3D",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/img/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | TusPlanos3D",
    description:
      "Formulario de contacto para consultas sobre planos, electricidad y climatización.",
    images: ["/img/og-image.svg"],
  },
};

export default function Page() {
  return <ContactoClient />;
}