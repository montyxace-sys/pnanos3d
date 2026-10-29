"use client";

import type { PointerEvent as ReactPointerEvent, Ref } from "react";
import { CAT_BY_KEY } from "@/lib/plano/catalog";
import { fmt, planBounds, roomArea } from "@/lib/plano/store";
import type { PlanDoc, Selection } from "@/lib/plano/types";

type ShapeHandler = (kind: "room" | "piece", id: string, e: ReactPointerEvent) => void;

type BoundsRect = { x: number; y: number; w: number; h: number };

interface PlanSvgProps {
  doc: PlanDoc;
  selection?: Selection;
  /** true en el editor: permite seleccionar, arrastrar y redimensionar. */
  interactive?: boolean;
  /** Rejilla de trabajo (solo pantalla; se omite al exportar). */
  grid?: boolean;
  /** Modo «dibujar estancia» activo. */
  drawMode?: boolean;
  /** Rectángulo en proceso de dibujo (estiramido del ratón). */
  preview?: BoundsRect | null;
  svgRef?: Ref<SVGSVGElement>;
  onShapePointerDown?: ShapeHandler;
  onHandlePointerDown?: (id: string, e: ReactPointerEvent) => void;
  onCanvasPointerDown?: (e: ReactPointerEvent) => void;
  onCanvasPointerMove?: (e: ReactPointerEvent) => void;
  onCanvasPointerUp?: (e: ReactPointerEvent) => void;
}

/**
 * Dibujo vectorial del plano, en centímetros. Lo usan tanto el editor
 * (interactivo) como la hoja A4 de la descarga en PDF (solo lectura).
 */
