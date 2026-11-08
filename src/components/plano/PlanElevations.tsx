"use client";

import { useEffect, useState } from "react";
import { loadDoc } from "@/lib/plano/store";
import type { PlanDoc } from "@/lib/plano/types";

type Dir = "Norte" | "Sur" | "Oeste" | "Este";
const WALL_H = 260;
const SCALE_LABEL = (v: number) => `${(v / 100).toFixed(2).replace(".", ",")} m`;

function openingXY(p: { x: number; y: number; w: number; h: number; key: string }) {
  return { xCm: p.x, yCm: p.y, wCm: p.w, hCm: p.h, key: p.key };
}

function overlaps(a: any, b: any) { return !(a.x + a.w < b.x || a.x > b.x + b.w); }

function wallsForDir(doc: PlanDoc, dir: Dir) {
  const walls: Array<{ x: number; y: number; w: number; z?: number }> = [];
  const openings: Array<{ x0: number; y0: number; w: number; h: number; type: "puerta" | "ventana" }> = [];
  for (const room of doc.rooms) {
    if (dir === "Norte") {
      walls.push({ x: room.x, y: room.y, w: room.w });
      doc.pieces.filter((p) => p.key === "puerta" || p.key === "ventana").forEach((p) => {
        if (Math.abs(p.y - room.y) < 25 && p.x >= room.x && p.x <= room.x + room.w) {
          openings.push({ x0: p.x - p.w / 2, y0: p.key === "puerta" ? 0 : 80, w: p.w, h: p.key === "puerta" ? 210 : 70, type: p.key as any });
        }
      });
    } else if (dir === "Sur") {
      walls.push({ x: room.x, y: room.y + room.h, w: room.w });
      doc.pieces.filter((p) => p.key === "puerta" || p.key === "ventana").forEach((p) => {
        if (Math.abs(p.y - (room.y + room.h)) < 25 && p.x >= room.x && p.x <= room.x + room.w) {
          openings.push({ x0: p.x - p.w / 2, y0: p.key === "puerta" ? 0 : 80, w: p.w, h: p.key === "puerta" ? 210 : 70, type: p.key as any });
        }
      });
    } else if (dir === "Oeste") {
      walls.push({ x: room.y, y: room.x, w: room.h });
      doc.pieces.filter((p) => p.key === "puerta" || p.key === "ventana").forEach((p) => {
        if (Math.abs(p.x - room.x) < 25 && p.y >= room.y && p.y <= room.y + room.h) {
          openings.push({ x0: p.y - p.h / 2, y0: p.key === "puerta" ? 0 : 80, w: p.h, h: p.key === "puerta" ? 210 : 70, type: p.key as any });
        }
      });
    } else {
      walls.push({ x: room.y, y: room.x + room.w, w: room.h });
      doc.pieces.filter((p) => p.key === "puerta" || p.key === "ventana").forEach((p) => {
        if (Math.abs(p.x - (room.x + room.w)) < 25 && p.y >= room.y && p.y <= room.y + room.h) {
          openings.push({ x0: p.y - p.h / 2, y0: p.key === "puerta" ? 0 : 80, w: p.h, h: p.key === "puerta" ? 210 : 70, type: p.key as any });
        }
      });
    }
  }
  // remove duplicate openings at same coordinate
  const seen = new Set<string>();
  const clean = openings.filter((o) => {
    const k = `${Math.round(o.x0)}_${o.w}_${o.type}`;
    if (seen.has(k)) return false; seen.add(k); return true;
  });
  return { walls, openings: clean };
}

export default function PlanElevations({ doc }: { doc: any }) {
  if (!doc.rooms || doc.rooms.length === 0) {
    return <div className="p-6 text-muted">No hay estancias que dibujar.</div>;
  }
  const dirs: Dir[] = ["Norte", "Sur", "Oeste", "Este"];
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {dirs.map((dir) => {
        const { walls, openings } = wallsForDir(doc, dir);
        const xs = walls.map((w) => w.x);
        const xe = walls.map((w) => w.x + w.w);
        const minX = Math.min(...xs, ...openings.map((o) => o.x0));
        const maxX = Math.max(...xe, ...openings.map((o) => o.x0 + o.w));
        const min = Math.max(0, Math.round(minX - 40));
        const max = Math.max(100, Math.round(maxX + 40));
        const width = max - min;
        const ground = 0, top = -WALL_H - 50;
        const mid = (min + max) / 2;
        return (
          <div key={dir} className="rounded-xl border border-line bg-paper p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-paper-2 px-2 py-1 text-xs font-bold uppercase">{dir}</span>
              <span className="text-xs text-muted">{SCALE_LABEL(max - min)} aproximados de ancho de fachada</span>
            </div>
            <svg viewBox={`${min} ${top} ${width} ${WALL_H + 90}`} className="h-72 w-full bg-[#f4f1ea]">
              <defs>
                <pattern id={`grid-${dir}`} width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ded8cb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect x={min} y={top} width={width} height={WALL_H + 90} fill={`url(#grid-${dir})`} />
              {/* ground */}
              <path d={`M ${min} 0 H ${max}`} stroke="#1c1f24" strokeWidth={2} />
              {/* walls */}
              {walls.map((w, i) => (
                <rect key={`${dir}-${i}`} x={w.x} y={-WALL_H} width={Math.max(0, w.w)} height={WALL_H} fill="#e8e5dd" stroke="#7a7366" strokeWidth={2} />
              ))}
              {/* roof hints */}
              <polygon points={`${min},-WALL_H ${mid},${-(WALL_H + 32)} ${max},-WALL_H`} fill="#9e3e22" opacity={0.78} stroke="#7f2f19" strokeWidth={1} />
              {/* openings */}
              {openings.map((o, i) => (
                <g key={`${dir}-op-${i}`}>
                  <rect x={o.x0} y={-o.y0 - o.h} width={o.w} height={o.h} fill={o.type === "puerta" ? "#f5f0e6" : "#dcecf8"} stroke="#374151" strokeWidth={1} />
                  {o.type === "ventana" ? (
                    <>
                      <line x1={o.x0 + 2} y1={-o.y0 - o.h + o.h / 2} x2={o.x0 + o.w - 2} y2={-o.y0 - o.h + o.h / 2} stroke="#374151" strokeWidth={0.8} />
                      <line x1={o.x0 + o.w / 2} y1={-o.y0 - o.h + 2} x2={o.x0 + o.w / 2} y2={-o.y0 - 2} stroke="#374151" strokeWidth={0.8} />
                    </>
                  ) : (
                    <line x1={o.x0 + o.w / 2} y1={-o.y0 - o.h + 4} x2={o.x0 + o.w / 2} y2={-o.y0 - 4} stroke="#7a7366" strokeWidth={1} />
                  )}
                </g>
              ))}
              <text x={min + 4} y={-WALL_H - 8} fontSize={12} fill="#4a4741">{dir} · alto ~{Math.round(WALL_H / 100)} m</text>
            </svg>
          </div>
        );
      })}
    </div>
  );
}