"use client";

import { useEffect, useState } from "react";

const KEY = "tusplanos3d:cookies";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accept = localStorage.getItem(KEY);
    if (accept !== "accepted" && accept !== "rejected") setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(KEY, "accepted");
    setVisible(false);
  }
  function reject() {
    localStorage.setItem(KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-4 z-50 w-80 rounded-lg border border-line bg-paper-2 p-4 text-ink shadow-xl">
      <h3 className="text-sm font-bold text-accent">Aviso de cookies</h3>
      <p className="mt-1 text-xs text-muted">
        Usamos <strong>localStorage</strong> (solo tu proyecto) y cookies externas solo si activas
        servicios de terceros (login, Supabase, jsPDF). No hay reseñas ni analítica.
      </p>
      <div className="mt-3 flex gap-2">
        <button className="rounded bg-ink px-3 py-1.5 text-xs font-semibold text-paper" onClick={accept}>
          Aceptar todo
        </button>
        <button className="rounded border border-line px-3 py-1.5 text-xs text-ink-soft" onClick={reject}>
          Solo lo necesario
        </button>
      </div>
    </div>
  );
}