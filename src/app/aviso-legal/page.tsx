import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/app/sitemap";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal y condiciones de uso de TusPlanos3D.",
  alternates: {
    canonical: `${siteUrl()}/aviso-legal/`,
  },
  robots: { index: true, follow: false },
};

export default function AvisoLegalPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14 text-gray-100">
      <h1 className="text-3xl font-bold">Aviso legal</h1>
      <p className="mt-4 text-sm text-gray-300">
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio
        Electrónico, y de la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales,
        se facilita la siguiente información:
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Titular del sitio</h2>
      <p className="mt-2 text-sm text-muted">
        Titular: TusPlanos3D · Correo: info@tusplanos3d.es · Teléfono: +34 600 000 000.
      </p>

      <h2 className="mt-8 text-xl font-semibold">2. Objeto</h2>
      <p className="mt-2 text-sm text-muted">
        El presente sitio web ofrece un generador de planos básico y una calculadora de potencia contratada. El uso del
        sitio implica la aceptación de este aviso legal.
      </p>

      <h2 className="mt-8 text-xl font-semibold">3. Propiedad intelectual</h2>
      <p className="mt-2 text-sm text-muted">
        Los contenidos, diseño, logotipo y marcas son propiedad del titular o de sus licenciantes y están protegidos por
        la normativa vigente.
      </p>

      <h2 className="mt-8 text-xl font-semibold">4. Limitación de responsabilidad</h2>
      <p className="mt-2 text-sm text-muted">
        La información tiene carácter orientativo. El titular no se responsabiliza del uso indebido ni de los daños
        derivados de la interpretación de los resultados.
      </p>

      <h2 className="mt-8 text-xl font-semibold">5. Enlaces externos</h2>
      <p className="mt-2 text-sm text-muted">
        Los enlaces a terceros son responsabilidad del proveedor externo; no constituyen endorsement.
      </p>

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/" className="text-sm text-accent underline">Volver al inicio</Link>
      </div>
    </div>
  );
}
