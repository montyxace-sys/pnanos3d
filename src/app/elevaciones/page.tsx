"use client";

import { useEffect, useState } from "react";
import PlanElevations from "@/components/plano/PlanElevations";
import { loadDoc } from "@/lib/plano/store";
import Link from "next/link";

export default function ElevationsPage() {
  const [doc, setDoc] = useState<any | null>(null);
  useEffect(() => {
    const s = typeof window !== "undefined" ? window.localStorage.getItem("tusplanos3d:plano:v1") : null;
    if (!s) return;
    try { setDoc(JSON.parse(s)); } catch { setDoc(null); }
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/img/logo.svg" alt="TusPlanos3D" width={205} height={50} className="h-8 w-auto" />
        </Link>
        <h1 className="text-2xl font-bold text-ink">Elevaciones / Fachadas</h1>
      </header>
      {!doc && (
        <div className="space-y-3 text-muted">
          <p>
            Aquí puedes ver los <strong>alzados y fachadas</strong> de la vivienda que estés dibujando en el
            generador de planos. Cada muro se proyecta en vertical con sus huecos de puertas y ventanas para
            comprobar alturas y proporciones antes de la obra.
          </p>
          <p>
            Abre un proyecto en el <Link href="/" className="text-accent underline">generador de planos</Link> y
            vuelve a esta página para ver los alzados. También puedes revisar el proyecto en{" "}
            <Link href="/vista-3d/" className="text-accent underline">3D</Link> o calcular la{" "}
            <Link href="/electricidad/" className="text-accent underline">potencia eléctrica</Link> y la{" "}
            <Link href="/climatizacion/" className="text-accent underline">climatización</Link>.
          </p>
        </div>
      )}
      {doc && <PlanElevations doc={doc} />}
    </div>
  );
}