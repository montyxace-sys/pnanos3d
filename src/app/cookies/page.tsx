import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Política de cookies y almacenamiento local.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold">Política de cookies</h1>
      <p className="mt-4 text-sm text-muted">
        Este sitio no usa cookies de rastreo. Lo único que se guarda es tu proyecto en tu navegador (localStorage).
      </p>
      <h2 className="mt-8 text-xl font-semibold">Almacenamiento local</h2>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        <li><code className="bg-paper-2 px-1">tusplanos3d:plano:v1</code> → habitaciones, piezas, medidas.</li>
        <li><code className="bg-paper-2 px-1">tusplanos3d:walls</code> → muros dibujados.</li>
      </ul>
      <div className="mt-10 border-t border-line pt-6">
        <Link href="/" className="text-sm text-accent underline">Volver al generador</Link>
      </div>
    </div>
  );
}