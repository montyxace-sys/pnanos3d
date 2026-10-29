import { CAT_BY_KEY } from "./catalog";
import type { Bounds, Piece, PlanDoc, Room } from "./types";

/** Rejilla de trabajo: 10 cm. */
export const STEP = 10;

/** Persistencia del proyecto en el navegador. */
export const STORAGE_KEY = "tusplanos3d:plano:v1";

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function snap(value: number, step: number = STEP): number {
  return Math.round(value / step) * step;
}

/** Formato español: dos decimales con coma (4,00). */
export function fmt(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace(".", ",");
}

export function roomArea(room: Room): number {
  return (room.w * room.h) / 10000;
}

export function totalArea(doc: PlanDoc): number {
  return doc.rooms.reduce((sum, room) => sum + roomArea(room), 0);
}

/** Envolvente de todo el plano (estancias + piezas rotadas), en cm. */
export function planBounds(doc: PlanDoc): Bounds | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const include = (x1: number, y1: number, x2: number, y2: number) => {
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);
  };

  for (const room of doc.rooms) {
    include(room.x, room.y, room.x + room.w, room.y + room.h);
  }

  for (const piece of doc.pieces) {
    const rad = (piece.rot * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const halfW = (piece.w / 2) * cos + (piece.h / 2) * sin;
    const halfH = (piece.w / 2) * sin + (piece.h / 2) * cos;
    include(piece.x - halfW, piece.y - halfH, piece.x + halfW, piece.y + halfH);
  }

  if (!Number.isFinite(minX)) return null;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/** Proyecto de ejemplo con el que arranca la herramienta. */
export function exampleDoc(): PlanDoc {
  return {
    title: "Vivienda de ejemplo",
    rooms: [
      { id: uid(), name: "Salón", x: 0, y: 0, w: 420, h: 350 },
      { id: uid(), name: "Dormitorio", x: 420, y: 0, w: 330, h: 350 },
      { id: uid(), name: "Cocina", x: 0, y: 350, w: 330, h: 260 },
      { id: uid(), name: "Baño", x: 330, y: 350, w: 180, h: 260 },
      { id: uid(), name: "Pasillo", x: 510, y: 350, w: 240, h: 260 },
    ],
    pieces: [
      { id: uid(), key: "sofa3", x: 210, y: 60, w: 210, h: 90, rot: 0 },
      { id: uid(), key: "tv", x: 210, y: 320, w: 140, h: 25, rot: 0 },
      { id: uid(), key: "mesa4", x: 300, y: 240, w: 120, h: 80, rot: 0 },
      { id: uid(), key: "cama150", x: 585, y: 150, w: 150, h: 200, rot: 0 },
      { id: uid(), key: "armario", x: 585, y: 320, w: 180, h: 60, rot: 0 },
      { id: uid(), key: "encimera", x: 100, y: 390, w: 180, h: 60, rot: 0 },
      { id: uid(), key: "fregadero", x: 240, y: 390, w: 60, h: 55, rot: 0 },
      { id: uid(), key: "inodoro", x: 420, y: 400, w: 40, h: 70, rot: 0 },
      { id: uid(), key: "lavabo", x: 420, y: 570, w: 55, h: 45, rot: 0 },
      { id: uid(), key: "puerta", x: 570, y: 355, w: 90, h: 90, rot: 0 },
    ],
  };
}

export function emptyDoc(): PlanDoc {
  return { title: "Mi vivienda", rooms: [], pieces: [] };
}

export function isValidDoc(value: unknown): value is PlanDoc {
  if (typeof value !== "object" || value === null) return false;
  const doc = value as Record<string, unknown>;
  return Array.isArray(doc.rooms) && Array.isArray(doc.pieces);
}

function num(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function str(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

/**
 * Normaliza un proyecto leído de un fichero JSON: descarta entradas
 * corruptas y repara los campos ausentes con valores seguros.
 */
export function sanitizeDoc(value: unknown): PlanDoc {
  const raw = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;

  const rooms: Room[] = [];
  for (const entry of Array.isArray(raw.rooms) ? raw.rooms : []) {
    const r = (typeof entry === "object" && entry !== null ? entry : {}) as Record<string, unknown>;
    const x = num(r.x);
    const y = num(r.y);
    const w = num(r.w);
    const h = num(r.h);
    if (x === null || y === null || w === null || h === null || w <= 0 || h <= 0) continue;
    const name = str(r.name)?.trim();
    rooms.push({
      id: str(r.id) ?? uid(),
      name: name ? name.slice(0, 60) : `Estancia ${rooms.length + 1}`,
      x,
      y,
      w,
      h,
    });
  }

  const pieces: Piece[] = [];
  for (const entry of Array.isArray(raw.pieces) ? raw.pieces : []) {
    const p = (typeof entry === "object" && entry !== null ? entry : {}) as Record<string, unknown>;
    const key = str(p.key);
    if (!key || !CAT_BY_KEY[key]) continue;
    const x = num(p.x);
    const y = num(p.y);
    if (x === null || y === null) continue;
    const base = CAT_BY_KEY[key];
    const w = num(p.w);
    const h = num(p.h);
    pieces.push({
      id: str(p.id) ?? uid(),
      key,
      x,
      y,
      w: w !== null && w > 0 ? w : base.w,
      h: h !== null && h > 0 ? h : base.h,
      rot: num(p.rot) ?? 0,
    });
  }

  return {
    title: str(raw.title)?.trim().slice(0, 80) || "Mi vivienda",
    rooms,
    pieces,
  };
}

export function loadDoc(): PlanDoc | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidDoc(parsed)) return null;
    return sanitizeDoc(parsed);
  } catch {
    return null;
  }
}

export function saveDoc(doc: PlanDoc): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch {
    // Almacenamiento no disponible: la sesión sigue funcionando sin guardar.
  }
}

/** Nombre de fichero seguro derivado del título del proyecto. */
export function docFileName(doc: PlanDoc, extension: string): string {
  const slug =
    doc.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "plano";
  return `${slug}.${extension}`;
}

/** Descarga un Blob en el navegador. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
