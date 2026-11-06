"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase";
import Link from "next/link";

function markGuest(nick: string) { localStorage.setItem("local_user", nick); localStorage.setItem("chat_name_guest", nick); }
function getGuest() { return localStorage.getItem("local_user"); }
function clearGuest() { localStorage.removeItem("local_user"); localStorage.removeItem("chat_name_guest"); }

export default function LoginClient() {
  const [user, setUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [guestNick, setGuestNick] = useState("");
  const [guest, setGuest] = useState<string | null>(null);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (sb) {
      sb.auth.getSession().then(({ data }) => {
        if (data.session?.user?.email) setUser(data.session.user.email);
      });
      const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user?.email ?? null);
      });
      return () => { sub.subscription.unsubscribe(); };
    }
  }, []);

  useEffect(() => {
    setGuest(getGuest());
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) return alert("Configura Supabase (.env).");
    setError("");
    const { error } =
      mode === "signup"
        ? await sb.auth.signUp({ email, password })
        : await sb.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else {
      const { data } = await sb.auth.getSession();
      if (data.session?.user?.email) setUser(data.session.user.email);
    }
  }

  async function logout() {
    const sb = getBrowserSupabase();
    if (sb) await sb.auth.signOut();
    clearGuest();
    setUser(null);
    setGuest(null);
  }

  function continueGuest() {
    if (!guestNick.trim()) return;
    markGuest(guestNick.trim());
    setGuest(guestNick.trim());
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-16">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      {user && (
        <div className="space-y-3">
          <p className="text-muted">Conectado como {user}</p>
          <button onClick={logout} className="rounded bg-paper-2 px-4 py-2 text-sm text-ink">Cerrar sesión</button>
        </div>
      )}
      {!user && guest && (
        <div className="space-y-3">
          <p className="text-muted">Sesión invitado activa: {guest}</p>
          <button onClick={logout} className="rounded bg-paper-2 px-4 py-2 text-sm text-ink">Cerrar sesión invitado</button>
        </div>
      )}
      {!user && !guest && (
        <>
          <form onSubmit={submit} className="space-y-3">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@ejemplo.com" className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="contraseña (mín. 6)" className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink" />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="w-full rounded bg-orange-500 px-4 py-2 font-semibold text-gray-900">
              {mode === "signup" ? "Crear cuenta (nube)" : "Entrar (nube)"}
            </button>
            <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="w-full text-xs text-muted hover:text-orange-400">
              {mode === "signup" ? "Ya tengo cuenta" : "Crear cuenta nueva"}
            </button>
          </form>

          <div className="rounded-xl border border-line bg-paper p-4">
            <p className="text-sm font-medium mb-2">modo local / invitado</p>
            <p className="text-xs text-muted mb-2">Sin cuenta: se guarda en este navegador/local storage.</p>
            <input value={guestNick} onChange={(e) => setGuestNick(e.target.value)} placeholder="Tu nickname/superusuario" className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink" />
            <button onClick={continueGuest} className="mt-2 w-full rounded bg-accent px-4 py-2 font-semibold text-paper">
              Continuar como invitado (local)
            </button>
          </div>
        </>
      )}
      <div className="mt-4 text-center">
        <Link href="/" className="text-xs text-accent underline">Volver al generador</Link>
      </div>
    </div>
  );
}