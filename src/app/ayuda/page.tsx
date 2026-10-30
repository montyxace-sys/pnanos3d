import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ayuda" };

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold">Cómo usar el generador de planos</h1>
      <p className="mt-3 text-sm text-muted">
        Tu proyecto se guarda en el navegador (localStorage). No se envía nada a servidores.
      </p>
      <h2 className="mt-8 text-xl font-semibold">1. Dibujar muros</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>• Clic para empezar, mueve cursor, segundo clic para fijar.</li>
        <li>• <code className="bg-paper-2 px-1">Enter</code> cuando aparezca el input cota: fija medida en metros.</li>
        <li>• <kbd className="bg-paper-2 px-1">Shift</kbd> forza ángulos a 90°.</li>
        <li>• <kbd className="bg-paper-2 px-1">Ctrl+Z</kbd> / <kbd>u</kbd> deshace. Esc cancela.</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">2. Herramientas</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>• Muro / Puerta / Ventana: haz clic sobre un muro para insertar. Grosor: Carga 30cm o Tabique 10cm.</li>
        <li>• Presupuesto en tiempo real con precios tipo muros/puertas/ventanas.</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">3. Exportar</h2>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        <li>• <strong>Exportar Plano PDF</strong> genera A4 apaisado con cotas y membrete.</li>
        <li>• SVG / JSON para reutilizar en Illustrator o retomar el proyecto.</li>
        <li>• El proyecto se guarda en localStorage automatically.</li>
      </ul>
      <h2 className="mt-8 text-xl font-semibold">4. Cuentas / Login (próximamente)</h2>
      <p className="mt-2 text-sm text-muted">
        Para activar registro con Google, sube a Supabase y despliega en un host que soporte backend.
        Deja el generador actual para pruebas locales.
      </p>
    </div>
  );
}