"use client";

import { useState } from "react";

type Msg = { from: "bot" | "user"; text: string };

type Faq = { keys: string[]; answer: string };

const FAQ: Faq[] = [
  { keys: ["pdf", "exportar pdf", "imprimir", "exportar"], answer: "Para PDF: pulsa Exportar Plano PDF (boton verde). Genera A4 horizontal con cotas, membrete y escala. Tambien puedes imprimir la pagina (Ctrl+P -> Guardar como PDF)." },
  { keys: ["medida", "cota", "metro", "mundo", "unidad", "exacta"], answer: "Mientras arrastras un muro, teclea el valor (ej. 5.20) y pulsa Enter. Manten Shift para forzar 90 grados. Cota exacta: segundo clic + numero + Enter." },
  { keys: ["puerta", "ventana", "abertura", "aberturas"], answer: "Pincha el boton Puerta (0.80m) o Ventana (1.20m), luego haz clic sobre el muro; se inserta la abertura en el punto mas cercano y el presupuesto se recalcula." },
  { keys: ["clima", "aa", "aire", "conducto", "rejilla", "fancoil", "split"], answer: "Climatizacion ~130 frig/h por m2 (1 frig = 1.163 W). El panel muestra la potencia estimada en kW. Usa Conducto/Rejilla/Split/Compresor para distribuir." },
  { keys: ["grosor", "muro", "tabique", "exterior", "interior", "carga"], answer: "Grosor Carga (30cm) = muro exterior de carga (linea gruesa). Grosor Tabique (10cm) = tabique interior (linea fina)." },
  { keys: ["deshacer", "undo", "borrar", "delete", "tecla", "supr", "borrar", "cancelar"], answer: "Deshacer: Ctrl+Z o 'u'. Cancelar tramo: Esc. Quitar seleccion: Supr/Del. Guardar/cargar: botones del panel lateral." },
  { keys: ["presupuesto", "precio", "coste", "peso", "material", "mano de obra"], answer: "El presupuesto es aproximado y depende mucho de la zona (mano de obra, material, acabados). Usalo como estimacion, no como cotizacion final." },
  { keys: ["proyecto", "guardar", "json", "recuperar", "localstorage", "importar"], answer: "El proyecto se guarda en tu navegador (localStorage: tusplanos3d:plano:v1). Puedes descargarlo como JSON y volver a importarlo mas tarde (Cargar proyecto)." },
  { keys: ["svg", "vectorial", "exportar svg"], answer: "SVG exporta el canvas en formato vectorial; util para Illustrator/Inkscape/Figma o para insertar en documentos." },
  { keys: ["offline", "local", "sin conexion", "internet"], answer: "Todo se ejecuta en tu navegador. No enviaras datos a internet (localStorage). No necesita conexion para usar la app." },
  { keys: ["ayuda", "help", "guia", "cookies"], answer: "Visita /ayuda para la guia completa y /cookies para la politica de uso de localStorage." },
  { keys: ["login", "account", "sesion", "usuario", "google", "auth"], answer: "El login (Google/Supabase) esta preparado en /login y /account, pero requiere configurar credenciales reales por ahora." },
  { keys: ["contratacion", "electricidad", "potencia", "icp", "amperios", "kw", "kilowatt"], answer: "Ve a /electricidad para la calculadora: selecciona aparatos, factor de coincidencia y margen. Obtiene kW contratados e ICP recomendado a 230V." },
  { keys: ["csv", "exportar csv"], answer: "En la pagina /electricidad puedes exportar el resultado a CSV (boton Exportar CSV) o imprimir a PDF." },
  { keys: ["superficie", "m2", "metros", "area", "planta"], answer: "La iluminacion se estima 10W por m2 (un punto cada 10m2). Puedes cambiar la superficie en la calculadora de electricidad." },
  { keys: ["zoom", "vista", "centrar", "canvas"], answer: "Usa la rueda del raton para zoom y Ctrl+0 para centrar. La vista se ajusta a los limites del lienzo." },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ");
}

function score(q: string, keys: string[]) {
  const qn = normalize(q);
  const tokens = qn.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const k of keys) {
    const kn = normalize(k);
    if (qn.includes(kn)) s += 5;
    for (const t of tokens) if (kn.includes(t) && t.length > 2) s += 1;
  }
  return s;
}

function getReply(text: string): string {
  const ranked = FAQ.map((f) => ({ f, s: score(text, f.keys) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (ranked.length === 0) {
    return "No entiendo del todo esa consulta. Prueba con: PDF, medicion, cota, puerta, tabique, clima, presupuesto, electricidad, ayuda, login.";
  }
  return ranked[0].f.answer;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hola, soy el asistente de TusPlanos3D. En que puedo ayudarte?" },
  ]);
  const [typing, setTyping] = useState(false);
  const [showChip, setShowChip] = useState(true);

  async function send() {
    const txt = input.trim();
    if (!txt) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text: txt }]);
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(txt);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setTyping(false);
    }, 600);
  }

  function quick(label: string) {
    setInput(label);
    setMessages((m) => [...m, { from: "user", text: label }]);
    setTyping(true);
    setTimeout(() => {
      const reply = getReply(label);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
      setTyping(false);
      setInput("");
    }, 600);
  }

  return (
    <>
      {showChip && (
        <div
          className="fixed bottom-16 right-4 z-50 rounded-lg border border-orange-400/40 bg-gray-800/90 px-3 py-2 text-[11px] shadow"
          style={{ maxWidth: "220px" }}
        >
          <p className="text-gray-200">Ayuda rapida con el generador (cotas, PDF, presupuesto, electricidad).</p>
          <button className="absolute -top-1 right-1 text-xs text-gray-400" onClick={() => setShowChip(false)}>x</button>
        </div>
      )}
      <button
        onClick={() => { setOpen(!open); setShowChip(false); }}
        className="rounded-full bg-orange-500 px-3 py-2 font-semibold text-gray-900 shadow-lg"
        style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 50 }}
      >
        ?
      </button>
      {open && (
        <div
          className="fixed bottom-16 right-4 z-50 w-72 rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-2xl backdrop-blur"
          style={{ height: "360px" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm text-orange-400">Ayuda rapida</strong>
            <button onClick={() => setOpen(false)} className="text-xs text-gray-400">cerrar</button>
          </div>
          <div className="mb-2 h-60 overflow-y-auto space-y-2 rounded bg-gray-900 p-2 text-xs">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "bot" ? "text-gray-200" : "text-right text-orange-300"}>
                {m.text}
              </div>
            ))}
            {typing && <div className="text-gray-400">escribiendo...</div>}
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {["PDF", "cotas", "puertas", "clima", "undo", "electricidad"].map((q) => (
              <button
                key={q}
                onClick={() => quick(q)}
                className="rounded bg-gray-700 px-2 py-0.5 text-[10px] text-gray-300 hover:bg-gray-600"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 rounded border border-gray-600 bg-gray-900 px-2 py-1 text-xs text-white focus:border-orange-400 focus:outline-none"
              placeholder="pregunta..."
            />
            <button onClick={send} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900">
              -&gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
