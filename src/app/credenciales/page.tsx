import type { Metadata } from "next";
import { getCredentials } from "@/lib/data";
import { withBase } from "@/lib/base";

export const metadata: Metadata = {
  title: "Credenciales",
  description: "Formación, acreditaciones, premios y publicaciones del estudio.",
};

export default async function CredencialesPage() {
  const credentials = await getCredentials();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            Trayectoria
          </p>
          <h1 className="mt-3 text-4xl">Credenciales</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Esta página recoge únicamente formación, acreditaciones, premios y publicaciones
            documentados por el estudio. Mientras no se aporte la documentación de respaldo,
            no se muestran cifras ni reconocimientos.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/img/retrato.svg")}
            alt="Retrato profesional (imagen de muestra)"
            loading="lazy"
            className="mt-6 aspect-square w-full max-w-sm border border-line object-cover"
          />
        </div>

        <div className="space-y-8">
          {credentials.sections.map((section) => (
            <section key={section.title} aria-labelledby={`sec-${section.title}`}>
              <h2 id={`sec-${section.title}`} className="text-xl">
                {section.title}
              </h2>
              <ul className="mt-3 space-y-2 border-l-2 border-line pl-4">
                {section.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="rounded border border-dashed border-line bg-paper-2 px-5 py-4 text-sm text-muted">
            {credentials.pendingNote}
          </p>
        </div>
      </div>
    </div>
  );
}
