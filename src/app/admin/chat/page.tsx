"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase";
import { decryptText, loadMessages, listThreads, sendEncryptedMessage, subscribeThread } from "@/lib/chat";

type Thread = { id: string; user_id: string; created_at: string; updated_at: string };

export default function AdminChatPage() {
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [passInput, setPassInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; from: "admin" | "user"; text: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) { setChecked(true); return; }
    sb.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user?.email ?? null;
      const uid = data.session?.user?.id;
      setUser(email);
      if (!uid) { setChecked(true); return; }
      const { data: admin } = await sb.from("chat_admins").select("user_id").eq("user_id", uid).maybeSingle();
      setIsAdmin(Boolean(admin));
      if (admin) {
        const { data: ts } = await listThreads(sb);
        setThreads((ts as Thread[]) ?? []);
      }
      setChecked(true);
    });
  }, []);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb || !selected || !passphrase) return;
    (async () => {
      const { data } = await loadMessages(sb, selected);
      if (!data) return;
      const dec = await Promise.all(
        data.map(async (r) => ({
          id: r.id,
          from: r.sender_id === user ? ("admin" as const) : ("user" as const),
          text: await decryptText(passphrase, selected, r.ciphertext, r.iv),
        }))
      );
      setMessages(dec);
    })();
    const channel = subscribeThread(sb, selected, async (row) => {
      const txt = await decryptText(passphrase, selected, row.ciphertext, row.iv);
      setMessages((m) => (m.some((x) => x.id === row.id) ? m : [...m, { id: row.id, from: row.sender_id === user ? "admin" : "user", text: txt }]));
    });
    return () => { sb.removeChannel(channel); };
  }, [selected, passphrase, user]);

  async function reply() {
    const sb = getBrowserSupabase();
    if (!sb || !selected || !input.trim() || !passphrase) return;
    const { data } = await sb.auth.getSession();
    const uid = data.session?.user?.id;
    if (!uid) return;
    await sendEncryptedMessage(sb, selected, uid, passphrase, input.trim());
    setInput("");
  }

  if (!checked) return <div className="mx-auto max-w-3xl px-6 py-16">Cargando...</div>;
  if (!user) return <div className="mx-auto max-w-3xl px-6 py-16">Inicia sesion en <a href="/login" className="text-blue-400 underline">/login</a>.</div>;
  if (!isAdmin) return <div className="mx-auto max-w-3xl px-6 py-16">No autorizado. Tu usuario no esta en chat_admins.</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-ink">
      <h1 className="text-3xl font-bold mb-6">Chat de soporte (admin)</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-line bg-paper p-4">
          <h2 className="font-semibold mb-2">Hilos</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {threads.map((t) => (
              <button key={t.id} onClick={() => setSelected(t.id)} className={`w-full text-left text-sm rounded px-2 py-1.5 ${selected === t.id ? "bg-orange-500/20 text-orange-300" : "hover:bg-paper-2"}`}>
                {t.id.slice(0, 8)} · {t.user_id.slice(0, 8)}
              </button>
            ))}
            {threads.length === 0 && <p className="text-xs text-muted">Sin hilos.</p>}
          </div>
        </div>

        <div className="md:col-span-2 rounded-xl border border-line bg-paper p-4">
          {!selected ? (
            <p className="text-sm text-muted">Selecciona un hilo.</p>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-2">
                <input value={passInput} onChange={(e) => setPassInput(e.target.value)} className="rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink" placeholder="clave compartida" />
                <button onClick={() => { if (passInput.trim()) { setPassphrase(passInput.trim()); setPassInput(""); } }} className="rounded bg-orange-500 px-2 py-1 text-xs font-semibold text-gray-900">
                  Usar clave
                </button>
                {passphrase && <span className="text-xs text-green-400">clave activa</span>}
              </div>
              <div className="h-64 overflow-y-auto space-y-2 rounded bg-paper-2 p-2 text-xs mb-3">
                {messages.map((m, i) => (
                  <div key={m.id || i} className={m.from === "admin" ? "text-right text-orange-300" : "text-gray-200"}>
                    {m.text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && reply()} className="flex-1 rounded border border-line bg-paper-2 px-2 py-1 text-xs text-ink" placeholder="responder..." />
                <button onClick={reply} className="rounded bg-orange-500 px-3 py-1 text-xs font-semibold text-gray-900">Enviar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
