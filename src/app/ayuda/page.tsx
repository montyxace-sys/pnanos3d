import type { Metadata } from "next";
import { siteUrl } from "@/app/sitemap";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ayuda",
  description:
    "Guía de uso del generador de planos TusPlanos3D: dibujo 2D, muros, puertas, ventanas, mobiliario, medición, exportación y vista 3D.",
  alternates: {
    canonical: `${siteUrl()}/ayuda/`,
  },
  openGraph: {
    title: "Ayuda y guía de uso | TusPlanos3D",
    description:
      "Guía completa del generador de planos online: 2D, 3D, cotas, materiales, exportación PDF/SVG/JSON y calculadoras.",
    url: `${siteUrl()}/ayuda/`,
    siteName: "TusPlanos3D",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/img/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayuda y guía de uso | TusPlanos3D",
    description:
      "Guía completa del generador de planos online y la vista 3D: muros, piezas, cotas, materiales y exportación.",
    images: ["/img/og-image.svg"],
  },
};

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Centro de ayuda
      </p>
      <h1 className="mt-3 text-3xl font-bold">Cómo usar el generador de planos (2D + 3D)</h1>
      <p className="mt-4 text-sm text-ink-soft">
        Tu proyecto se guarda automáticamente en el navegador (localStorage). No se envía nada al servidor.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Dibujar muros (2D)</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Clic para empezar, mover cursor, segundo clic para fijar.</li>
        <li>Enter cuando aparezca el input de cota para fijar medida en metros.</li>
        <li>Shift fuerza ángulos a 90 grados.</li>
        <li>El handle de una estancia puede arrastrarse desde cualquiera de las 4 esquinas para redimensionarla.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">2. Piezas y objetos</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Escoge una estancia de catálogo o pieza en el panel y se colocará con sus medidas reales.</li>
        <li>Arrástrala para moverla, rota o ajusta ancho/fondo/co con el panel lateral.</li>
        <li>Hay piezas de salón, dormitorio, cocina, baño, construcción, climatización, varios y exterior.</li>
        <li>Incluye árboles, huerto/jardinera, piscina, fuente, barbacoa, etc.</li>
        <li>Las anotaciones de texto ("Texto / Nota") son editables (texto, color, tamaño) y se muestran en 2D y en 3D.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">3. Vista 3D</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Botón "Vista 3D" en el editor, o URL directa: <Link href="/vista-3d/" className="text-accent underline">/vista-3d/</Link>.</li>
        <li>Vistas rápidas: Isométrico, Planta, Frontal, Personado y Fachadas N/S/E/O.</li>
        <li>Día/Noche: cambia iluminación, fondo y brillo de ventanas por la noche.</li>
        <li>Capas: muros, tejado, muglebles, notas, suelos, cotas y medición.</li>
        <li>Medir 3D: coloca 2 puntos y verás la distancia en metros.</li>
        <li>Rotación automática para presentar el modelo.</li>
        <li>Exportar PNG o GLTF para usarlo en otros programas.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">4. Exportar</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Exportar PNG: captura del visor 2D.</li>
        <li>Exportar PDF: A4 apaisado con cotas y membrete.</li>
        <li>SVG / JSON para reutilización.</li>
        <li>Guardado automático en localStorage; el botón "Guardar copia" hace descarga de respaldo.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">5. Calculadoras</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Electricidad: potencia mínima basada en superficie + aparatos + factor de coincidencia + margen.</li>
        <li>Climatización: 130 frigorías por m² de útil, expuesto en frigorías, kW, kcal/h y BTU estimado.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">6. Chat Comunidad Vibecoders</h2>
      <p className="mt-2 text-sm text-muted">
        Abre el botón flotante, pon tu nickname sin registro y escribe mensajes. Se guardan localmente y se sincronizan entre pestañas del mismo dispositivo.
      </p>

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/" className="text-sm text-accent underline">Volver al generador de planos</Link>
      </div>
    </div>
  );
}