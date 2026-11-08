"use client";

import { useEffect, useState } from "react";

type Msg = { id: string; from: "user" | "community"; text: string; nick: string; time: string };

const STORAGE_KEY = "chat:vibecoders:community:v1";
const NICK_KEY = "chat:vibecoders:nick";

function nowLabel() {
  return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function loadMessages() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Msg[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { id: "welcome", from: "community", text: "Hola. Bienvenido/a al Chat comunidad de TusPlanos3D.es.", nick: "TusPlanos3D.es", time: nowLabel() },
  ]);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(NICK_KEY) || "";
    setNickname(saved);
    const list = loadMessages();
    if (list.length > 0) setMessages(list);
    const channel = new BroadcastChannel("chat:vibecoders");
    channel.onmessage = (ev) => {
      if (ev.data?.type === "msg" && ev.data.msg) {
        setMessages((m) => (m.some((x) => x.id === ev.data.msg.id) ? m : [...m, ev.data.msg]));
      }
    };
    return () => channel.close();
  }, []);

  function saveNickname(value: string) {
    const clean = value.trim().slice(0, 24);
    if (!clean) return;
    localStorage.setItem(NICK_KEY, clean);
    setNickname(clean);
    setError("");
  }

  function send() {
    const txt = input.trim();
    if (!txt) return;
    const nick = nickname || "Invitado";
    if (!nick.trim()) {
      setError("Pon un nickname antes de enviar.");
      return;
    }
    const msg: Msg = {
      id: crypto.randomUUID(),
      from: "user",
      text: txt,
      nick: nick.trim(),
      time: nowLabel(),
    };
    setInput("");
    const list = [...messages, msg];
    setMessages(list);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      const channel = new BroadcastChannel("chat:vibecoders");
      channel.postMessage({ type: "msg", msg });
      channel.close();
    } catch {
      setError("No se pudo guardar/enviar el mensaje localmente.");
    }
    setTyping(false);
  }

  const hasNick = Boolean(nickname.trim());

  return (
    <>
      <button onClick={() => { setOpen(!open); }} className="rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-gray-900 shadow-xl ring-2 ring-orange-300/60 hover:bg-orange-400 transition-all" style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 60 }}>
        Chat comunidad TusPlanos3D.es
      </button>
      {open && (
        <div className="fixed bottom-16 right-4 z-50 w-96 max-w-[90vw] rounded-xl border border-line bg-paper p-4 shadow-2xl backdrop-blur" style={{ height: "560px" }}>
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm text-orange-400">Chat comunidad TusPlanos3D.es</strong>
            <button onClick={() => setOpen(false)} className="text-xs text-muted">cerrar</button>
          </div>

          {!hasNick ? (
            <div className="mb-2 space-y-2 text-xs">
              <p className="text-ink-soft">Pon un nickname para poder escribir:</p>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink" placeholder="Tu nickname..." />
              <button onClick={() => saveNickname(nickname)} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900">Guardar nickname</button>
              {error && <p className="text-red-400">{error}</p>}
            </div>
          ) : (
            <div className="mb-2 text-[10px] text-muted">Conectado como {nickname}</div>
          )}

          <div className="mb-2 h-72 overflow-y-auto space-y-2 rounded bg-paper-2 p-3 text-sm">
            {messages.map((m) => (
              <div key={m.id} className={m.from === "user" ? "text-right" : "text-left text-muted"}>
                <span className="block text-[10px] opacity-70">{m.text}</span>
              </div>
            ))}
            {typing && <div className="text-muted">escribiendo...</div>}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={!hasNick}
              className="flex-1 rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink focus:border-orange-400 focus:outline-none disabled:opacity-50"
              placeholder={hasNick ? "mensaje (se queda guardado)..." : "define nickname primero"}
            />
            <button onClick={send} disabled={!hasNick} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900 disabled:opacity-50">
              Enviar
            </button>
          </div>
          {error && <p className="mt-2 text-[10px] text-red-400">{error}</p>}
          <p className="mt-2 text-[9px] text-muted/60">Se guarda localmente en este navegador y se comparte entre pestañas.</p>
        </div>
      )}
    </>
  );
}