"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STANDARD_AIR = [2000, 2500, 3500, 4500, 5000, 7000, 9000, 12000, 14000, 18000];

function recommendUnit(w: number) {
  return STANDARD_AIR.find((v) => v >= w) ?? STANDARD_AIR[STANDARD_AIR.length - 1];
}

export default function ClimatizacionPage() {
  const [m2, setM2] = useState(80);
  const [exposure, setExposure] = useState<"sombra" | "normal" | "sol">("normal");
  const [occupants, setOccupants] = useState(3);
  const [appliances, setAppliances] = useState(1);
  const [thermostat, setThermostat] = useState<"ninguno" | "basico" | "programable" | "inteligente">("basico");
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    const base = window.location.pathname.startsWith("/pnanos3d") ? "/pnanos3d" : "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogoSrc(`${base}/img/logo.svg`.replace(/\/\//g, "/"));
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tusplanos3d:plano:v1");
      if (!raw) return;
      const doc = JSON.parse(raw) as { rooms?: { w: number; h: number }[] };
      const area = (doc.rooms ?? []).reduce((s, r) => s + r.w * r.h, 0) / 10000;
      if (area > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setM2(Math.round(area));
      }
    } catch {
      // ignore
    }
  }, []);

  const result = useMemo(() => {
    const factor = exposure === "sol" ? 1.2 : exposure === "sombra" ? 0.9 : 1;
    const cooling = Math.round(m2 * 100 * factor + occupants * 100 + appliances * 300);
    const heating = Math.round(m2 * 80 * factor);
    const unit = recommendUnit(cooling);
    const btu = Math.round(cooling * 3.412);
    // Regla rapida: 130 frigorias por m2 util
    const frigorias = Math.round(m2 * 130);
    const frigUnit = recommendUnit(Math.round(frigorias * 0.293)); // 1 frig ~ 0.293 W aprox
    const kcal = frigorias; // 1 frig ~ 1 kcal/h aprox
    const coolingKcal = Math.round(cooling * 0.859845); // W -> kcal/h
    return { cooling, heating, unit, btu, frigorias, kcal, coolingKcal, frigUnit };
  }, [m2, exposure, occupants, appliances]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 text-ink">
      <div className="mb-6 flex items-center gap-3">
        {logoSrc && <Link href="/"><img src={logoSrc} alt="TusPlanos3D - inicio" width={140} height={40} className="h-9 w-auto" title="Ir al inicio" /></Link>}
        <span className="text-xs font-semibold tracking-[0.16em] text-muted uppercase">Generador + calculadoras</span>
      </div>
      <h1 className="text-3xl font-bold text-ink">Calculadora de climatizacion y frigorias</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Dimensiona la potencia de climatizacion recomendada segun superficie y condiciones.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-paper p-5">
          <h2 className="text-lg font-semibold mb-3">Datos de la vivienda</h2>
          <label className="block text-sm mb-1">Superficie (m2)</label>
          <input type="number" min={10} value={m2} onChange={(e) => setM2(Math.max(10, Number(e.target.value) || 10))}
                 className="w-full rounded border border-line bg-paper-2 px-2 py-1.5 mb-3"/>
          <label className="block text-sm mb-1">Exposicion solar</label>
          <select value={exposure} onChange={(e) => setExposure(e.target.value as "sombra" | "normal" | "sol")}
                  className="w-full rounded border border-line bg-paper-2 px-2 py-1.5 mb-3">
            <option value="sombra">Sombra / orientacion norte</option>
            <option value="normal">Normal / mixta</option>
            <option value="sol">Sol directo / mucho cerramiento</option>
          </select>
          <label className="block text-sm mb-1">Personas habituales</label>
          <input type="number" min={1} value={occupants} onChange={(e) => setOccupants(Math.max(1, Number(e.target.value) || 1))}
                 className="w-full rounded border border-line bg-paper-2 px-2 py-1.5 mb-3"/>
          <label className="block text-sm mb-1">Equipos electricos adicionales</label>
          <input type="number" min={0} value={appliances} onChange={(e) => setAppliances(Math.max(0, Number(e.target.value) || 0))}
                 className="w-full rounded border border-line bg-paper-2 px-2 py-1.5 mb-3"/>
          <p className="text-xs text-muted">Cocina, PCs, iluminacion extra, etc.</p>


          <label className="block text-sm mb-1">Accionamiento del equipo</label>
          <select value={thermostat} onChange={(e) => setThermostat(e.target.value as "ninguno" | "basico" | "programable" | "inteligente")} className="w-full rounded border border-line bg-paper-2 px-2 py-1.5 mb-3">
            <option value="ninguno">Sin termostato / manual</option>
            <option value="basico">Termostato basico (ON/OFF)</option>
            <option value="programable">Termostato programable</option>
            <option value="inteligente">Termostato inteligente / app</option>
          </select>
          <p className="text-xs text-muted">
            El termostato no altera el dimensionado: aporta confort y ahorro. El aislamiento solar y ocupantes siguen
            dominando la potencia de {result.unit} W recomendada.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-paper p-5">
          <h2 className="text-lg font-semibold mb-3">Recomendacion</h2>
          <div className="rounded-lg bg-paper-2 p-4 border border-line">
            <div className="text-sm text-ink-soft">Potencia de refrigeracion</div>
            <div className="text-2xl font-bold">{(result.cooling / 1000).toFixed(2)} kW</div>
            <div className="text-sm text-ink-soft mt-2">Potencia de calefaccion</div>
            <div className="text-2xl font-bold">{(result.heating / 1000).toFixed(2)} kW</div>
            <div className="text-sm text-ink-soft mt-2">Equivalente</div>
            <div className="text-xl font-bold text-orange-600">{result.btu} BTU (aprox.)</div>
            <div className="mt-4 text-lg font-semibold text-orange-600">
              Unidad recomendada: {result.unit} W
            </div>
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-sm font-semibold text-emerald-700">Regla rapida (130 frig/m2)</div>
              <div className="text-2xl font-bold text-emerald-700">{result.frigorias.toLocaleString("es-ES")} frig/h</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-ink-soft">
                <div>
                  <span className="block font-semibold">Frigorías</span>
                  {result.frigorias.toLocaleString("es-ES")} frig/h
                </div>
                <div>
                  <span className="block font-semibold">kcal/h</span>
                  {result.coolingKcal.toLocaleString("es-ES")} kcal/h potencia · {result.kcal.toLocaleString("es-ES")} kcal/h regla
                </div>
              </div>
              <p className="text-xs text-ink-soft mt-2">
                Potencia frigorífica (kW): {(result.cooling / 1000).toFixed(2)} kW; unidad orientativa: {result.frigUnit} W.
              </p>
              <p className="text-xs text-ink-soft mt-2">
                ¿Necesitas instalación profesional? Pide presupuesto en{" "}
                <a href="https://climont.es/" target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-600 hover:text-orange-700 underline">
                  climont.es
                </a>
                .
              </p>
            </div>
            <p className="text-xs text-muted mt-2">
              Regla orientativa: 100 W/m2 base + ocupantes + equipos + factor solar.
            </p>
            <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-3">
              <p className="text-sm font-semibold text-orange-700">
                ¿Necesitas instalación profesional?
              </p>
              <p className="text-xs text-ink-soft mt-1">
                Envía tu proyecto a climont.es y recibe un presupuesto real de instalación.
              </p>
              <a
                href="https://climont.es/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex rounded bg-orange-500 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-orange-400"
              >
                Pedir presupuesto (climont.es)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
