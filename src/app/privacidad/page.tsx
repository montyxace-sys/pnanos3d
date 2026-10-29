import type { Metadata } from "next";
import Link from "next/link";
import { getSite } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Información sobre el tratamiento de los datos enviados a través del formulario de contacto.",
};

export default async function PrivacidadPage() {
  const site = await getSite();

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Información básica
      </p>
      <h1 className="mt-3 text-4xl">Privacidad y datos personales</h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft">
        <section>
          <h2 className="text-lg text-ink">Qué datos recogemos</h2>
          <p className="mt-2">
            Únicamente los campos que rellenas en el formulario de contacto: nombre, email,
            teléfono (si lo indicas), tipo de proyecto y el texto de tu mensaje.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-ink">Para qué los usamos</h2>
          <p className="mt-2">
            Para responder a tu solicitud de información y, si decides continuar, preparar una
            propuesta. No los usamos para enviar comunicaciones comerciales salvo que nos lo
            pidas expresamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg text-ink">Dónde se guardan y quién los ve</h2>
          <p className="mt-2">
            Las solicitudes se almacenan en la base de datos del estudio (Supabase) y solo
            tiene acceso a ellas quien gestiona esta web. Puedes pedir el acceso, la
            rectificación o la supresión de tus datos escribiendo a{" "}
            <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-2">
              {site.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg text-ink">Conservación</h2>
          <p className="mt-2">
            Conservamos las solicitudes durante el tiempo necesario para atender tu consulta
            y, después, mientras existan obligaciones legales de conservación.
          </p>
        </section>

        <p className="rounded border border-dashed border-line bg-paper-2 px-5 py-4 text-muted">
          Documento pendiente de revisión jurídica: ajusta el responsable del tratamiento, la
          base jurídica, los plazos de conservación y los destinatarios (incluidos proveedores
          como Supabase y Resend) a la situación real del negocio antes de publicarlo.
        </p>
      </div>

      <Link
        href="/contacto/"
        className="mt-8 inline-block rounded border border-ink px-5 py-2.5 text-sm font-semibold tracking-wide uppercase transition hover:border-accent-bright hover:text-accent"
      >
        Volver al formulario
      </Link>
    </div>
  );
}
