import { useState, useEffect } from "react";
import Script from "next/script";
import { CATALOG, CAT_BY_KEY } from "@/lib/plano/catalog";
import {
  docFileName,
  downloadBlob,
  emptyDoc,
  exampleDoc,
  fmt,
  loadDoc,
  roomArea,
  sanitizeDoc,
  saveDoc,
  totalArea,
  uid,
} from "@/lib/plano/store";
import type { PlanDoc, Selection } from "@/lib/plano/types";

const btn =
  "rounded border border-line bg-paper-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft transition:hover:border-accent-bright hover:text-accent disabled:cursor-not-allowed disabled:opacity-40";
const btnPrimary =
  "rounded bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper transition:hover:bg-accent";
const field =
  "mt-1 w-full border border-line bg-paper px-2 py-1.5 text-sm text-ink focus:border-accent-bright focus:outline-none";

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
  const [prevValue, setPrevValue] = useState<number>(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setRaw(String(value));
  }
  function commit() {
    const parsed = Number(raw.replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      onCommit(parsed);
    } else {
      setRaw(String(value));
    }
  }
  return (
    <label className="block text-xs text-muted">
      {label}
      <span className="mt-1 flex items-center gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          value={raw}
          onChange={(event) => setRaw(event.target.value as string)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") (event.target as HTMLInputElement).blur();
          }}
          className={field}
        />
        <span className="shrink-0">{suffix}</span>
      </span>
    </label>
  );
}

