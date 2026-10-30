"use client";

import { useState } from "react";

type Msg = { from: "bot" | "user"; text: string };

// Base de conocimiento FAQ (cliente, sin backend).
// Se alimenta con keywords/​regex y devuelve respuestas amplias de ayuda.
const FAQ: { keys: RegExp[]; answer: string }[] = [
  {
    keys: [/pdf|exportar|imprimir|impresión/i],
    answer: "Para PDF: pulsa «Exportar Plano PDF» (botón verde). Genera A4 horizontal con cotas, membrete y escala. También puedes imprimir la página (Ctrl+P → Guardar como PDF) como alternativa.",
  },
  {
    keys: [/medida|cota|metro|mundo|unidad/i],
    answer: "Mientras arrastras un muro, teclea el valor (ej. 5.20) y pulsa Enter; el muro se estira exactamente esa distancia. Mantén Shift para forzar ángulos de 90°.",
  },
  {
    keys: [/puerta|ventana|aberturas/i],
    answer: "Pincha el botón Puerta (0.80m) o Ventana (1.20m), luego haz clic sobre el muro; se inserta la abertura en el punto más cercano y el presupuesto se recalcula.",
  },
  {
    keys: [/clima|aa|aire|a\/a|conducto|rejilla|fancoil|split/i],
    answer: "Climatización ≈ 130 frig/h por m² (1 frig = 1.163 W). El panel muestra la potencia estimada en kW. Usa el botón Conducto/Rejilla/Split/Compresor para dibujar la distribución.",
  },
  {
    keys: [/grosor|muro|tabique|exterior|interior/i],
    answer: "Grosor Carga (30cm) = muro exterior de carga (línea gruesa). Grosor Tabique (10cm) = tabique interior (línea fina).",
  },
  {
    keys: [/deshacer|undo|borrar|delete|tecla/i],
    answer: "Deshacer: Ctrl+Z o tecla «u». Cancelar tramo: Esc. Quitar selección: Supr / Borrar (Del).",
  },
  {
    keys: [/presupuesto|precio|coste|peso/i],
    answer: "El panel de presupuesto es bueno para aproximación, pero dependerá mucho de tu zona (mano de obra, material, etc.).",
  },
  {
    keys: [/proyecto|guardar|json|recuperar/i],
    answer: "El proyecto se guarda en tu navegador (localStorage: «tusplanos3d:plano:v1»). Puedes descargarlo como JSON y volver a importarlo más tarde (botón «Cargar proyecto»).",
  },
  {
    keys: [/cota|exacta<|message|>medida/i],
    answer: "Para cota exacta: segundo clic + número + Enter. El muro industrial con ese valor. También puedes arrastrar libre y luego ajustar con el teclado (flechas ±10 cm).",
  },
  {
    keys: [/svg|vectorial/i],
    answer: "SVG exporta el canvas en formato vectorial, útil para Illustrator/Inkscape/Figma o para insertar en documentos.",
  },
  {
    keys: [/offline|local|sin conexión/i],
    answer: "Todo se ejecuta en tu navegador. No enviarás datos a internet (localStorage). No necesita conexión para usar la app.",
  },
  {
    keys: [/ayuda|help|cómo/i],
    answer: "Visita la página /ayuda para la guía completa y /cookies para la política de uso de localStorage.",
  },
  {
    keys: [/login|account|sesión|usuario/i],
    answer: "El login (Google/Supabase) está preparado en /login y /account pero sin credenciales reales por ahora. Leemos Supabase (.env).",
  },
];

function getReply(text: string): string {
  const item = FAQ.find((f) => f.keys.some((k) => k.test(text)));
  return item?.answer || "No enciendo eso. Prueba con: PDF, medir, cota, ángulos, puerta, tabique, clima, presupuesto, ayuda.";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hola, soy el asistente de TusPlanos3D. ¿En qué puedo ayudarte?" },
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

  // Diseño original: botón flotante, panel con historial y sugerencias chip.
  return (
    <>
      {showChip && (
        <div
          className="fixed bottom-16 right-4 z-50 rounded-lg border border-orange-400/40 bg-gray-800/90 px-3 py-2 text-[11px] shadow"
          style={{ maxWidth: "220px" }}
        >
          <p className="text-gray-200">
            Ayuda rápida con el generador (cotas, PDF, prespuesto).
          </p>
          <button className="absolute -top-1 right-1 text-xs text-gray-400" onClick={() => setShowChip(false)}>×</button>
        </div>
      )}
      <button
        onClick={() => { setOpen(!open); setShowChip(false); }}
        className="rounded-full bg-orange-500 px-3 py-2 font-semibold text-gray-900 shadow-lg"
        style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 50 }}
      >
        💬
      </button>
      {open && (
        <div
          className="fixed bottom-16 right-4 z-50 w-72 rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-2xl backdrop-blur"
          style={{ height: "360px" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm text-orange-400">Ayuda rápida</strong>
            <button onClick={() => setOpen(false)} className="text-xs text-gray-400">cerrar</button>
          </div>
          <div className="mb-2 h-60 overflow-y-auto space-y-2 rounded bg-gray-900 p-2 text-xs">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "bot" ? "text-gray-200" : "text-right text-orange-300"}>
                {m.text}
              </div>
            ))}
            {typing && <div className="text-gray-400">escribiendo…</div>}
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {["PDF", "cotas", "puertas", "clima", "undo", "presupuesto"].map((q) => (
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
              placeholder="pregunta…"
            />
            <button onClick={send} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900">
              ▶
            </button>
          </div>
        </div>
      )}
    </>
  );
}