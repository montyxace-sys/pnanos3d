import type { Metadata } from "next";
import { siteUrl } from "@/app/sitemap";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Política de cookies y almacenamiento local y online de TusPlanos3D. Sin rastreo ni publicidad. GDPR compliant.",
  alternates: {
    canonical: `${siteUrl()}/cookies/`,
  },
  robots: { index: true, follow: false },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-bold">Política de cookies</h1>
      <p className="mt-4 text-sm text-muted">
        Este sitio no usa cookies de rastreo ni publicidad. Lo único que se guarda es tu proyecto en tu navegador
        (localStorage) y, si inicias sesión, tus datos se almacenan en la nube (Supabase) para sincronización
        entre dispositivos.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Almacenamiento local</h2>
      <p className="mt-2 text-sm text-muted">
        Sin iniciar sesión, todo se guarda únicamente en tu navegador:
      </p>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        <li><code className="bg-paper-2 px-1">tusplanos3d:plano:v1</code> → habitaciones, piezas, medidas.</li>
        <li><code className="bg-paper-2 px-1">tusplanos3d:walls</code> → muros dibujados.</li>
        <li><code className="bg-paper-2 px-1">chat_pass_*</code> → clave de cifrado del chat (E2EE, solo en tu navegador).</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Almacenamiento online (opcional)</h2>
      <p className="mt-2 text-sm text-muted">
        Si creas una cuenta e inicias sesión, tu proyecto se sincroniza con la nube (Supabase) para que puedas
        acceder desde cualquier dispositivo. Los datos se cifran en tránsito (HTTPS) y se almacenan en servidores
        seguros de Supabase (UE).
      </p>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        <li><strong>Datos almacenados online:</strong> proyectos de planos, mensajes de chat cifrados (E2EE).</li>
        <li><strong>Autenticación:</strong> Supabase Auth (email/contraseña, sin contraseñas de terceros).</li>
        <li><strong>Sin rastreo:</strong> No se usan cookies de análisis ni publicidad.</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Cookies técnicas</h2>
      <p className="mt-2 text-sm text-muted">
        El sitio no instala cookies propias. Las únicas cookies que pueden aparecer son las técnicas de Next.js
        (necesarias para el funcionamiento del sitio) y, si usas el chat, las de Supabase para mantener la sesión.
      </p>

      <div className="mt-10 border-t border-line pt-6">
        <Link href="/" className="text-sm text-accent underline">Volver al generador</Link>
      </div>
    </div>
  );
}