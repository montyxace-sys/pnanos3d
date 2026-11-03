import type { Metadata } from "next";
import { siteUrl } from "@/app/sitemap";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Aviso legal y condiciones de uso de TusPlanos3D: generador de planos online gratuito, calculadora de electricidad y climatización.",
  alternates: {
    canonical: `${siteUrl()}/aviso-legal/`,
  },
  robots: { index: true, follow: false },
};

export default function AvisoLegalPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14 text-ink">
      <h1 className="text-3xl font-bold">Aviso legal</h1>
      <p className="mt-4 text-sm text-ink-soft">
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio
        Electrónico (LSSI-CE), y de la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos
        digitales (LOPDGDD), se facilita la siguiente información.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Datos identificativos del titular</h2>
      <p className="mt-2 text-sm text-muted">
        Titular: TusPlanos3D
        <br />
        Correo electrónico: info@tusplanos3d.es
        <br />
        Sitio web: https://tusplanos3d.es
      </p>

      <h2 className="mt-8 text-xl font-semibold">2. Objeto del sitio web</h2>
      <p className="mt-2 text-sm text-muted">
        TusPlanos3D ofrece un generador de planos 2D de vivienda, una calculadora de potencia eléctrica contratada
        mínima y una calculadora de climatización (frigorías). Todas las herramientas son gratuitas y se ejecutan en
        el navegador del usuario. El uso del sitio implica la aceptación de este aviso legal y de la política de
        privacidad y cookies.
      </p>

      <h2 className="mt-8 text-xl font-semibold">3. Condiciones de uso</h2>
      <p className="mt-2 text-sm text-muted">
        El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que se ofrecen a través del sitio
        web y a no emplearlos para incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden
        público.
      </p>
      <p className="mt-2 text-sm text-muted">
        El titular se reserva el derecho de modificar, suspender o cancelar cualquier aspecto del sitio web sin previo
        aviso.
      </p>

      <h2 className="mt-8 text-xl font-semibold">4. Propiedad intelectual e industrial</h2>
      <p className="mt-2 text-sm text-muted">
        Todos los contenidos del sitio web (textos, imágenes, logotipos, código fuente, diseño gráfico, etc.) son
        propiedad del titular o de sus licenciantes y están protegidos por las leyes españolas e internacionales de
        propiedad intelectual e industrial.
      </p>
      <p className="mt-2 text-sm text-muted">
        Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación, total o
        parcial, de los contenidos sin autorización expresa del titular.
      </p>

      <h2 className="mt-8 text-xl font-semibold">5. Exclusión de garantías y responsabilidad</h2>
      <p className="mt-2 text-sm text-muted">
        Los resultados de las calculadoras son orientativos y no sustituyen el asesoramiento profesional. El titular no
        se responsabiliza de los daños derivados del uso indebido de la información ni de la interpretación de los
        resultados obtenidos.
      </p>
      <p className="mt-2 text-sm text-muted">
        El sitio web se ofrece "tal cual" y puede contener errores o inexactitudes. El titular no garantiza la
        disponibilidad continua ni la ausencia de virus o elementos dañinos.
      </p>

      <h2 className="mt-8 text-xl font-semibold">6. Enlaces externos</h2>
      <p className="mt-2 text-sm text-muted">
        El sitio puede contener enlaces a páginas de terceros. El titular no controla ni se responsabiliza del
        contenido, políticas de privacidad ni prácticas de dichos sitios.
      </p>

      <h2 className="mt-8 text-xl font-semibold">7. Protección de datos (LOPDGDD / RGPD)</h2>
      <p className="mt-2 text-sm text-muted">
        El tratamiento de datos personales se rige por nuestra{" "}
        <Link href="/cookies" className="text-accent underline">
          Política de cookies y protección de datos
        </Link>
        . En resumen:
      </p>
      <ul className="mt-2 space-y-1 text-sm text-muted list-disc list-inside">
        <li>Sin cuenta: los datos se guardan solo en tu navegador (localStorage). No se envían a servidores.</li>
        <li>Con cuenta: los datos se almacenan en Supabase (servidores en la UE) para sincronización.</li>
        <li>El chat cifrado (E2EE) cifra los mensajes antes de enviarlos; el servidor solo almacena texto cifrado.</li>
        <li>No se comparten datos con terceros ni se usan para publicidad.</li>
      </ul>
      <p className="mt-2 text-sm text-muted">
        Puedes ejercer tus derechos de acceso, rectificación, supresión, portabilidad y oposición escribiendo a
        info@tusplanos3d.es.
      </p>

      <h2 className="mt-8 text-xl font-semibold">8. Legislación aplicable y jurisdicción</h2>
      <p className="mt-2 text-sm text-muted">
        Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier controversia,
        las partes se someten a los Juzgados y Tribunales de la ciudad de residencia del titular.
      </p>

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/" className="text-sm text-accent underline">Volver al inicio</Link>
      </div>
    </div>
  );
}