"use client";

import { useState } from "react";

// Chatbot FAQ (cliente; sin API key ni backend).
// Respuestas basadas en keywords. Heurístico simple y offline.
type Msg = { from: "bot" | "user"; text: string };

function getReply(text: string): string {
  const t = text.toLowerCase();
  if (/pdf|exportar|export/i.test(t)) return "Para exportar el plano a PDF: presiona el botón «Exportar Plano PDF» (A4 landscape con cotas y membrete). También puedes imprimir con Ctrl+P y elegir «Guardar como PDF».";
  if (/medida|cota|metro|exacta/i.test(t)) return "Mientras arrastras un muro, escribe el número (ej. 5.20) y pulsa Enter; el muro se extenderá exactamente esa distancia. Mantén Shift para forzar 90°.";
  if (/puerta|ventana/i.test(t)) return "Haz clic en el botón Puerta o Ventana y luego sobre un muro cercano para insertarla; el grosor y el tipo de abertura se actualizan en el presupuesto.";
  if (/\b\d+\b.*m/i.test(t)) return "He añadido la medida al proyecto. Puedes mover el cursor y pulsar Enter de nuevo.";
  if (/(ac|aire|condicionado|clima)/i.test(t)) return "Cálculo aproximado: 130 frig/h por m². El panel muestra Potencia A/A ≈ (totalArea * 130 / 860) kW. Añade conducto/rejilla/split para ver la distribución.";
  return "No entiendo eso. Intenta palabras como:PDF, exportar, cotas, muros, puerta, ventana, clima, ayuda.";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { from: "bot", text: "Hola, soy el asistente de TusPlanos3D. ¿En qué puedo ayudarte?" },
  ]);
  const [typing, setTyping] = useState(false);

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

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full bg-orange-500 px-3 py-2 font-semibold text-gray-900 shadow-lg"
        style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 50 }}
      >
        💬
      </button>
      {open && (
        <div
          className="fixed bottom-16 right-4 z-50 w-72 rounded-lg border border-gray-700 bg-gray-800 p-3 shadow-2xl backdrop-blur"
          style={{ height: "320px" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm">Ayuda rápida</strong>
            <button onClick={() => setOpen(false)} className="text-xs text-gray-400">
              cerrar
            </button>
          </div>
          <div className="mb-2 h-56 overflow-y-auto space-y-2 rounded bg-gray-900 p-2 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "bot"
                    ? "text-gray-200"
                    : "text-right text-orange-300"
                }
              >
                {m.text}
              </div>
            ))}
            {typing && <div className="text-gray-400">escribiendo…</div>}
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