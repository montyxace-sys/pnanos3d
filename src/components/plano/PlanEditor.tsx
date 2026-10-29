"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import PlanSheet from "./PlanSheet";
import PlanSvg from "./PlanSvg";
import { CATALOG, CAT_BY_KEY } from "@/lib/plano/catalog";
import {
  docFileName,
  downloadBlob,
  emptyDoc,
  exampleDoc,
  fmt,
  loadDoc,
  planBounds,
  roomArea,
  sanitizeDoc,
  saveDoc,
  snap,
  totalArea,
  uid,
} from "@/lib/plano/store";
import type { PlanDoc, Selection } from "@/lib/plano/types";

type DragState =
  | { mode: "move-room"; id: string; ox: number; oy: number }
  | { mode: "move-piece"; id: string; ox: number; oy: number }
  | { mode: "resize-room"; id: string }
  | { mode: "draw"; sx: number; sy: number }
  | null;

const btn =
  "rounded border border-line bg-paper-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft transition hover:border-accent-bright hover:text-accent disabled:cursor-not-allowed disabled:opacity-40";
const btnPrimary =
  "rounded bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wide text-paper transition hover:bg-accent";
const field =
  "mt-1 w-full border border-line bg-paper px-2 py-1.5 text-sm text-ink focus:border-accent-bright focus:outline-none";

function toWorld(svg: SVGSVGElement, e: { clientX: number; clientY: number }) {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  return new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
}

function norm360(value: number): number {
  return ((value % 360) + 360) % 360;
}

