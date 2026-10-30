import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ayuda",
  description: "Guia de uso del generador de planos TusPlanos3D.",
};

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
        Centro de ayuda
      </p>
      <h1 className="mt-3 text-3xl font-bold">Como usar el generador de planos</h1>
      <p className="mt-4 text-sm text-ink-soft">
        Tu proyecto se guarda en el navegador (localStorage). No se envia nada a servidores.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Dibujar muros</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Clic para empezar, mover cursor, segundo clic para fijar.</li>
        <li>Enter cuando aparezca el input de cota para fijar medida en metros.</li>
        <li>Shift fuerza angulos a 90 grados.</li>
        <li>Ctrl+Z o tecla u deshace; Esc cancela.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">2. Herramientas</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Muro / Puerta / Ventana: haz clic sobre un muro para insertar. Grosor: Carga 30cm o Tabique 10cm.</li>
        <li>Presupuesto en tiempo real con muros, puertas, ventanas.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">3. Exportar</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>Exportar Plano PDF: A4 apaisado con cotas y membrete.</li>
        <li>SVG / JSON para reutilizar o retomar el proyecto.</li>
        <li>Guardado automatico en localStorage.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">4. Cuentas / Login</h2>
      <p className="mt-2 text-sm text-muted">
        Si configuras Supabase, hay una ruta /login para Google Auth y /account (multi-pantalla).
        Para el resto, el generador funciona en modo offline/local.
      </p>

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/" className="text-sm text-accent underline">Volver al generador de planos</Link>
      </div>
    </div>
  );
}