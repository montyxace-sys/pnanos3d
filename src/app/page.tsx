"use client";
import { useState, useEffect } from "react";
import { CATALOG, CAT_BY_KEY } from "@/lib/plano/catalog";
import { getSupabase } from "@/lib/supabase";
import {
  docFileName,
  downloadBlob,
  exampleDoc,
  fmt,
  loadDoc,
  roomArea,
  saveDoc,
  totalArea,
  uid,
} from "@/lib/plano/store";
import type { PlanDoc, Selection } from "@/lib/plano/types";

const btn = "rounded bg-gray-700 px-3 py-2 text-xs text-gray-200";
const btnPrimary = "rounded bg-orange-500 px-4 py-2 text-xs font-semibold text-gray-900";

function NumInput({
  label,
  value,
  suffix,
  onCommit,
}: {
  label: string;
  value: number;
  suffix: string;
  onCommit: (value: number) => void;
}) {
  const [raw, setRaw] = useState(() => String(value));
  const [prev, setPrev] = useState(value);
  if (value !== prev) { setPrev(value); setRaw(String(value)); }
  function commit() {
    const parsed = Number(raw.replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) onCommit(parsed);
    else setRaw(String(value));
  }
  return (
    <label className="block text-xs text-gray-300">
      {label}
      <span className="mt-1 flex items-center gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          className="mt-1 w-full rounded border border-gray-600 bg-gray-900 px-2 py-1.5 text-sm text-gray-100 focus:border-orange-400 focus:outline-none"
        />
        <span className="shrink-0">{suffix}</span>
      </span>
    </label>
  );
}

