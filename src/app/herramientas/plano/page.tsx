import type { Metadata } from "next";
import Link from "next/link";
import PlanEditor from "@/components/plano/PlanEditor";

export const metadata: Metadata = {
  title: "Generador de planos gratis",
  description:
    "Herramienta gratuita para dibujar el plano de tu vivienda: estancias, mobiliario, tabiques, puertas y ventanas, con descarga en PDF, JSON y SVG. Sin registro.",
};

const steps = [
  {
    code: "01",
    title: "Dibuja las estancias",
    text: "Pulsa «Dibujar estancia» y arrasa el ratón sobre la rejilla, o parte del ejemplo y ajusta cada hueco con sus medidas en metros.",
  },
  {
    code: "02",
    title: "Coloca mobiliario y construcción",
    text: "Añade sofás, sillas, mesas, camas y sanitarios, y elementos de obra: tabiques, puertas con barrido, ventanas, columnas y escalera.",
  },
  {
    code: "03",
    title: "Ajusta, gira y distribuye",
    text: "Cada pieza se arrastra, se gira y se dimensiona en centímetros. La superficie total y la tabla de estancias se actualizan solas.",
  },
  {
    code: "04",
    title: "Descarga el proyecto",
    text: "PDF en A4 apaisado con cotas y tabla de superficies, fichero JSON editable para retomar el trabajo más adelante y SVG vectorial.",
  },
];

export default function HerramientasPlanoPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Herramienta gratuita
      </p>
      <h1 className="mt-3 text-4xl">Generador de planos online para tu vivienda</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
        Dibuja las estancias, reparte el mobiliario y añade los elementos de construcción —
        tabiques, puertas, ventanas, columnas y escalera — sobre un mismo plano. Después
        descárgalo en PDF o guarda la configuración elegida como proyecto para retomarla cuando
        quieras.
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <li>· Sin registro ni instalar nada</li>
        <li>· El proyecto se guarda en tu navegador</li>
        <li>· Exportación en PDF, JSON y SVG</li>
        <li>· Medidas en metros y centímetros</li>
      </ul>

      <PlanEditor />

      {/* Cómo funciona */}
      <section aria-labelledby="como-funciona" className="mt-16">
        <h2 id="como-funciona" className="text-2xl">
          Cómo funciona
        </h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.code} className="border border-line bg-paper-2 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-serif text-paper">
                {step.code}
              </span>
              <p className="mt-3 font-serif text-lg">{step.title}</p>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Descargas */}
      <section aria-labelledby="descargas" className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="border border-line p-5">
          <h3 id="descargas" className="text-xl">
            PDF del proyecto
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Hoja A4 apaisado con marco, logotipo, título, fecha, escala aproximada, dibujo con
            cotas y tabla de superficies por estancia.
          </p>
        </div>
        <div className="border border-line p-5">
          <h3 className="text-xl">Configuración en JSON</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Descarga la configuración elegida —estancias, piezas, medidas y giros— en un fichero
            que puedes volver a importar en cualquier momento con «Cargar proyecto».
          </p>
        </div>
        <div className="border border-line p-5">
          <h3 className="text-xl">SVG vectorial</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            El plano sin la hoja de impresión, en formato vectorial, para abrirlo en Illustrator,
            Inkscape, Figma o inserarlo en otros documentos.
          </p>
        </div>
      </section>

      {/* Aviso */}
      <section className="mt-12 rounded border border-line bg-paper-2 px-6 py-8">
        <h2 className="text-2xl">Del esquema al proyecto técnico</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Esta herramienta sirve para ordenar ideas y probar distribuciones: es un esquema
          informativo y no sustituye planos técnicos, mediciones ni memorias de obra, que se
          elaboran con la normativa y la visita técnica correspondientes. Si tras probarla quieres
          convertir tu distribución en un proyecto de reforma o construcción, cuéntanoslo.
        </p>
        <Link
          href="/contacto/"
          className="mt-5 inline-block rounded bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-paper uppercase transition hover:bg-accent"
        >
          Hablar del proyecto
        </Link>
      </section>
    </div>
  );
}
