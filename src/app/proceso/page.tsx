import type { Metadata } from "next";
import Link from "next/link";
import { getProcess } from "@/lib/data";
import { withBase } from "@/lib/base";

export const metadata: Metadata = {
  title: "Método de trabajo",
  description: "Fases del trabajo de diseño, de la primera consulta al desarrollo del proyecto.",
};

export default async function ProcesoPage() {
  const process = await getProcess();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Método</p>
      <h1 className="mt-3 text-4xl">{process.ordinalName}</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
        Un proceso ordenado para que la reforma responda a cómo vives, no a una receta
        genérica. Las fases, entregables y honorarios se concretan por escrito en cada
        propuesta.
      </p>

      {/* Los cuatro ejes del método */}
      <section aria-labelledby="ejes" className="mt-12">
        <h2 id="ejes" className="text-2xl">
          Los cuatro ejes del método
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {process.ordinals.map((ordinal) => (
            <li key={ordinal.key} className="border border-line bg-paper-2 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-serif text-paper">
                {ordinal.key}
              </span>
              <p className="mt-3 font-serif text-lg">{ordinal.title}</p>
              <p className="mt-2 text-sm text-muted">{ordinal.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Fases */}
      <section aria-labelledby="fases" className="mt-16">
        <h2 id="fases" className="text-2xl">
          Fases del proyecto
        </h2>
        <ol className="mt-6 space-y-5">
          {process.steps.map((step) => (
            <li
              key={step.code}
              className="grid gap-4 border-b border-line pb-5 md:grid-cols-[4rem_1fr_auto] md:items-start"
            >
              <span className="font-serif text-3xl text-accent">{step.code}</span>
              <div>
                <h3 className="text-xl">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
              <p className="text-xs text-muted md:max-w-[14rem] md:text-right">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Imagen de apoyo */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBase("/img/proceso.svg")}
          alt="Sesión de trabajo con el cliente (imagen de muestra)"
          loading="lazy"
          className="aspect-[3/2] w-full border border-line object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBase("/img/detalles.svg")}
          alt="Detalle de acabados seleccionados (imagen de muestra)"
          loading="lazy"
          className="aspect-[3/2] w-full border border-line object-cover"
        />
      </div>

      <section className="mt-12 rounded border border-line bg-paper-2 px-6 py-8 text-center">
        <h2 className="text-2xl">Primera consulta</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
          Las condiciones de la primera visita o videollamada, su duración y si conlleva
          coste se confirman en cada caso. Pídenos los detalles sin compromiso.
        </p>
        <Link
          href="/contacto/"
          className="mt-5 inline-block rounded bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-paper uppercase transition hover:bg-accent"
        >
          Pedir información
        </Link>
      </section>
    </div>
  );
}
