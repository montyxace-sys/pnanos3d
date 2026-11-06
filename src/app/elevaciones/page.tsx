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
      {!doc && <p className="text-muted">Abre un proyecto en el generador y vuelve aquí para ver los alzados.</p>}
      {doc && <PlanElevations doc={doc} />}
    </div>
  );
}