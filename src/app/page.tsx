"use client";
import { useState, useEffect } from "react";
import { CATALOG, CAT_BY_KEY } from "@/lib/plano/catalog";
import {
  docFileName,
  downloadBlob,
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
  // Estado del proyecto (habitaciones + piezas) y selección.
  const [doc, setDoc] = useState<PlanDoc>(() => exampleDoc());
  const [selection, setSelection] = useState<Selection | null>(null);

  // Cargar desde localStorage (deferido para evitar cascada de renders)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = loadDoc();
      if (stored) setDoc(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Guardar en localStorage cuando cambie el doc (sincronización externa, no setState)
  useEffect(() => {
    saveDoc(doc);
  }, [doc]);

  // Atajos mínimos: Borrar (Supr) y Esc — usando addEventListener fuera de React state
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelection(null);
      }
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
    // Usamos addEventListener global; no depende de la tree React
    (window as unknown as { addEventListener: (t: string, l: EventListener) => void }).addEventListener("keydown", onKeyDown as EventListener);
    return () => (window as unknown as { removeEventListener: (t: string, l: EventListener) => void }).removeEventListener("keydown", onKeyDown as EventListener);
  }, [selection]);

  // --- Operaciones ---
  function addRoom() {
    const id = uid();
    setDoc((current) => ({
      ...current,
      rooms: [
        ...current.rooms,
        { id, name: `Estancia ${current.rooms.length + 1}`, x: 0, y: 0, w: 400, h: 350 },
      ],
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
        rooms: [
          ...current.rooms,
          { ...room, id, x: room.x + 60, y: room.y + 60, name: `${room.name} (copia)` },
        ],
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
    const svg = document.getElementById("canvasPlanos") as unknown as SVGSVGElement | null;
    if (!svg) return;
    const markup = new XMLSerializer().serializeToString(svg);
    downloadBlob(
      new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${markup}`], {
        type: "image/svg+xml;charset=utf-8",
      }),
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
      if (clean.rooms.length === 0 && clean.pieces.length === 0 && !clean.title) {
        return;
      }
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
    <div>
      {/* Barra herramientas */}
      <div className="flex flex-wrap items-center gap-2 border border-line bg-paper-2 p-3">
        <button type="button" onClick={addRoom} className={btn}>
          Añadir estancia
        </button>
        <button type="button" onClick={duplicateSelection} disabled={!selection} className={btn}>
          Duplicar
        </button>
        <button type="button" onClick={deleteSelection} disabled={!selection} className={btn}>
          Eliminar
        </button>
        <button type="button" onClick={() => window.confirm("¿Vaciar todo?")} className={btn}>
          Vaciar
        </button>
        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
        <button type="button" onClick={exportPdf} className={btnPrimary}>
          Descargar PDF
        </button>
        <button type="button" onClick={exportSvg} className={btn}>
          SVG
        </button>
        <button type="button" onClick={exportJson} className={btn}>
          JSON
        </button>
        <label className={`${btn} cursor-pointer`}>
          Cargar proyecto
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => importJson(e as React.ChangeEvent<HTMLInputElement>)}
            className="sr-only"
          />
        </label>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-muted">
        «Descargar PDF» abre el diálogo de impresión: A4 apaisado, 100 % de escala.
      </p>

      {/* Canvas para dibujar muros — code.js se ejecuta por window.addEventListener("load") */}
      <canvas
        id="canvasPlanos"
        width={1024}
        height={520}
        className="block h-full w-full select-none"
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
          bottom: "20px",
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
          zIndex: "20",
          boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        }}
      />
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Arrastra para iniciar muro, tecla medida exacta en metros (Enter).
      </p>

      {/* Propiedades */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_260px]">
        <aside className="border border-line bg-paper-2 p-3 lg:max-h-[72vh] lg:overflow-y-auto">
          <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
            Mobiliario y construcción
          </h2>
          <div className="mt-3 space-y-4">
            {CATALOG.map((group) => (
              <section key={group.id}>
                <h3 className="text-[11px] font-semibold tracking-wider text-accent uppercase">
                  {group.label}
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {group.items.map((item) => {
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => addPiece(item.key)}
                        title={`${item.label} · ${item.w}×${item.h} cm`}
                        className="flex flex-col items-center gap-1 border border-line bg-paper px-1 py-2 text-[11px] leading-tight text-ink-soft transition:hover:border-accent-bright hover:text-accent"
                      >
                        <svg
                          viewBox={`${-item.w / 2 - 8} ${-item.h / 2 - 8} ${item.w + 16} ${item.h + 16}`}
                          className="h-9 w-9 shrink-0"
                          aria-hidden
                        >
                          <g
                            fill="#faf9f7"
                            stroke="#1c1f24"
                            strokeWidth={3}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          >
                            {item.draw()}
                          </g>
                        </svg>
                        <span className="text-center">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <aside className="space-y-5 border border-line bg-paper-2 p-3 lg:max-h-[72vh] lg:overflow-y-auto">
          <section>
            <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
              Proyecto
            </h2>
            <label className="mt-2 block text-xs text-muted">
              Título del plano
              <input
                type="text"
                value={doc.title}
                maxLength={80}
                onChange={(e) =>
                  setDoc((current) => ({ ...current, title: (e.target as HTMLInputElement).value }))}
                className={field}
              />
            </label>
          </section>

          {selectedRoom && (
            <section>
              <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
                Estancia seleccionada
              </h2>
              <label className="mt-2 block text-xs text-muted">
                Nombre
                <input
                  type="text"
                  value={selectedRoom.name}
                  maxLength={60}
                  onChange={(e) =>
                    updateRoom(selectedRoom.id, { name: (e.target as HTMLInputElement).value })}
                  className={field}
                />
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <NumInput
                  label="Ancho"
                  value={selectedRoom.w / 100}
                  suffix="m"
                  onCommit={(value) =>
                    updateRoom(selectedRoom.id, { w: Math.min(5000, Math.max(40, Math.round(value * 10))) })
                  }
                />
                <NumInput
                  label="Largo"
                  value={selectedRoom.h / 100}
                  suffix="m"
                  onCommit={(value) =>
                    updateRoom(selectedRoom.id, { h: Math.min(5000, Math.max(40, Math.round(value * 10))) })
                  }
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                Superficie: <strong>{fmt(roomArea(selectedRoom))} m²</strong>
              </p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={duplicateSelection} className={btn}>
                  Duplicar
                </button>
                <button type="button" onClick={deleteSelection} className={btn}>
                  Eliminar
                </button>
              </div>
            </section>
          )}

          {selectedPiece && selectedCatalogItem && (
            <section>
              <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
                Pieza seleccionada
              </h2>
              <p className="mt-2 text-sm font-semibold text-ink">
                {selectedCatalogItem.label}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <NumInput
                  label="Ancho"
                  value={selectedPiece.w}
                  suffix="cm"
                  onCommit={(value) =>
                    updatePiece(selectedPiece.id, { w: Math.min(1000, Math.max(10, Math.round(value))) })
                  }
                />
                <NumInput
                  label="Fondo"
                  value={selectedPiece.h}
                  suffix="cm"
                  onCommit={(value) =>
                    updatePiece(selectedPiece.id, { h: Math.min(1000, Math.max(10, Math.round(value))) })
                  }
                />
              </div>

              <label className="mt-3 block text-xs text-muted">
                Giro: {(((selectedPiece.rot % 360) + 360) % 360)}°
                <input
                  type="range"
                  min={0}
                  max={345}
                  step={15}
                  value={((selectedPiece.rot % 360) + 360) % 360}
                  onChange={(e) =>
                    updatePiece(selectedPiece.id, {
                      rot: Number((e.target as HTMLInputElement).value),
                    })}
                  className="mt-1 w-full accent-[#f6821f]"
                />
              </label>
              <div className="mt-1 flex gap-2">
                <button type="button" onClick={() => rotatePiece(selectedPiece.id, -15)} className={btn}>
                  −15°
                </button>
                <button type="button" onClick={() => rotatePiece(selectedPiece.id, 15)} className={btn}>
                  +15°
                </button>
                <button type="button" onClick={() => rotatePiece(selectedPiece.id, 90)} className={btn}>
                  +90°
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <button type="button" onClick={duplicateSelection} className={btn}>
                  Duplicar
                </button>
                <button type="button" onClick={deleteSelection} className={btn}>
                  Eliminar
                </button>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">Resumen</h2>
            <dl className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Estancias</dt>
                <dd className="font-semibold">{doc.rooms.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Piezas</dt>
                <dd className="font-semibold">{doc.pieces.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Superficie total</dt>
                <dd className="font-semibold text-accent">{fmt(totalArea(doc))} m²</dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">Estancias</h2>
            <ul className="mt-2 space-y-1">
              {doc.rooms.map((room) => {
                const active = selection?.kind === "room" && selection.id === room.id;
                return (
                  <li key={room.id}>
                    <button
                      type="button"
                      onClick={() => setSelection({ kind: "room", id: room.id })}
                      className={`flex w-full items-center justify-between gap-2 border px-2 py-1.5 text-left text-xs transition ${
                        active ? "border-accent-bright bg-paper text-accent" : "border-line bg-paper hover:border-accent-bright"
                      }`}
                    >
                      <span className="truncate">{room.name}</span>
                      <span className="shrink-0 text-muted">{fmt(roomArea(room))} m²</span>
                    </button>
                  </li>
                );
              })}
              {doc.rooms.length === 0 && (
                <li className="text-xs text-muted">Sin estancias todavía.</li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}