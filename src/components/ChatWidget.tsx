"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase";
import { ensureThread, loadMessages, sendEncryptedMessage, subscribeThread, decryptText } from "@/lib/chat";

const PUBLIC_PASS = "tusplanos3d-public-chat-2026";

type Msg = { id: string; from: "user" | "support"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { id: "welcome", from: "support", text: "Hola. Soy el soporte de TusPlanos3D. Puedes escribir sin registrarte." },
  ]);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [draftNick, setDraftNick] = useState<string>("");

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    (async () => {
      try {
        let { data } = await sb.auth.getSession();
        let session = data.session;
        if (!session || !session.user) {
          const { data: anonymous, error: anonError } = await sb.auth.signInAnonymously();
          if (anonError) throw anonError;
          session = anonymous.session;
        }
        const user = session?.user;
        if (!user) throw new Error("No user");
        setUid(user.id);
        const savedNick = localStorage.getItem(`chat_name_${user.id}`) || "";
        setNickname(savedNick);
        const tid = await ensureThread(sb, user.id);
        setThreadId(tid);
        const { data: rows } = await loadMessages(sb, tid);
        if (rows) {
          const dec = await Promise.all(
            rows.map(async (r) => ({
              id: r.id,
              from: (r.sender_id === user.id ? "user" : "support") as "user" | "support",
              text: await decryptText(PUBLIC_PASS, tid, r.ciphertext, r.iv),
            }))
          );
          if (dec.length > 0) setMessages(dec);
        }
        const channel = subscribeThread(sb, tid, async (row) => {
          const txt = await decryptText(PUBLIC_PASS, tid, row.ciphertext, row.iv);
          setMessages((m) => (m.some((x) => x.id === row.id) ? m : [...m, { id: row.id, from: row.sender_id === user.id ? "user" : "support", text: txt }]));
        });
        return () => { sb.removeChannel(channel); };
      } catch (err) {
        setError("No se pudo iniciar el chat compartido. Intenta más tarde.");
      }
    })();
  }, []);

  async function send() {
    const txt = input.trim();
    if (!txt || !threadId || !uid) return;
    const nick = nickname || "Invitado";
    if (!nick.trim()) {
      setError("Pon un nickname antes de enviar.");
      return;
    }
    const sb = getBrowserSupabase();
    if (!sb) return;
    setInput("");
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: "user", text: txt }]);
    setTyping(true);
    try {
      await sendEncryptedMessage(sb, threadId, uid, PUBLIC_PASS, `(${nick}) ${txt}`);
    } catch {
      setError("No se pudo enviar.");
    } finally {
      setTyping(false);
    }
  }

  function saveNickname() {
    if (!draftNick.trim()) return;
    if (uid) localStorage.setItem(`chat_name_${uid}`, draftNick.trim());
    setNickname(draftNick.trim());
    setDraftNick("");
    setError("");
  }

  const hasNick = Boolean(nickname.trim());

  return (
    <>
      <button onClick={() => { setOpen(!open); }} className="rounded-full bg-orange-500 px-3 py-2 font-semibold text-gray-900 shadow-lg" style={{ position: "fixed", bottom: "1rem", right: "1rem", zIndex: 50 }}>
        Chat
      </button>
      {open && (
        <div className="fixed bottom-16 right-4 z-50 w-80 rounded-lg border border-line bg-paper p-3 shadow-2xl backdrop-blur" style={{ height: "420px" }}>
          <div className="mb-2 flex items-center justify-between">
            <strong className="text-sm text-orange-400">Chat Comunidad Vibecoders</strong>
            <button onClick={() => setOpen(false)} className="text-xs text-muted">cerrar</button>
          </div>

          {!hasNick ? (
            <div className="mb-2 space-y-2 text-xs">
              <p className="text-ink-soft">Pon un nickname para poder escribir:</p>
              <input value={draftNick} onChange={(e) => setDraftNick(e.target.value)} className="w-full rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink" placeholder="Tu nickname..." />
              <button onClick={saveNickname} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900">Guardar nickname</button>
              {error && <p className="text-red-400">{error}</p>}
            </div>
          ) : (
            <div className="mb-2 text-[10px] text-muted">Conectado como {nickname}</div>
          )}

          <div className="mb-2 h-52 overflow-y-auto space-y-2 rounded bg-paper-2 p-2 text-xs">
            {messages.map((m, i) => (
              <div key={m.id || i} className={m.from === "user" ? "text-right text-orange-300" : "text-gray-200"}>
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
              disabled={!hasNick}
              className="flex-1 rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink focus:border-orange-400 focus:outline-none disabled:opacity-50"
              placeholder={hasNick ? "mensaje..." : "define nickname primero"}
            />
            <button onClick={send} disabled={!hasNick} className="rounded bg-orange-500 px-2 py-1 text-xs font-bold text-gray-900 disabled:opacity-50">
              Enviar
            </button>
          </div>
          {error && <p className="mt-2 text-[10px] text-red-400">{error}</p>}
        </div>
      )}
    </>
  );
}