/** Campo numérico que solo aplica el valor al salir o al pulsar Intro. */
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
  // Ajuste durante el render (patrón de React): si el valor externo cambia
  // —arrastre, giro del teclado— el campo se sincroniza sin effects.
  const [prevValue, setPrevValue] = useState(value);
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
          onChange={(event) => setRaw(event.target.value)}
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
  const [doc, setDoc] = useState<PlanDoc>(() => exampleDoc());
  const [selection, setSelection] = useState<Selection>(null);
  const [drawMode, setDrawMode] = useState(false);
  const [preview, setPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState>(null);

  /* Cargar proyecto guardado y autosguardado en el navegador. */
  const loadedRef = useRef(false);

  useEffect(() => {
    // La carga se pospone un tick: el HTML prerenderizado se hidrata primero
    // y, con el doble montaje de desarrollo, nunca se pisa lo ya guardado.
    const timer = window.setTimeout(() => {
      const stored = loadDoc();
      loadedRef.current = true;
      if (stored) setDoc(stored);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    saveDoc(doc);
  }, [doc]);

  /* Atajos de teclado (fuera de los campos de texto). */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "Escape") {
        setDrawMode(false);
        setPreview(null);
        setSelection(null);
        return;
      }

      if (!selection) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        setDoc((current) =>
          selection.kind === "room"
            ? { ...current, rooms: current.rooms.filter((room) => room.id !== selection.id) }
            : { ...current, pieces: current.pieces.filter((piece) => piece.id !== selection.id) },
        );
        setSelection(null);
        return;
      }

      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        const step = event.shiftKey ? 5 : 10;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        setDoc((current) => ({
          ...current,
          rooms: current.rooms.map((room) =>
            selection.kind === "room" && room.id === selection.id
              ? { ...room, x: room.x + dx, y: room.y + dy }
              : room,
          ),
          pieces: current.pieces.map((piece) =>
            selection.kind === "piece" && piece.id === selection.id
              ? { ...piece, x: piece.x + dx, y: piece.y + dy }
              : piece,
          ),
        }));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selection]);

  /* ---------- Interacción con el lienzo ---------- */

  function onShapePointerDown(kind: "room" | "piece", id: string, e: ReactPointerEvent) {
    if (drawMode) return; // en modo dibujo el gesto va al lienzo
    e.stopPropagation();
    setSelection({ kind, id });

    const svg = svgRef.current;
    if (!svg) return;
    const p = toWorld(svg, e);

    if (kind === "room") {
      const room = doc.rooms.find((item) => item.id === id);
      if (!room) return;
      dragRef.current = { mode: "move-room", id, ox: p.x - room.x, oy: p.y - room.y };
    } else {
      const piece = doc.pieces.find((item) => item.id === id);
      if (!piece) return;
      dragRef.current = { mode: "move-piece", id, ox: p.x - piece.x, oy: p.y - piece.y };
    }
    svg.setPointerCapture(e.pointerId);
  }

  function onHandlePointerDown(id: string, e: ReactPointerEvent) {
    if (drawMode) return;
    const svg = svgRef.current;
    if (!svg) return;
    dragRef.current = { mode: "resize-room", id };
    svg.setPointerCapture(e.pointerId);
  }

  function onCanvasPointerDown(e: ReactPointerEvent) {
    const svg = svgRef.current;
    if (!svg) return;

    if (drawMode) {
      const p = toWorld(svg, e);
      dragRef.current = { mode: "draw", sx: snap(p.x), sy: snap(p.y) };
      setPreview({ x: snap(p.x), y: snap(p.y), w: 0, h: 0 });
      svg.setPointerCapture(e.pointerId);
    } else {
      setSelection(null);
    }
  }

  function onCanvasPointerMove(e: ReactPointerEvent) {
    const drag = dragRef.current;
    const svg = svgRef.current;
    if (!drag || !svg) return;
    const p = toWorld(svg, e);

    if (drag.mode === "draw") {
      const x2 = snap(p.x);
      const y2 = snap(p.y);
      setPreview({
        x: Math.min(drag.sx, x2),
        y: Math.min(drag.sy, y2),
        w: Math.abs(x2 - drag.sx),
        h: Math.abs(y2 - drag.sy),
      });
      return;
    }

    if (drag.mode === "move-room") {
      const x = snap(p.x - drag.ox);
      const y = snap(p.y - drag.oy);
      setDoc((current) => ({
        ...current,
        rooms: current.rooms.map((room) => (room.id === drag.id ? { ...room, x, y } : room)),
      }));
    } else if (drag.mode === "move-piece") {
      const x = snap(p.x - drag.ox);
      const y = snap(p.y - drag.oy);
      setDoc((current) => ({
        ...current,
        pieces: current.pieces.map((piece) => (piece.id === drag.id ? { ...piece, x, y } : piece)),
      }));
    } else if (drag.mode === "resize-room") {
      setDoc((current) => ({
        ...current,
        rooms: current.rooms.map((room) =>
          room.id === drag.id
            ? {
                ...room,
                w: Math.max(40, snap(p.x - room.x)),
                h: Math.max(40, snap(p.y - room.y)),
              }
            : room,
        ),
      }));
    }
  }

  function onCanvasPointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;

    if (drag?.mode === "draw") {
      const rect = preview;
      if (rect && rect.w >= 60 && rect.h >= 60) {
        const id = uid();
        const created = rect;
        setDoc((current) => ({
          ...current,
          rooms: [
            ...current.rooms,
            {
              id,
              name: `Estancia ${current.rooms.length + 1}`,
              x: created.x,
              y: created.y,
              w: created.w,
              h: created.h,
            },
          ],
        }));
        setSelection({ kind: "room", id });
      }
      setPreview(null);
    }
  }

  /* ---------- Operaciones ---------- */

  function addRoom() {
    const id = uid();
    const bounds = planBounds(doc);
    const x = bounds ? bounds.x : 0;
    const y = bounds ? bounds.y + bounds.h + 80 : 0;
    setDoc((current) => ({
      ...current,
      rooms: [
        ...current.rooms,
        { id, name: `Estancia ${current.rooms.length + 1}`, x: snap(x), y: snap(y), w: 400, h: 350 },
      ],
    }));
    setSelection({ kind: "room", id });
    setMsg(null);
  }

  function addPiece(key: string) {
    const item = CAT_BY_KEY[key];
    if (!item) return;
    const id = uid();
    const bounds = planBounds(doc);
    const offset = (doc.pieces.length % 6) * 30;
    const x = snap((bounds ? bounds.x + bounds.w / 2 : 0) + offset - 80);
    const y = snap((bounds ? bounds.y + bounds.h / 2 : 0) + offset - 60);
    setDoc((current) => ({
      ...current,
      pieces: [...current.pieces, { id, key, x, y, w: item.w, h: item.h, rot: 0 }],
    }));
    setSelection({ kind: "piece", id });
    setMsg(null);
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
    updatePiece(id, { rot: norm360(piece.rot + delta) });
  }

  /* ---------- Descargas ---------- */

  function exportPdf() {
    setMsg(null);
    window.print();
  }

  function exportSvg() {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.querySelectorAll("[data-no-export]").forEach((node) => node.remove());
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const viewBox = clone.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      if (parts.length === 4) {
        clone.setAttribute("width", String(Math.round(parts[2])));
        clone.setAttribute("height", String(Math.round(parts[3])));
      }
    }
    const markup = new XMLSerializer().serializeToString(clone);
    downloadBlob(
      new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${markup}`], {
        type: "image/svg+xml;charset=utf-8",
      }),
      docFileName(doc, "svg"),
    );
    setMsg("Plano descargado en SVG (vectorial).");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    downloadBlob(blob, docFileName(doc, "json"));
    setMsg("Proyecto descargado en JSON: puedes volver a cargarlo con «Cargar proyecto».");
  }

  function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    file
      .text()
      .then((text) => {
        const parsed: unknown = JSON.parse(text);
        const clean = sanitizeDoc(parsed);
        if (clean.rooms.length === 0 && clean.pieces.length === 0 && !clean.title) {
          setMsg("El fichero no contiene un proyecto válido.");
          return;
        }
        setDoc(clean);
        setSelection(null);
        setMsg(`Proyecto «${clean.title}» cargado correctamente.`);
      })
      .catch(() => {
        setMsg("No se ha podido leer el fichero: asegúrate de que es un proyecto JSON.");
      });
  }

  /* ---------- Derivados para la interfaz ---------- */

  const selectedRoom =
    selection?.kind === "room"
      ? doc.rooms.find((room) => room.id === selection.id) ?? null
      : null;
  const selectedPiece =
    selection?.kind === "piece"
      ? doc.pieces.find((piece) => piece.id === selection.id) ?? null
      : null;
  const selectedCatalogItem = selectedPiece ? CAT_BY_KEY[selectedPiece.key] ?? null : null;

  return (
    <div>
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-2 border border-line bg-paper-2 p-3">
        <button
          type="button"
          onClick={() => {
            setDrawMode((value) => !value);
            setPreview(null);
          }}
          aria-pressed={drawMode}
          className={
            drawMode
              ? "rounded border border-accent-bright bg-accent-bright px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink"
              : btn
          }
        >
          {drawMode ? "Dibujando… (Esc sale)" : "Dibujar estancia"}
        </button>
        <button type="button" onClick={addRoom} className={btn}>
          Añadir estancia
        </button>

        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />

        <button type="button" onClick={duplicateSelection} disabled={!selection} className={btn}>
          Duplicar
        </button>
        <button type="button" onClick={deleteSelection} disabled={!selection} className={btn}>
          Eliminar
        </button>

        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />

        <button
          type="button"
          onClick={() => {
            if (window.confirm("¿Reemplazar el proyecto actual con el ejemplo?")) {
              setDoc(exampleDoc());
              setSelection(null);
            }
          }}
          className={btn}
        >
          Ejemplo
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("¿Vaciar todo el plano? Se perderán las estancias y piezas.")) {
              setDoc(emptyDoc());
              setSelection(null);
            }
          }}
          className={btn}
        >
          Vaciar
        </button>

        <span className="ml-auto flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportPdf} className={btnPrimary}>
            Descargar PDF
          </button>
          <button type="button" onClick={exportSvg} className={btn}>
            SVG
          </button>
          <button type="button" onClick={exportJson} className={btn}>
            Proyecto JSON
          </button>
          <label className={`${btn} cursor-pointer`}>
            Cargar proyecto
            <input
              type="file"
              accept="application/json,.json"
              onChange={importJson}
              className="sr-only"
            />
          </label>
        </span>
      </div>

      {msg && (
        <p role="status" className="mt-2 text-sm text-accent">
          {msg}
        </p>
      )}

      <p className="mt-2 text-xs leading-relaxed text-muted">
        «Descargar PDF» abre el diálogo de impresión: elige <strong>Guardar como PDF</strong>,
        tamaño <strong>A4 apaisado</strong> y escala <strong>100 %</strong>. El proyecto se guarda
        solo en tu navegador; nada se envía a ningún servidor.
      </p>

      {/* Tres columnas: catálogo · lienzo · propiedades */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_260px]">
        {/* Catálogo */}
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
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => addPiece(item.key)}
                      title={`${item.label} · ${item.w}×${item.h} cm`}
                      className="flex flex-col items-center gap-1 border border-line bg-paper px-1 py-2 text-[11px] leading-tight text-ink-soft transition hover:border-accent-bright hover:text-accent"
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
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        {/* Lienzo */}
        <div className="min-w-0">
          <div
            className="relative border border-line bg-white"
            style={{ height: "min(62vh, 580px)" }}
          >
            <PlanSvg
              doc={doc}
              selection={selection}
              interactive
              grid
              drawMode={drawMode}
              preview={preview}
              svgRef={svgRef}
              onShapePointerDown={onShapePointerDown}
              onHandlePointerDown={onHandlePointerDown}
              onCanvasPointerDown={onCanvasPointerDown}
              onCanvasPointerMove={onCanvasPointerMove}
              onCanvasPointerUp={onCanvasPointerUp}
            />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Arrastra estancias y piezas para colocarlas · la esquina naranja redimensiona la
            estancia · flechas del teclado mueven 10 cm (Shift: 5 cm) · <strong>Supr</strong>{" "}
            elimina · <strong>Esc</strong> deselecciona.
          </p>
        </div>

        {/* Propiedades y resumen */}
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
                onChange={(event) => setDoc((current) => ({ ...current, title: event.target.value }))}
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
                  onChange={(event) => updateRoom(selectedRoom.id, { name: event.target.value })}
                  className={field}
                />
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <NumInput
                  label="Ancho"
                  value={selectedRoom.w / 100}
                  suffix="m"
                  onCommit={(value) =>
                    updateRoom(selectedRoom.id, {
                      w: Math.min(5000, Math.max(40, Math.round(value * 10))),
                    })
                  }
                />
                <NumInput
                  label="Largo"
                  value={selectedRoom.h / 100}
                  suffix="m"
                  onCommit={(value) =>
                    updateRoom(selectedRoom.id, {
                      h: Math.min(5000, Math.max(40, Math.round(value * 10))),
                    })
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
              <p className="mt-2 text-sm font-semibold text-ink">{selectedCatalogItem.label}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <NumInput
                  label="Ancho"
                  value={selectedPiece.w}
                  suffix="cm"
                  onCommit={(value) =>
                    updatePiece(selectedPiece.id, {
                      w: Math.min(1000, Math.max(10, Math.round(value))),
                    })
                  }
                />
                <NumInput
                  label="Fondo"
                  value={selectedPiece.h}
                  suffix="cm"
                  onCommit={(value) =>
                    updatePiece(selectedPiece.id, {
                      h: Math.min(1000, Math.max(10, Math.round(value))),
                    })
                  }
                />
              </div>

              <label className="mt-3 block text-xs text-muted">
                Giro: {norm360(selectedPiece.rot)}°
                <input
                  type="range"
                  min={0}
                  max={345}
                  step={15}
                  value={norm360(selectedPiece.rot)}
                  onChange={(event) =>
                    updatePiece(selectedPiece.id, { rot: Number(event.target.value) })
                  }
                  className="mt-1 w-full accent-[#f6821f]"
                />
              </label>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => rotatePiece(selectedPiece.id, -15)}
                  className={btn}
                >
                  −15°
                </button>
                <button
                  type="button"
                  onClick={() => rotatePiece(selectedPiece.id, 15)}
                  className={btn}
                >
                  +15°
                </button>
                <button
                  type="button"
                  onClick={() => rotatePiece(selectedPiece.id, 90)}
                  className={btn}
                >
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

          {selection && !selectedRoom && !selectedPiece && (
            <p className="text-xs text-muted">La selección ya no existe.</p>
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
            <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
              Estancias
            </h2>
            <ul className="mt-2 space-y-1">
              {doc.rooms.map((room) => {
                const active =
                  selection?.kind === "room" && selection.id === room.id;
                return (
                  <li key={room.id}>
                    <button
                      type="button"
                      onClick={() => setSelection({ kind: "room", id: room.id })}
                      className={`flex w-full items-center justify-between gap-2 border px-2 py-1.5 text-left text-xs transition ${
                        active
                          ? "border-accent-bright bg-paper text-accent"
                          : "border-line bg-paper hover:border-accent-bright"
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

      {/* Hoja de impresión */}
      <section className="mt-10">
        <h2 className="text-xl">Hoja de impresión (A4 apaisado)</h2>
        <p className="mt-1 mb-3 text-xs text-muted">
          Así se verá el PDF: cotas, tabla de superficies, fecha y escala aproximada.
        </p>
        <PlanSheet doc={doc} />
      </section>
    </div>
  );
}