export default function PlanEditor() {
  const [doc, setDoc] = useState<PlanDoc>(() => exampleDoc());
  const [selection, setSelection] = useState<Selection | null>(null);
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setUser(data.session?.user?.email ?? null));
    const { data: subscription } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user?.email ?? null);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = loadDoc();
      if (stored) setDoc(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveDoc(doc);
  }, [doc]);

  // --- Operaciones ---
  function addRoom() {
    const id = uid();
    setDoc((c) => ({ ...c, rooms: [...c.rooms, { id, name: `Estancia ${c.rooms.length + 1}`, x: 0, y: 0, w: 400, h: 350 }] }));
    setSelection({ kind: "room", id });
  }
  function addPiece(key: string) {
    const item = CAT_BY_KEY[key];
    if (!item) return;
    const id = uid();
    setDoc((c) => ({ ...c, pieces: [...c.pieces, { id, key, x: 0, y: 0, w: item.w, h: item.h, rot: 0 }] }));
    setSelection({ kind: "piece", id });
  }
  function deleteSelection() {
    if (!selection) return;
    setDoc((c) =>
      selection.kind === "room"
        ? { ...c, rooms: c.rooms.filter((r) => r.id !== selection.id) }
        : { ...c, pieces: c.pieces.filter((p) => p.id !== selection.id) },
    );
    setSelection(null);
  }
  function duplicateSelection() {
    if (!selection) return;
    const id = uid();
    if (selection.kind === "room") {
      const room = doc.rooms.find((i) => i.id === selection.id);
      if (!room) return;
      setDoc((c) => ({ ...c, rooms: [...c.rooms, { ...room, id, x: room.x + 60, y: room.y + 60, name: `${room.name} (copia)` }] }));
    } else {
      const piece = doc.pieces.find((i) => i.id === selection.id);
      if (!piece) return;
      setDoc((c) => ({ ...c, pieces: [...c.pieces, { ...piece, id, x: piece.x + 60, y: piece.y + 60 }] }));
    }
    setSelection({ kind: selection.kind, id });
  }
  function updateRoom(id: string, patch: Partial<{ name: string; w: number; h: number }>) {
    setDoc((c) => ({ ...c, rooms: c.rooms.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
  }
  function updatePiece(id: string, patch: Partial<{ w: number; h: number; rot: number }>) {
    setDoc((c) => ({ ...c, pieces: c.pieces.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }
  function rotatePiece(id: string, delta: number) {
    const piece = doc.pieces.find((i) => i.id === id);
    if (!piece) return;
    updatePiece(id, { rot: ((piece.rot + delta) % 360 + 360) % 360 });
  }
  function exportPdf() {
    window.print();
  }
  function exportSvg() {
    const svg = document.getElementById("canvasPlanos") as SVGSVGElement | null;
    if (!svg) return;
    const markup = new XMLSerializer().serializeToString(svg);
    downloadBlob(new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${markup}`], { type: "image/svg+xml;charset=utf-8" }), docFileName(doc, "svg"));
  }
  function exportJson() {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    downloadBlob(blob, docFileName(doc, "json"));
  }
  async function saveCloud() {
    const sb = getSupabase();
    if (!sb || !user) { alert("Inicia sesion para guardar en tu cuenta."); return; }
    const name = window.prompt("Nombre del plano", "Mi plano") || "Mi plano";
    const { error } = await sb.from("user_plans").insert({ name, plan: doc });
    if (error) alert("No se pudo guardar: " + error.message);
    else alert("Plan guardado en tu cuenta.");
  }

  async function loadCloud() {
    const sb = getSupabase();
    if (!sb || !user) { alert("Inicia sesion para cargar tus planos."); return; }
    const { data, error } = await sb
      .from("user_plans")
      .select("id,name,plan")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) { alert("No hay planos guardados o hubo error."); return; }
    setDoc(data.plan as PlanDoc);
    alert("Cargado: " + data.name);
  }

  function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    file.text().then((text: string) => {
      const parsed: PlanDoc = JSON.parse(text);
      setDoc(parsed);
      setSelection(null);
    });
  }

  // --- Derivados ---
  const selectedRoom = selection?.kind === "room" ? doc.rooms.find((r) => r.id === selection.id) ?? null : null;
  const selectedPiece = selection?.kind === "piece" ? doc.pieces.find((p) => p.id === selection.id) ?? null : null;
  const selectedCatalogItem = selectedPiece ? CAT_BY_KEY[selectedPiece.key] ?? null : null;

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <header className="mb-2 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/logo.svg"
          alt="TusPlanos3D"
          width={205}
          height={50}
          className="h-10 w-auto"
        />
        <h1 className="text-xl font-bold text-orange-400">Generador de Planos</h1>
      </header>

      <div className="flex flex-wrap items-center gap-2 border border-gray-700 bg-gray-800/85 p-3 backdrop-blur">
        <button type="button" onClick={addRoom} className={btn}>Añadir estancia</button>
        <button type="button" onClick={duplicateSelection} disabled={!selection} className={btn}>Duplicar</button>
        <button type="button" onClick={deleteSelection} disabled={!selection} className={btn}>Eliminar</button>
        <button type="button" onClick={() => window.confirm("¿Vaciar todo?")} className={btn}>Vaciar</button>
        <span className="mx-1 hidden h-6 w-px bg-gray-600 sm:block" />
        <button type="button" onClick={exportPdf} className={btnPrimary}>Descargar PDF</button>
        <button type="button" onClick={exportSvg} className={btn}>SVG</button>
        <button type="button" onClick={exportJson} className={btn}>JSON</button>
    {user && (
      <>
        <button type="button" onClick={saveCloud} className={btn}>Guardar cuenta</button>
        <button type="button" onClick={loadCloud} className={btn}>Cargar cuenta</button>
      </>
    )}
        <label className={`${btn} cursor-pointer`}>
          Cargar proyecto
          <input type="file" accept="application/json,.json" onChange={(e) => importJson(e as React.ChangeEvent<HTMLInputElement>)} className="sr-only" />
        </label>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted">
        «Descargar PDF» abre el diálogo de impresión: A4 apaisado, 100 % de escala.
      </p>

      {/* Canvas de muros */}
      <div className="relative mt-4 flex gap-4">
        <div className="relative min-w-0 flex-1">
          <canvas
            id="canvasPlanos"
            width={1024}
            height={520}
            className="block h-full w-full select-none rounded border border-gray-700 bg-[#1e1e1e]"
            style={{ touchAction: "none", cursor: "crosshair" }}
            role="img"
            aria-label="Lienzo para dibujar muros"
          />
          <input
            type="text"
            id="input-cota"
            placeholder="0.00"
            style={{
              position: "absolute",
              bottom: "25px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#2d2d2d",
              border: "2px solid #4fc3f7",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              width: "80px",
              textAlign: "center",
              display: "none",
              zIndex: "30",
            }}
          />

          {/* UI flotante (herramientas + presupuesto) */}
          <div
            id="ui-container"
            className="absolute top-4 left-4 z-10 w-72 rounded-lg border border-gray-700 bg-gray-800/95 p-4 shadow-lg backdrop-blur"
          >
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo.svg" alt="TusPlanos3D" width={160} height={39} className="h-8 w-auto" />
            </div>
            <h3 className="mt-1 text-sm font-bold text-orange-400">Estudio de Arquitectura</h3>
            <p className="mt-1 text-[11px] text-gray-300">• Teclea metros + <kbd>Enter</kbd> para fijar muro.</p>
            <p className="mt-1 text-[11px] text-gray-300">• Atajo: <kbd>Ctrl + Z</kbd> para Deshacer.</p>

            <div className="mt-3 space-y-2">
              <button id="btn-muro" type="button" className="w-full rounded bg-orange-500 px-2 py-1.5 text-xs font-semibold text-gray-900 transition:hover:bg-orange-400" onClick={() => (window as unknown as { cambiarHerramienta?: (h: string) => void }).cambiarHerramienta?.("muro")}>Dibujar Estructura</button>
              <button id="btn-puerta" type="button" className="w-full rounded bg-gray-200 px-2 py-1.5 text-xs text-gray-800 transition:hover:bg-gray-300" onClick={() => (window as unknown as { cambiarHerramienta?: (h: string) => void }).cambiarHerramienta?.("puerta")}>Puerta (0.80m)</button>
              <button id="btn-ventana" type="button" className="w-full rounded bg-gray-200 px-2 py-1.5 text-xs text-gray-800 transition:hover:bg-gray-300" onClick={() => (window as unknown as { cambiarHerramienta?: (h: string) => void }).cambiarHerramienta?.("ventana")}>Ventana (1.20m)</button>
            </div>

            <div className="mt-3 space-y-1">
              <button
                id="btn-grosor-carga"
                onClick={() => (window as unknown as { cambiarGrosor?: (g: number, t: string) => void }).cambiarGrosor?.(30, "carga")}
                className="w-full rounded bg-orange-500 px-2 py-1.5 text-xs font-semibold text-gray-900 transition:hover:bg-orange-400"
              >
                Grosor Carga (30cm)
              </button>
              <button
                id="btn-grosor-tabique"
                onClick={() => (window as unknown as { cambiarGrosor?: (g: number, t: string) => void }).cambiarGrosor?.(10, "tabique")}
                className="w-full rounded bg-gray-200 px-2 py-1.5 text-xs text-gray-800 transition:hover:bg-gray-300"
              >
                Grosor Tabique (10cm)
              </button>
            </div>

            <div id="budget-container" className="mt-4 rounded bg-gray-800 p-2 text-[10px]">
              <div className="flex justify-between">
                <span>Muros Carga:</span>
                <span className="font-mono font-bold" id="b-carga">0.00 m</span>
              </div>
              <div className="flex justify-between">
                <span>Tabiquería:</span>
                <span className="font-mono font-bold" id="b-tabique">0.00 m</span>
              </div>
              <div className="flex justify-between">
                <span>Puertas:</span>
                <span className="font-mono font-bold" id="b-puertas">0 ud</span>
              </div>
              <div className="flex justify-between">
                <span>Ventanas:</span>
                <span className="font-mono font-bold" id="b-ventanas">0 ud</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-gray-600 pt-1 font-bold">
                <span>Total:</span>
                <span className="text-green-400" id="b-total">0.00 €</span>
              </div>
            </div>

            <button
              onClick={() => (window as unknown as { exportarAPDF?: () => void }).exportarAPDF?.()}
              className="mt-3 w-full rounded bg-green-500 px-3 py-2 text-xs font-semibold uppercase text-black transition:hover:bg-green-400"
            >
              Exportar Plano PDF
            </button>
          </div>
        </div>

        {/* Panel lateral de propiedades Next.js + catálogo */}
        <aside className="w-64 flex-shrink-0 space-y-4 overflow-y-auto border border-gray-700 bg-gray-800 p-3">
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400">Proyecto</h2>
            <label className="mt-2 block text-xs text-gray-300">
              Título
              <input
                type="text"
                value={doc.title}
                maxLength={80}
                onChange={(e) => setDoc((c) => ({ ...c, title: (e.target as HTMLInputElement).value }))}
                className="mt-1 w-full rounded border border-gray-600 bg-gray-900 px-2 py-1.5 text-sm text-gray-100 focus:border-orange-400 focus:outline-none"
              />
            </label>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400">Resumen</h2>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-300">Estancias</dt>
                <dd className="font-semibold">{doc.rooms.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">Clima ≈</dt>
                <dd className="font-bold text-green-400">
                  {(totalArea(doc) * 130 / 860).toFixed(1)} kW
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400">Mobiliario rápido</h2>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {CATALOG.slice(0, 4).map((g) =>
                g.items.slice(0, 2).map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    onClick={() => addPiece(it.key)}
                    title={`${it.label} · ${it.w}×${it.h} cm`}
                    className="flex flex-col items-center gap-1 rounded border border-gray-700 bg-gray-900 p-1 text-[9px] text-gray-200 transition:hover:border-orange-400 hover:text-orange-300"
                  >
                    <svg
                      viewBox={`${-it.w / 2 - 6} ${-it.h / 2 - 6} ${it.w + 12} ${it.h + 12}`}
                      className="h-5 w-5"
                    >
                      <g fill="#2d2d2d" stroke="#9ca3af" strokeWidth={3} strokeLinejoin="round">
                        {it.draw()}
                      </g>
                    </svg>
                    {it.label}
                  </button>
                )),
              )}
            </div>
            <p className="mt-1 text-[9px] text-gray-500">
              Click para añadir piezas de catálogo
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}