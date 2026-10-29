import type { Metadata } from "next";
import { getSite } from "@/lib/data";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Solicita información sobre tu proyecto de reforma o diseño de interiores.",
};

export default async function ContactoPage() {
  const site = await getSite();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Contacto</p>
      <h1 className="mt-3 text-4xl">Hablemos de tu proyecto</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        {/* Datos de contacto */}
        <div className="space-y-6">
          <div className="border border-line bg-paper-2 p-5">
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">
              Teléfono
            </p>
            <a href={`tel:${site.phoneHref}`} className="mt-1 block font-serif text-xl hover:text-accent">
              {site.phone}
            </a>
          </div>

          <div className="border border-line bg-paper-2 p-5">
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">Email</p>
            <a href={`mailto:${site.email}`} className="mt-1 block font-serif text-xl hover:text-accent">
              {site.email}
            </a>
          </div>

          <div className="border border-line bg-paper-2 p-5">
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">
              Dirección postal
            </p>
            <address className="mt-1 space-y-0.5 text-sm not-italic text-ink-soft">
              {site.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="border border-line p-5">
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">
              Sobre los plazos
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              La disponibilidad de agenda, el coste de la primera visita y los plazos de
              ejecución se confirman para cada proyecto tras revisar el alcance.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="border border-line bg-paper p-6 md:p-8">
          <h2 className="text-2xl">Solicitud de información</h2>
          <p className="mt-2 text-sm text-muted">
            Los campos marcados con <span className="text-accent">*</span> son obligatorios.
          </p>
          <div className="mt-6">
            <ContactForm site={site} />
          </div>
        </div>
      </div>
    </div>
  );
}
