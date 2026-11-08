"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase";
import { decryptText, ensureThread, loadMessages, sendEncryptedMessage, subscribeThread } from "@/lib/chat";

type Msg = { id: string; from: "bot" | "user"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([{ id: "welcome", from: "bot", text: "Hola. Bienvenido al Chat comunidad de TusPlanos3D.es. Cifrado de extremo a extremo (E2EE): inicia sesión para usarlo." }]);
  const [typing, setTyping] = useState(false);
  const [showChip, setShowChip] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    sb.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user?.email ?? null;
      setUser(email);
      if (!email || !data.session?.user?.id) return;
      const uid = data.session.user.id;
      const tid = await ensureThread(sb, uid);
      setThreadId(tid);
      const saved = localStorage.getItem(`chat_pass_${email}`);
      if (saved) setPassphrase(saved);
      const { data: rows } = await loadMessages(sb, tid);
      if (rows) {
        const dec = await Promise.all(
          rows.map(async (r) => ({
            id: r.id,
            from: (r.sender_id === uid ? "user" : "bot") as "user" | "bot",
            text: await decryptText(saved || "", tid, r.ciphertext, r.iv),
          }))
        );
        setMessages(dec);
      }
      const channel = subscribeThread(sb, tid, async (row) => {
        const txt = await decryptText(localStorage.getItem(`chat_pass_${email}`) || "", tid, row.ciphertext, row.iv);
        setMessages((m) => (m.some((x) => x.id === row.id) ? m : [...m, { id: row.id, from: row.sender_id === uid ? "user" : "bot", text: txt }]));
      });
      return () => { sb.removeChannel(channel); };
    });
  }, []);

  async function send() {
    const txt = input.trim();
    if (!txt || !threadId || !user) return;
    const sb = getBrowserSupabase();
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    const uid = data.session?.user?.id;
    if (!uid) return;
    if (!passphrase) { setError("Define una clave compartida primero."); return; }
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: "user", text: txt }]);
    setTyping(true);
    try {
      await sendEncryptedMessage(sb, threadId, uid, passphrase, txt);
    } catch {
      setError("No se pudo enviar.");
    } finally {
      setTyping(false);
    }
  }

  function savePassphrase() {
    if (!passInput.trim() || !user) return;
    localStorage.setItem(`chat_pass_${user}`, passInput.trim());
    setPassphrase(passInput.trim());
    setPassInput("");
    setError("");
  }

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <a href="/login" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg">
          Chat comunidad
        </a>
      </div>
    );
  }

  return (
    <>
      {showChip && (
        <div className="fixed bottom-16 right-4 z-50 rounded-lg border border-orange-400/40 bg-paper/90 px-3 py-2 text-[11px] shadow" style={{ maxWidth: "240px" }}>
          <p className="text-gray-200">Chat comunidad de TusPlanos3D.es · cifrado (E2EE). Comparte la clave con el admin fuera del chat.</p>
          <button className="absolute -top-1 right-1 text-xs text-muted" onClick={() => setShowChip(false)}>x</button>
        </div>
      )}
      <button onClick={() => { setOpen(!open); setShowChip(false); }} className="rounded-full bg-orange-500 px-3 py-2 font-semibold text-gray-900 shadow-lg" style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 50 }}>
        Chat comunidad
      </button>
      {open && (
        <div className="fixed bottom-16 right-4 z-50 w-80 rounded-lg border border-line bg-paper p-3 shadow-2xl backdrop-blur" style={{ height: "420px" }}>
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm text-orange-400">Chat comunidad TusPlanos3D.es</strong>
            <button onClick={() => setOpen(false)} className="text-xs text-muted">cerrar</button>
          </div>

          {!passphrase ? (
            <div className="mb-2 space-y-2 text-xs">
              <p className="text-ink-soft">Define una clave compartida (no la envies por este chat):</p>
              <input value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink" placeholder="clave..." />
              <button onClick={savePassphrase} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900">Guardar clave</button>
              {error && <p className="text-red-400">{error}</p>}
            </div>
          ) : (
            <div className="mb-2 text-[10px] text-muted">
              Hilo: {threadId?.slice(0, 8)}... · clave guardada localmente.
            </div>
          )}

          <div className="mb-2 h-52 overflow-y-auto space-y-2 rounded bg-paper-2 p-2 text-xs">
            {messages.map((m, i) => (
              <div key={m.id || i} className={m.from === "bot" ? "text-gray-200" : "text-right text-orange-300"}>
                {m.text}
              </div>
            ))}
            {typing && <div className="text-muted">escribiendo...</div>}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={!passphrase}
              className="flex-1 rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink focus:border-orange-400 focus:outline-none disabled:opacity-50"
              placeholder={passphrase ? "mensaje cifrado..." : "define clave primero"}
            />
            <button onClick={send} disabled={!passphrase} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900 disabled:opacity-50">
              -&gt;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
