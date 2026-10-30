"use client";
import { useMemo, useState } from "react";

type Appliance = { id: string; label: string; watts: number; defaultCount?: number };

const APPLIANCES: Appliance[] = [
  { id: "nevera", label: "Nevera / frigorífico", watts: 200, defaultCount: 1 },
  { id: "lavadora", label: "Lavadora", watts: 2200, defaultCount: 1 },
  { id: "lavavajillas", label: "Lavavajillas", watts: 2200, defaultCount: 0 },
  { id: "secadora", label: "Secadora", watts: 2500, defaultCount: 0 },
  { id: "micro", label: "Microondas", watts: 1000, defaultCount: 1 },
  { id: "horno", label: "Horno", watts: 2500, defaultCount: 1 },
  { id: "vitro", label: "Vitrocerámica / inducción", watts: 6000, defaultCount: 1 },
  { id: "aa", label: "Aire acondicionado", watts: 2500, defaultCount: 0 },
  { id: "calefaccion", label: "Calefacción eléctrica", watts: 2000, defaultCount: 0 },
  { id: "calentador", label: "Calentador de agua", watts: 1500, defaultCount: 0 },
  { id: "tvpc", label: "TV / PC / equipos", watts: 300, defaultCount: 1 },
  { id: "general", label: "Enchufes generales", watts: 1500, defaultCount: 1 },
];

const STANDARD_POWER = [3.45, 4.6, 5.75, 6.9, 8.05, 9.2, 10.35, 11.5, 13.8, 16.1, 18.4, 20.7, 23];

function recommendContract(kw: number) {
  return STANDARD_POWER.find((p) => p >= kw) ?? STANDARD_POWER[STANDARD_POWER.length - 1];
}

export default function ElectricidadPage() {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(APPLIANCES.map((a) => [a.id, a.defaultCount ?? 0]))
  );
  const [m2, setM2] = useState(80);
  const [factor, setFactor] = useState(0.7);
  const [margin, setMargin] = useState(15);

  const result = useMemo(() => {
    let installed = APPLIANCES.reduce((sum, a) => sum + a.watts * (counts[a.id] ?? 0), 0);
    // iluminación por m2
    const lighting = Math.ceil((m2 / 10) * 100);
    installed += lighting;
    const used = Math.round(installed * factor);
    const withMargin = Math.round(used * (1 + margin / 100));
    const rec = recommendContract(withMargin / 1000);
    return { installed, used, withMargin, rec };
  }, [counts, m2, factor, margin]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 text-gray-100">
      <h1 className="text-3xl font-bold">Contratación mínima de electricidad</h1>
      <p className="mt-2 text-sm text-gray-300">
        Selecciona los electrodomésticos y la superficie para estimar la potencia contratada recomendada.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
          <h2 className="text-lg font-semibold mb-3">Electrodomésticos</h2>
          <div className="space-y-2">
            {APPLIANCES.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <label className="flex-1">{a.label} ({a.watts} W)</label>
                <input
                  type="number"
                  min={0}
                  value={counts[a.id] ?? 0}
                  onChange={(e) => setCounts((prev) => ({ ...prev, [a.id]: Math.max(0, Number(e.target.value) || 0) }))}
                  className="w-16 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-right"
                />
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 text-sm pt-2">
              <label className="flex-1">Superficie (m²) para iluminación</label>
              <input type="number" min={10} value={m2} onChange={(e) => setM2(Math.max(10, Number(e.target.value) || 10))}
                     className="w-16 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-right"/>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
          <h2 className="text-lg font-semibold mb-3">Parámetros</h2>
          <label className="block text-sm mb-1">Factor de coincidencia: {factor}</label>
          <input type="range" min={0.4} max={1} step={0.05} value={factor} onChange={(e) => setFactor(Number(e.target.value))}
                 className="w-full"/>
          <p className="text-xs text-gray-400 mb-3">0,7 recomendado (no todos los aparatos funcionan a la vez).</p>
          <label className="block text-sm mb-1">Margen de seguridad: {margin}%</label>
          <input type="range" min={0} max={40} step={5} value={margin} onChange={(e) => setMargin(Number(e.target.value))}
                 className="w-full"/>
          <p className="text-xs text-gray-400 mb-4">Añade reserva para puntas de arranque.</p>

          <div className="rounded-lg bg-gray-900 p-4 border border-gray-700">
            <div className="text-sm text-gray-300">Potencia instalada</div>
            <div className="text-2xl font-bold">{(result.installed / 1000).toFixed(2)} kW</div>
            <div className="text-sm text-gray-300 mt-2">Potencia estimada (coincidencia)</div>
            <div className="text-2xl font-bold">{(result.used / 1000).toFixed(2)} kW</div>
            <div className="text-sm text-gray-300 mt-2">Con margen de seguridad</div>
            <div className="text-2xl font-bold">{(result.withMargin / 1000).toFixed(2)} kW</div>
            <div className="mt-4 text-lg font-semibold text-orange-400">
              Contratación recomendada: {result.rec} kW
            </div>
            <p className="text-xs text-gray-400 mt-2">
              El ICP (interruptor) debe tener una capacidad igual o superior a la potencia contratada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