export default function PlanEditor() {
  // @ts-expect-error - Next.js en modo export tiene compatibilidad especial con React globals
  const [doc, setDoc] = useState<PlanDoc>(() => exampleDoc());
  const [selection, setSelection] = useState<Selection | null>(null);

  // Cargar/guardar en localStorage (deferido)
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

  // Atajos mínimos: Borrar (Supr) y Esc
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelection(null);
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        if (selection?.kind === "room") {
          setDoc((c) => ({ ...c, rooms: c.rooms.filter((r) => r.id !== selection.id) }));
        } else if (selection?.kind === "piece") {
          setDoc((c) => ({ ...c, pieces: c.pieces.filter((p) => p.id !== selection.id) }));
        }
        setSelection(null);
      }
    }
    (window as unknown as { addEventListener: (t: string, l: EventListener) => void }).addEventListener("keydown", onKeyDown as EventListener);
    return () => (window as unknown as { removeEventListener: (t: string, l: EventListener) => void }).removeEventListener("keydown", onKeyDown as EventListener);
  }, [selection]);

  // --- Operaciones ---
  function addRoom() {
    const id = uid();
    setDoc((current) => ({
      ...current,
      rooms: [...current.rooms, { id, name: `Estancia ${current.rooms.length + 1}`, x: 0, y: 0, w: 400, h: 350 }],
    }));
    setSelection({ kind: "room", id });
  }
  function addPiece(key: string) {
    const item = CAT_BY_KEY[key];
    if (!item) return;
    const id = uid();
    setDoc((current) => ({
      ...current,
      pieces: [...current.pieces, { id, key, x: 0, y: 0, w: item.w, h: item.h, rot: 0 }],
    }));
    setSelection({ kind: "piece", id });
  }
  function deleteSelection() {
    if (!selection) return;
    setDoc((current) =>
      selection.kind === "room"
        ? { ...current, rooms: current.rooms.filter((room) => room.id !== selection.id) }
        : { ...current, pieces: current.pieces.filter((piece) => piece.id !== selection.id) },
    );
    setSelection(null);
  }
  function duplicateSelection() {
    if (!selection) return;
    const id = uid();
    if (selection.kind === "room") {
      const room = doc.rooms.find((item) => item.id === selection.id);
      if (!room) return;
      setDoc((current) => ({
        ...current,
        rooms: [...current.rooms, { ...room, id, x: room.x + 60, y: room.y + 60, name: `${room.name} (copia)` }],
      }));
    } else {
      const piece = doc.pieces.find((item) => item.id === selection.id);
      if (!piece) return;
      setDoc((current) => ({
        ...current,
        pieces: [...current.pieces, { ...piece, id, x: piece.x + 60, y: piece.y + 60 }],
      }));
    }
    setSelection({ kind: selection.kind, id });
  }
  function updateRoom(id: string, patch: Partial<{ name: string; w: number; h: number }>) {
    setDoc((current) => ({
      ...current,
      rooms: current.rooms.map((room) => (room.id === id ? { ...room, ...patch } : room)),
    }));
  }
  function updatePiece(id: string, patch: Partial<{ w: number; h: number; rot: number }>) {
    setDoc((current) => ({
      ...current,
      pieces: current.pieces.map((piece) => (piece.id === id ? { ...piece, ...patch } : piece)),
    }));
  }
  function rotatePiece(id: string, delta: number) {
    const piece = doc.pieces.find((item) => item.id === id);
    if (!piece) return;
    updatePiece(id, { rot: ((piece.rot + delta) % 360 + 360) % 360 });
  }
  // Descargas
  function exportPdf() {
    window.print();
  }
  function exportSvg() {
    const svg = document.getElementById("canvasPlanos") as SVGSVGElement | null;
    if (!svg) return;
    const markup = new XMLSerializer().serializeToString(svg);
    downloadBlob(
      new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${markup}`], { type: "image/svg+xml;charset=utf-8" }),
      docFileName(doc, "svg"),
    );
  }
  function exportJson() {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    downloadBlob(blob, docFileName(doc, "json"));
  }
  function importJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    file.text().then((text: string) => {
      const parsed: unknown = JSON.parse(text);
      const clean = sanitizeDoc(parsed);
      if (clean.rooms.length === 0 && clean.pieces.length === 0 && !clean.title) return;
      setDoc(clean);
      setSelection(null);
    });
  }

  // --- Derivados ---
  const selectedRoom =
    selection?.kind === "room"
      ? doc.rooms.find((r) => r.id === selection.id) ?? null
      : null;
  const selectedPiece =
    selection?.kind === "piece"
      ? doc.pieces.find((p) => p.id === selection.id) ?? null
      : null;
  const selectedCatalogItem = selectedPiece ? CAT_BY_KEY[selectedPiece.key] ?? null : null;

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="beforeInteractive" />

      {/* Barra superior: herramientas del dibujo de muros */}
      <div className="flex flex-wrap items-center gap-2 border border-gray-700 bg-gray-800/85 p-3 backdrop-blur">
        <button
          id="btn-muro"
          type="button"
          className="btn-tool rounded bg-orange-500 px-3 py-1.5 text-xs font-semibold text-gray-900"
          onClick={() => (window as unknown as { cambiarHerramienta?: (h: string) => void }).cambiarHerramienta?.("muro")}
        >
          Dibujar Muro
        </button>
        <button
          id="btn-puerta"
          type="button"
          className="btn-tool rounded bg-gray-200 px-3 py-1.5 text-xs text-gray-800"
          onClick={() => (window as unknown as { cambiarHerramienta?: (h: string) => void }).cambiarHerramienta?.("puerta")}
        >
          Puerta 0.80m
        </button>
        <button
          id="btn-ventana"
          type="button"
          className="btn-tool rounded bg-gray-200 px-3 py-1.5 text-xs text-gray-800"
          onClick={() => (window as unknown as { cambiarHerramienta?: (h: string) => void }).cambiarHerramienta?.("ventana")}
        >
          Ventana 1.20m
        </button>

        <span className="mx-1 hidden h-6 w-px bg-gray-600 sm:block" />

        <button
          id="btn-grosor-carga"
          type="button"
          className="btn-tool rounded bg-orange-500 px-3 py-1.5 text-xs font-semibold text-gray-900"
          onClick={() => (window as unknown as { cambiarGrosor?: (g: number, t: string) => void }).cambiarGrosor?.(30, "carga")}
        >
          Grosor Carga (30cm)
        </button>
        <button
          id="btn-grosor-tabique"
          type="button"
          className="btn-tool rounded bg-gray-700 px-3 py-1.5 text-xs text-gray-200"
          onClick={() => (window as unknown as { cambiarGrosor?: (g: number, t: string) => void }).cambiarGrosor?.(10, "tabique")}
        >
          Grosor Tabique (10cm)
        </button>

        <span className="mx-1 hidden h-6 w-px bg-gray-600 sm:block" />

        <button type="button" onClick={addRoom} className="rounded bg-gray-700 px-3 py-1.5 text-xs text-gray-200">
          Añadir estancia
        </button>
        <button type="button" onClick={duplicateSelection} disabled={!selection} className="rounded bg-gray-700 px-3 py-1.5 text-xs text-gray-200 disabled:opacity-40">
          Duplicar
        </button>
        <button type="button" onClick={deleteSelection} disabled={!selection} className="rounded bg-gray-700 px-3 py-1.5 text-xs text-gray-200 disabled:opacity-40">
          Eliminar
        </button>
        <button type="button" onClick={() => window.confirm("¿Vaciar todo?")} className="rounded bg-gray-700 px-3 py-1.5 text-xs text-gray-200">
          Vaciar
        </button>

        <span className="ml-auto flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportPdf} className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
            Descargar PDF
          </button>
          <button
            onClick={() => (window as unknown as { exportarAPDF?: () => void }).exportarAPDF?.()}
            className="rounded bg-green-600 px-3 py-1.5 text-xs font-semibold text-white"
          >
            PDF Muros
          </button>
          <button type="button" onClick={exportSvg} className="rounded bg-gray-600 px-3 py-1.5 text-xs text-white">
            SVG
          </button>
          <button type="button" onClick={exportJson} className="rounded bg-gray-600 px-3 py-1.5 text-xs text-white">
            JSON
          </button>
          <label className="cursor-pointer rounded bg-gray-600 px-3 py-1.5 text-xs text-white">
            Cargar
            <input
              type="file"
              accept="application/json,.json"
              onChange={(e) => importJson(e as React.ChangeEvent<HTMLInputElement>)}
              className="sr-only"
            />
          </label>
        </span>
      </div>

      <div className="mt-1 text-xs text-gray-300">
        «Descargar PDF» abre el diálogo de impresión; «PDF Muros» genera PDF técnico con jsPDF (A4 horizontal).
      </div>

      <div className="relative mt-4 flex gap-4">
        {/* Canvas de muros */}
        <div className="relative min-w-0 flex-1">
          <canvas
            id="canvasPlanos"
            width={1024}
            height={520}
            className="block h-full w-full select-none rounded border border-gray-700 bg-[#1e1e1e]"
            style={{ touchAction: "none", cursor: "crosshair" }}
            role="img"
            aria-label="Lienzo para dibujar muros de la vivienda"
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
        </div>

        {/* Panel lateral de propiedades Next.js */}
        <aside className="w-64 flex-shrink-0 space-y-4 overflow-y-auto border border-gray-700 bg-gray-800 p-3">
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400">Proyecto</h2>
            <label className="mt-2 block text-xs text-gray-300">
              Título
              <input
                type="text"
                value={doc.title}
                onChange={(e) => setDoc((c) => ({ ...c, title: (e.target as HTMLInputElement).value }))}
                className="mt-1 w-full rounded border border-gray-600 bg-gray-900 px-2 py-1.5 text-sm text-gray-100 focus:border-orange-400 focus:outline-none"
              />
            </label>
          </section>

          {selectedRoom && (
            <section>
              <h2 className="text-xs font-semibold uppercase text-gray-400">Estancia</h2>
              <label className="mt-2 block text-xs text-gray-300">
                Nombre
                <input
                  type="text"
                  value={selectedRoom.name}
                  onChange={(e) => updateRoom(selectedRoom.id, { name: (e.target as HTMLInputElement).value })}
                  className="mt-1 w-full rounded border border-gray-600 bg-gray-900 px-2 py-1.5 text-sm text-gray-100 focus:border-orange-400 focus:outline-none"
                />
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <NumInput label="Ancho" value={selectedRoom.w / 100} suffix="m" onCommit={(v) => updateRoom(selectedRoom.id, { w: Math.min(5000, Math.max(40, Math.round(v * 10))) })} />
                <NumInput label="Largo" value={selectedRoom.h / 100} suffix="m" onCommit={(v) => updateRoom(selectedRoom.id, { h: Math.min(5000, Math.max(40, Math.round(v * 10))) })} />
              </div>
            </section>
          )}

          {selectedPiece && selectedCatalogItem && (
            <section>
              <h2 className="text-xs font-semibold uppercase text-gray-400">Pieza</h2>
              <p className="mt-1 text-sm font-semibold text-orange-300">{selectedCatalogItem.label}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <NumInput label="Ancho" value={selectedPiece.w} suffix="cm" onCommit={(v) => updatePiece(selectedPiece.id, { w: Math.min(1000, Math.max(10, Math.round(v))) })} />
                <NumInput label="Fondo" value={selectedPiece.h} suffix="cm" onCommit={(v) => updatePiece(selectedPiece.id, { h: Math.min(1000, Math.max(10, Math.round(v))) })} />
              </div>
              <label className="mt-2 block text-xs text-gray-300">
                Giro: {(((selectedPiece.rot % 360) + 360) % 360)}°
                <input
                  type="range"
                  min={0}
                  max={345}
                  step={15}
                  value={((selectedPiece.rot % 360) + 360) % 360}
                  onChange={(e) => updatePiece(selectedPiece.id, { rot: Number((e.target as HTMLInputElement).value) })}
                  className="mt-1 w-full accent-orange-500"
                />
              </label>
            </section>
          )}

          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400">Resumen</h2>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-300">Estancias</dt>
                <dd className="font-semibold">{doc.rooms.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">Piezas</dt>
                <dd className="font-semibold">{doc.pieces.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">Superficie</dt>
                <dd className="font-semibold text-orange-400">{fmt(totalArea(doc))} m²</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-300">Clima ≈</dt>
                <dd className="font-bold text-green-400">{(totalArea(doc) * 130 / 860).toFixed(1)} kW</dd>
              </div>
            </dl>
          </section>

          {/* Catálogo mobiliario con picker rápido */}
          <section>
            <h2 className="text-xs font-semibold uppercase text-gray-400">Mobiliario rápido</h2>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {CATALOG.slice(0, 4).map((g) => g.items.slice(0, 2).map((it) => (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => addPiece(it.key)}
                  title={`${it.label} · ${it.w}×${it.h} cm`}
                  className="flex flex-col items-center gap-1 rounded border border-gray-700 bg-gray-900 p-1 text-[9px] text-gray-200 transition:hover:border-orange-400 hover:text-orange-300"
                >
                  <svg viewBox={`${-it.w / 2 - 6} ${-it.h / 2 - 6} ${it.w + 12} ${it.h + 12}`} className="h-5 w-5">
                    <g fill="#2d2d2d" stroke="#9ca3af" strokeWidth={3} strokeLinejoin="round">
                      {it.draw()}
                    </g>
                  </svg>
                  {it.label}
                </button>
              )))}
            </div>
            <p className="mt-1 text-[9px] text-gray-500">Más piezas en el catálogo real. El canvas arriba sirve para dibujar muros.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}