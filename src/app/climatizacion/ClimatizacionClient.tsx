"use client";

import { useEffect, useMemo, useState } from "react";

const STANDARD_AIR = [2000, 2500, 3500, 4500, 5000, 7000, 9000, 12000, 14000, 18000];

function recommendUnit(w: number) {
  return STANDARD_AIR.find((v) => v >= w) ?? STANDARD_AIR[STANDARD_AIR.length - 1];
}

export default function ClimatizacionPage() {
  const [m2, setM2] = useState(80);
  const [exposure, setExposure] = useState<"sombra" | "normal" | "sol">("normal");
  const [occupants, setOccupants] = useState(3);
  const [appliances, setAppliances] = useState(1);

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
    return { cooling, heating, unit, btu };
  }, [m2, exposure, occupants, appliances]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Climatizacion minima</h1>
      <p className="mt-2 text-sm text-gray-300">
        Dimensiona la potencia de climatizacion recomendada segun superficie y condiciones.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
          <h2 className="text-lg font-semibold mb-3">Datos de la vivienda</h2>
          <label className="block text-sm mb-1">Superficie (m2)</label>
          <input type="number" min={10} value={m2} onChange={(e) => setM2(Math.max(10, Number(e.target.value) || 10))}
                 className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 mb-3"/>
          <label className="block text-sm mb-1">Exposicion solar</label>
          <select value={exposure} onChange={(e) => setExposure(e.target.value as "sombra" | "normal" | "sol")}
                  className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 mb-3">
            <option value="sombra">Sombra / orientacion norte</option>
            <option value="normal">Normal / mixta</option>
            <option value="sol">Sol directo / mucho cerramiento</option>
          </select>
          <label className="block text-sm mb-1">Personas habituales</label>
          <input type="number" min={1} value={occupants} onChange={(e) => setOccupants(Math.max(1, Number(e.target.value) || 1))}
                 className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 mb-3"/>
          <label className="block text-sm mb-1">Equipos electricos adicionales</label>
          <input type="number" min={0} value={appliances} onChange={(e) => setAppliances(Math.max(0, Number(e.target.value) || 0))}
                 className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 mb-3"/>
          <p className="text-xs text-gray-400">Cocina, PCs, iluminacion extra, etc.</p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
          <h2 className="text-lg font-semibold mb-3">Recomendacion</h2>
          <div className="rounded-lg bg-gray-900 p-4 border border-gray-700">
            <div className="text-sm text-gray-300">Potencia de refrigeracion</div>
            <div className="text-2xl font-bold">{(result.cooling / 1000).toFixed(2)} kW</div>
            <div className="text-sm text-gray-300 mt-2">Potencia de calefaccion</div>
            <div className="text-2xl font-bold">{(result.heating / 1000).toFixed(2)} kW</div>
            <div className="text-sm text-gray-300 mt-2">Equivalente</div>
            <div className="text-xl font-bold text-orange-400">{result.btu} BTU (aprox.)</div>
            <div className="mt-4 text-lg font-semibold text-cyan-300">
              Unidad recomendada: {result.unit} W
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Regla orientativa: 100 W/m2 base + ocupantes + equipos + factor solar.
            </p>
            <div className="mt-4 rounded-xl border border-orange-400/30 bg-orange-500/10 p-3">
              <p className="text-sm font-semibold text-orange-300">
                ¿Necesitas instalación profesional?
              </p>
              <p className="text-xs text-gray-300 mt-1">
                Envía tu proyecto a climont.es y recibe un presupuesto real de instalación.
              </p>
              <a
                href="https://climont.es/contacto"
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
