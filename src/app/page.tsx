import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
        <Link href="/"><Image src="/img/logo.svg" alt="TusPlanos3D - inicio" width={235} height={58} className="h-12 w-auto" /></Link>
        <h1 className="text-xl font-bold text-orange-400">Generador de Planos</h1>
      </header>
      <PlanEditor />

      {/* Seccion SEO: caracteristicas */}
      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Dibuja planos gratis",
            text: "Crea planos 2D de tu vivienda en el navegador: muros, puertas, ventanas y mobiliario. Sin instalación ni registro.",
          },
          {
            title: "Calcula electricidad",
            text: "Calcula la potencia eléctrica contratada mínima según tus electrodomésticos, superficie y factor de coincidencia.",
          },
          {
            title: "Calcula climatización",
            text: "Dimensiona la potencia de frío y calor recomendada para tu vivienda: regla de 130 frigorías por m² útil.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-line bg-paper-2 p-5">
            <h2 className="text-lg font-bold text-ink">{f.title}</h2>
            <p className="mt-2 text-sm text-muted">{f.text}</p>
          </div>
        ))}
      </section>

      {/* CTA: vista 3D y calculadoras */}
      <section className="mt-12 rounded-2xl border border-line bg-paper-2 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Ve tu proyecto en 3D</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Una vez dibujes el plano, ábrelo en el visor 3D y recorre tu vivienda como si estuvieras dentro:
              muros extruidos en 2,5 m, puertas, ventanas incluidas, y los muebles del catálogo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/vista-3d/"
              className="inline-flex items-center justify-center rounded-lg border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-paper hover:bg-accent/90"
            >
              Ver proyecto en 3D
            </Link>
            <Link
              href="/climatizacion/"
              className="inline-flex items-center justify-center rounded-lg border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:bg-paper"
            >
              Calcular climatización
            </Link>
            <Link
              href="/electricidad/"
              className="inline-flex items-center justify-center rounded-lg border border-line bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:bg-paper"
            >
              Calcular electricidad
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ visible para SEO */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-bold text-ink">Preguntas frecuentes</h2>
        <div className="mt-4 space-y-4">
          {[
            {
              q: "¿Cómo se exporta el plano a PDF?",
              a: "Pulsa el botón «Descargar PDF». Se abre el diálogo de impresión: selecciona A4 apaisado al 100% de escala.",
            },
            {
              q: "¿Cómo se introduce una medida exacta en metros?",
              a: "Mientras arrastras el muro aparece un campo de cota. Escribe el valor (ej. 5.20) y pulsa Enter.",
            },
            {
              q: "¿Para qué sirve la calculadora de electricidad?",
              a: "Calcula la potencia contratada mínima recomendada según electrodomésticos, superficie, factor de coincidencia y margen.",
            },
            {
              q: "¿Se guardan mis datos?",
              a: "El proyecto se guarda automáticamente en tu navegador. Sin registro ni servidores externos.",
            },
            {
              q: "¿Cómo se calcula la climatización?",
              a: "Introduce los m² útiles. Se multiplica por 130 frigorías por m² para la refrigeración recomendada.",
            },
            {
              q: "¿Es completamente gratis?",
              a: "Sí, 100% gratuito. Sin registro, sin publicidad, sin envío de datos a servidores.",
            },
          ].map((f) => (
            <div key={f.q} className="border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink">{f.q}</h3>
              <p className="mt-1 text-sm text-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-muted">
        Volver al <Link href="/" className="text-accent underline">generador de planos online gratuito</Link>.
        También disponible: <a href="/electricidad/" className="text-accent underline">calculadora de electricidad</a> y{" "}
        <a href="/climatizacion/" className="text-accent underline">calculadora de climatización</a>.
      </p>
    </main>
  );
}