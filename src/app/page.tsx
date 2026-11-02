import type { Metadata } from "next";
import Image from "next/image";
import PlanEditor from "@/components/plano/PlanEditor";
import { siteUrl } from "@/app/sitemap";

export const metadata: Metadata = {
  title: "Generador de planos online gratuito | TusPlanos3D",
  description:
    "Crea planos de vivienda gratis online: dibuja muros, puertas, ventanas y mobiliario. Calcula la potencia eléctrica y de climatización de tu proyecto. Todo completamente gratis.",
  alternates: { canonical: siteUrl() },
  openGraph: {
    title: "Generador de planos online gratuito | TusPlanos3D",
    description:
      "La web principal en español para crear planos de vivienda gratis. Dibuja muros, coloca piezas, calcula electricidad y climatización. Exporta a PDF, SVG o JSON.",
    url: siteUrl(),
    siteName: "TusPlanos3D",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/img/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generador de planos online gratuito | TusPlanos3D",
    description:
      "Crea planos de vivienda gratis: muros, puertas, ventanas, mobiliario. Calcula electricidad y climatización. Exporta a PDF.",
    images: ["/img/og-image.svg"],
  },
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6">
      <header className="mb-6 flex items-center gap-3">
        <Image src="/img/logo.svg" alt="TusPlanos3D" width={205} height={50} className="h-10 w-auto brightness-125 contrast-125" />
        <h1 className="text-xl font-bold text-orange-400">Generador de Planos</h1>
      </header>
      <PlanEditor />
    </main>
  );
}
