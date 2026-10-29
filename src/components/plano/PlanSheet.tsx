"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import PlanSvg from "./PlanSvg";
import { withBase } from "@/lib/base";
import { fmt, planBounds, roomArea, totalArea } from "@/lib/plano/store";
import type { PlanDoc } from "@/lib/plano/types";

/** Lienzo A4 apaisado en milímetros. */
const SHEET_W = 297;
const SHEET_H = 210;
/** Caja de dibujo dentro de la hoja (mm). */
const DRAW_W = 217;
const DRAW_H = 159;
const ASIDE_W = 52;
const PX_PER_MM = 96 / 25.4;

const emptySubscribe = () => () => {};
const clientMounted = () => true;
const serverNotMounted = () => false;

let cachedToday = "";
function clientToday() {
  if (!cachedToday) cachedToday = new Date().toLocaleDateString("es-ES");
  return cachedToday;
}
function serverToday() {
  return "";
}

/**
 * Vista previa y hoja de impresión del proyecto (A4 apaisado).
 * En pantalla se muestra a escala reducida; al imprimir, el portal
 * `#print-root` es lo único visible (ver @media print en globals.css).
 */
export default function PlanSheet({ doc }: { doc: PlanDoc }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  // Store externo inmutable: evita setState síncrono dentro de effects.
  const mounted = useSyncExternalStore(emptySubscribe, clientMounted, serverNotMounted);
  const today = useSyncExternalStore(emptySubscribe, clientToday, serverToday);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // ResizeObserver avisa también en el primer observado (valor inicial).
    const observer = new ResizeObserver(() =>
      setPreviewScale(el.clientWidth / (SHEET_W * PX_PER_MM)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const bounds = planBounds(doc);
  // Escala real del dibujo: factor mm de papel por mm real.
  let scaleLabel = "—";
  if (bounds && bounds.w > 0 && bounds.h > 0) {
    const factor = Math.min(DRAW_W / (bounds.w * 10), DRAW_H / (bounds.h * 10));
    if (factor > 0) {
      const denominator = Math.max(1, Math.round(1 / factor));
      scaleLabel = `≈1:${denominator}`;
    }
  }

  const sheet = (
    <div
      style={{
        width: `${SHEET_W}mm`,
        height: `${SHEET_H}mm`,
        background: "#ffffff",
        color: "#1c1f24",
        position: "relative",
        boxSizing: "border-box",
        fontFamily: '"Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Marco de la hoja */}
      <div
        style={{ position: "absolute", inset: "6mm", border: "0.5mm solid #1c1f24" }}
        aria-hidden
      />

      <div
        style={{
          position: "absolute",
          inset: "6mm",
          padding: "5mm",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        {/* Cabecera: logotipo, título y datos */}
        <header
          style={{
            height: "14mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "6mm",
            borderBottom: "0.4mm solid #1c1f24",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBase("/img/logo.svg")}
            alt="TusPlanos3D"
            style={{ height: "9mm", width: "auto" }}
          />
          <div style={{ textAlign: "right", minWidth: 0 }}>
            <div
              style={{
                fontSize: "13pt",
                fontWeight: 700,
                lineHeight: 1.15,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {doc.title || "Plano de vivienda"}
            </div>
            <div style={{ fontSize: "7.5pt", color: "#4a4741" }}>
              Fecha: {today || "—"} · Escala {scaleLabel} · {doc.rooms.length} estancias ·{" "}
              {fmt(totalArea(doc))} m²
            </div>
          </div>
        </header>

        {/* Cuerpo: dibujo + tabla de superficies */}
        <div style={{ flex: 1, display: "flex", gap: "5mm", padding: "4mm 0", minHeight: 0 }}>
          <div
            style={{
              width: `${DRAW_W}mm`,
              height: `${DRAW_H}mm`,
              flexShrink: 0,
              border: "0.3mm solid #e3ded4",
              overflow: "hidden",
            }}
          >
            {bounds ? (
              <PlanSvg doc={doc} />
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b675f",
                  fontSize: "9pt",
                  textAlign: "center",
                  padding: "10mm",
                }}
              >
                Sin estancias todavía: dibuja la primera estancia en el editor para verla aquí.
              </div>
            )}
          </div>

          <aside
            style={{
              width: `${ASIDE_W}mm`,
              flexShrink: 1,
              minWidth: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: "2.5mm",
              fontSize: "7pt",
            }}
          >
            <div style={{ fontSize: "7.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Estancias
            </div>
            {doc.rooms.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "0.3mm solid #1c1f24" }}>
                    <th align="left" style={{ fontWeight: 600, padding: "0.8mm 0" }}>
                      Estancia
                    </th>
                    <th align="right" style={{ fontWeight: 600, padding: "0.8mm 0" }}>
                      m
                    </th>
                    <th align="right" style={{ fontWeight: 600, padding: "0.8mm 0" }}>
                      m²
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doc.rooms.map((room) => (
                    <tr key={room.id} style={{ borderBottom: "0.2mm solid #e3ded4" }}>
                      <td
                        style={{
                          padding: "0.8mm 0",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "24mm",
                        }}
                      >
                        {room.name}
                      </td>
                      <td align="right" style={{ padding: "0.8mm 0", whiteSpace: "nowrap" }}>
                        {fmt(room.w / 100)}×{fmt(room.h / 100)}
                      </td>
                      <td align="right" style={{ padding: "0.8mm 0", whiteSpace: "nowrap" }}>
                        {fmt(roomArea(room))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "0.4mm solid #1c1f24", fontWeight: 700 }}>
                    <td style={{ padding: "1mm 0" }}>Total</td>
                    <td />
                    <td align="right" style={{ padding: "1mm 0" }}>
                      {fmt(totalArea(doc))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p style={{ color: "#6b675f" }}>Sin estancias.</p>
            )}

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1.5mm" }}>
              <div>
                <strong>Piezas:</strong> {doc.pieces.length}
              </div>
              <div>
                <strong>Escala:</strong> {scaleLabel}
              </div>
              <p style={{ fontSize: "6.3pt", lineHeight: 1.35, color: "#6b675f", margin: 0 }}>
                Esquema general con fines informativos: no sustituye planos técnicos, mediciones
                ni memorias de obra. Para conservar la escala al imprimir, elige A4 apaisado al
                100 % (sin «ajustar a la página»).
              </p>
            </div>
          </aside>
        </div>

        {/* Pie */}
        <footer
          style={{
            height: "7mm",
            borderTop: "0.3mm solid #e3ded4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "7pt",
            color: "#6b675f",
            flexShrink: 0,
          }}
        >
          <span>TusPlanos3D · Herramienta gratuita de planos</span>
          <span>Plano descargable en PDF y JSON desde la web</span>
        </footer>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden border border-line bg-white"
        style={{ aspectRatio: `${SHEET_W} / ${SHEET_H}` }}
        aria-label="Vista previa de la hoja de impresión"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${SHEET_W}mm`,
            height: `${SHEET_H}mm`,
            transformOrigin: "top left",
            transform: `scale(${previewScale})`,
          }}
        >
          {sheet}
        </div>
      </div>

      {/* Copia fuera de pantalla para el diálogo de impresión (PDF) */}
      {mounted &&
        createPortal(
          <div id="print-root" aria-hidden>
            {sheet}
          </div>,
          document.body,
        )}
    </>
  );
}
