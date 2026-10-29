import Link from "next/link";
import { getProcess, getProjects, getSite } from "@/lib/data";
import { withBase } from "@/lib/base";
import ProjectGallery from "@/components/ProjectGallery";

export default async function HomePage() {
  const [site, projects, process] = await Promise.all([
    getSite(),
    getProjects(),
    getProcess(),
  ]);

  const featured = projects.projects.slice(0, 6);

  return (
    <>
      {/* Portada */}
      <section className="border-b border-line bg-paper-2">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Planos y visualización 3D
            </p>
            <h1 className="mt-4 text-4xl leading-tight text-balance lg:text-5xl">
              {site.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft">
              {site.description} Cada proyecto parte de cómo quieres vivir el espacio, no de
              una plantilla repetida.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contacto/"
                className="rounded bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-paper uppercase transition hover:bg-accent"
              >
                Solicitar valoración
              </Link>
              <Link
                href="/proyectos/"
                className="rounded border border-ink px-6 py-3 text-sm font-semibold tracking-wide text-ink uppercase transition hover:border-accent-bright hover:text-accent"
              >
                Ver proyectos
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted">
              Disponibilidad, honorarios y plazos se confirman para cada proyecto.
            </p>
          </div>

          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBase(`/img/${featured[0]?.image ?? "cocina-01.svg"}`)}
              alt={featured[0]?.title ?? "Proyecto de referencia"}
              className="aspect-[4/3] w-full border border-line object-cover"
            />
          </div>
        </div>
      </section>

      {/* Proyectos destacados */}
      <section aria-labelledby="destacados" className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="destacados" className="text-3xl">
              Proyectos destacados
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Una selección de trabajos recientes. El contenido definitivo se cargará desde
              los datos del estudio.
            </p>
          </div>
          <Link href="/proyectos/" className="text-sm font-medium text-accent hover:underline">
            Ver la galería completa →
          </Link>
        </div>

        <ProjectGallery categories={projects.categories} projects={featured} />
      </section>

      {/* Método */}
      <section aria-labelledby="metodo" className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <h2 id="metodo" className="text-3xl">
                Cómo trabajamos
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {process.note}
              </p>
              <Link
                href="/proceso/"
                className="mt-6 inline-block rounded border border-ink px-5 py-2.5 text-sm font-semibold tracking-wide uppercase transition hover:border-accent-bright hover:text-accent"
              >
                Conocer el método
              </Link>
            </div>

            <ol className="grid gap-4 sm:grid-cols-2">
              {process.steps.slice(0, 4).map((step) => (
                <li key={step.code} className="border border-line bg-paper p-5">
                  <p className="text-xs font-semibold tracking-widest text-accent">
                    {step.code}
                  </p>
                  <p className="mt-2 font-serif text-lg">{step.title}</p>
                  <p className="mt-2 text-sm text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Llamada a la acción */}
      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <h2 className="text-3xl">¿Empezamos por contar tu proyecto?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
          Escríbenos y valoramos juntos el alcance, los tiempos y el presupuesto orientativo.
        </p>
        <Link
          href="/contacto/"
          className="mt-6 inline-block rounded bg-ink px-7 py-3 text-sm font-semibold tracking-wide text-paper uppercase transition hover:bg-accent"
        >
          Contactar
        </Link>
      </section>
    </>
  );
}