export default function PlanSvg({
  doc,
  selection,
  interactive = false,
  grid = false,
  drawMode = false,
  preview = null,
  svgRef,
  onShapePointerDown,
  onHandlePointerDown,
  onCanvasPointerDown,
  onCanvasPointerMove,
  onCanvasPointerUp,
}: PlanSvgProps) {
  const bounds = planBounds(doc);
  const PAD = 160;
  const box: BoundsRect = bounds
    ? { x: bounds.x - PAD, y: bounds.y - PAD, w: bounds.w + PAD * 2, h: bounds.h + PAD * 2 }
    : { x: -500, y: -400, w: 1000, h: 800 };

  const resizeTarget =
    interactive && selection?.kind === "room"
      ? doc.rooms.find((room) => room.id === selection.id) ?? null
      : null;

  const handleSize = 36;

  return (
    <svg
      ref={svgRef}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="block h-full w-full select-none"
      style={{
        touchAction: "none",
        cursor: drawMode ? "crosshair" : interactive ? "default" : undefined,
        fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif',
      }}
      onPointerDown={onCanvasPointerDown}
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
      onPointerCancel={onCanvasPointerUp}
      role="img"
      aria-label={doc.title ? `Plano: ${doc.title}` : "Plano de vivienda"}
    >
      {/* Rejilla: 0,5 m fina y 2 m marcada */}
      {grid && (
        <>
          <defs>
            <pattern id="plan-grid" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M0 50H200M0 100H200M0 150H200M50 0V200M100 0V200M150 0V200"
                fill="none"
                stroke="#eceae4"
                strokeWidth="2"
              />
              <path d="M0 0H200V200H0Z" fill="none" stroke="#ded8cb" strokeWidth="2.5" />
            </pattern>
          </defs>
          <rect
            data-no-export="true"
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            fill="url(#plan-grid)"
          />
        </>
      )}

      {/* Estancias */}
      {doc.rooms.map((room) => {
        const selected = selection?.kind === "room" && selection.id === room.id;
        const fs = Math.max(14, Math.min(40, Math.min(room.w, room.h) * 0.15));
        const fitsText = room.w > fs * 3 && room.h > fs * 3;
        const cx = room.x + room.w / 2;
        const cy = room.y + room.h / 2;
        const showSub = room.w > 270 && room.h > 200;

        return (
          <g
            key={room.id}
            onPointerDown={
              interactive && onShapePointerDown
                ? (e) => onShapePointerDown("room", room.id, e)
                : undefined
            }
            style={{ cursor: interactive ? "move" : undefined }}
          >
            <rect
              x={room.x}
              y={room.y}
              width={room.w}
              height={room.h}
              fill={selected ? "#fdf3e7" : "#f4f1ea"}
              stroke={selected ? "#f6821f" : "#1c1f24"}
              strokeWidth={selected ? 10 : 8}
            />
            {fitsText && (
              <>
                <text
                  x={cx}
                  y={showSub ? cy - fs * 0.25 : cy + fs * 0.35}
                  fontSize={fs}
                  fontWeight={600}
                  textAnchor="middle"
                  fill="#1c1f24"
                  pointerEvents="none"
                >
                  {room.name}
                </text>
                {showSub && (
                  <text
                    x={cx}
                    y={cy + fs * 1.1}
                    fontSize={fs * 0.68}
                    textAnchor="middle"
                    fill="#6b675f"
                    pointerEvents="none"
                  >
                    {fmt(room.w / 100)} × {fmt(room.h / 100)} m · {fmt(roomArea(room))} m²
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}

      {/* Piezas: mobiliario y construcción */}
      {doc.pieces.map((piece) => {
        const item = CAT_BY_KEY[piece.key];
        if (!item) return null;
        const selected = selection?.kind === "piece" && selection.id === piece.id;
        const sx = piece.w / item.w;
        const sy = piece.h / item.h;

        return (
          <g
            key={piece.id}
            transform={`translate(${piece.x} ${piece.y}) rotate(${piece.rot})`}
            onPointerDown={
              interactive && onShapePointerDown
                ? (e) => onShapePointerDown("piece", piece.id, e)
                : undefined
            }
            style={{ cursor: interactive ? "grab" : undefined }}
          >
            {/* Zona de clic mayor que el dibujo */}
            <rect
              x={-piece.w / 2}
              y={-piece.h / 2}
              width={piece.w}
              height={piece.h}
              fill="transparent"
            />
            <g
              transform={`scale(${sx} ${sy})`}
              fill="#faf9f7"
              stroke="#1c1f24"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              pointerEvents="none"
            >
              {item.draw()}
            </g>
            {selected && (
              <>
                <rect
                  x={-piece.w / 2 - 10}
                  y={-piece.h / 2 - 10}
                  width={piece.w + 20}
                  height={piece.h + 20}
                  fill="none"
                  stroke="#f6821f"
                  strokeWidth={4}
                  strokeDasharray="16 12"
                  pointerEvents="none"
                />
                <text
                  y={piece.h / 2 + 34}
                  fontSize={24}
                  textAnchor="middle"
                  fill="#c2410c"
                  fontWeight={600}
                  pointerEvents="none"
                >
                  {item.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Rectángulo en curso (modo dibujar) */}
      {preview && preview.w > 0 && preview.h > 0 && (
        <rect
          x={preview.x}
          y={preview.y}
          width={preview.w}
          height={preview.h}
          fill="#f6821f"
          fillOpacity={0.08}
          stroke="#f6821f"
          strokeWidth={4}
          strokeDasharray="18 12"
          pointerEvents="none"
        />
      )}

      {/* Cotas generales */}
      {bounds && (
        <g pointerEvents="none">
          <g fill="none" stroke="#6b675f" strokeWidth={2.5}>
            <path d={`M${bounds.x} ${bounds.y - 70} H${bounds.x + bounds.w}`} />
            <path d={`M${bounds.x} ${bounds.y - 85} V${bounds.y - 55}`} />
            <path d={`M${bounds.x + bounds.w} ${bounds.y - 85} V${bounds.y - 55}`} />
            <path d={`M${bounds.x - 70} ${bounds.y} V${bounds.y + bounds.h}`} />
            <path d={`M${bounds.x - 85} ${bounds.y} H${bounds.x - 55}`} />
            <path d={`M${bounds.x - 85} ${bounds.y + bounds.h} H${bounds.x - 55}`} />
          </g>
          <text
            x={bounds.x + bounds.w / 2}
            y={bounds.y - 88}
            fontSize={30}
            fontWeight={600}
            textAnchor="middle"
            fill="#4a4741"
            stroke="#ffffff"
            strokeWidth={8}
            style={{ paintOrder: "stroke" }}
          >
            {fmt(bounds.w / 100)} m
          </text>
          <text
            x={bounds.x - 88}
            y={bounds.y + bounds.h / 2}
            fontSize={30}
            fontWeight={600}
            textAnchor="middle"
            fill="#4a4741"
            stroke="#ffffff"
            strokeWidth={8}
            transform={`rotate(-90 ${bounds.x - 88} ${bounds.y + bounds.h / 2})`}
            style={{ paintOrder: "stroke" }}
          >
            {fmt(bounds.h / 100)} m
          </text>
        </g>
      )}

      {/* Tirador de redimensionar la estancia seleccionada */}
      {resizeTarget && onHandlePointerDown && (
        <rect
          x={resizeTarget.x + resizeTarget.w - handleSize / 2}
          y={resizeTarget.y + resizeTarget.h - handleSize / 2}
          width={handleSize}
          height={handleSize}
          fill="#f6821f"
          stroke="#ffffff"
          strokeWidth={4}
          style={{ cursor: "nwse-resize" }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onHandlePointerDown(resizeTarget.id, e);
          }}
        />
      )}
    </svg>
  );
}
