"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase";
import Link from "next/link";

function getGuest() { return typeof window !== "undefined" ? localStorage.getItem("local_user") : null; }
function clearGuest() { localStorage.removeItem("local_user"); localStorage.removeItem("chat_name_guest"); }

export default function LoginClient() {
  const [user, setUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [guestNick, setGuestNick] = useState("");
  const [processingRecovery, setProcessingRecovery] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = getBrowserSupabase();
      if (!sb) return;
      // Intercambio del codigo PKCE que Supabase manda por query (?code) al redirigir
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code && typeof window !== "undefined") {
        setProcessingRecovery(true);
        try {
          const { error: exch } = await sb.auth.exchangeCodeForSession(code);
          if (exch) throw exch;
          params.delete("code");
          params.delete("type");
          params.set("reset", "1");
          const qs = params.toString();
          window.history.replaceState({}, document.title, `${window.location.pathname}${qs ? `?${qs}` : ""}#type=recovery`);
        } catch {
          // continuar igual; a veces el código ya se consumió
        } finally {
          setProcessingRecovery(false);
        }
      }
      try {
        const { data } = await sb.auth.getSession();
        if (data.session?.user?.email) setUser(data.session.user.email);
        const isRecovery = Boolean(window.location.hash.includes("type=recovery") || window.location.search.includes("reset=1"));
        if (isRecovery) setMode("reset");
      } catch {
        // ignore; UI follows normal path
      }
      const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user?.email ?? null);
      });
      return () => { sub.subscription.unsubscribe(); };
    })();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && (window.location.hash.includes("type=recovery") || window.location.search.includes("reset=1"))) {
      setMode("reset");
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) return alert("Configura Supabase (.env).");
    setError("");
    setNotice("");
    if (mode === "reset") {
      if (!password || password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
      const first = await sb.auth.getSession();
      let session = first.data.session;
      if (!session) await new Promise((r) => setTimeout(r, 600));
      if (!session) {
        const second = await sb.auth.getSession();
        session = second.data.session;
      }
      if (!session) { setError("No hay sesión activa de recuperación. Reabre el enlace del correo."); return; }
      const { error } = await sb.auth.updateUser({ password });
      if (error) setError(error.message);
      else { setError(""); setNotice("Contraseña actualizada correctamente. Ya puedes iniciar sesión."); setMode("login"); setPassword(""); }
      return;
    }
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

  async function forgot(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserSupabase();
    if (!sb) return;
    if (!email) { setError("Introduce tu email."); return; }
    setError("");
    setNotice("");
    const redirectTo = `${window.location.origin}/login?reset=1`;
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) setError(error.message);
    else setNotice("Te enviamos un enlace para recuperar la contraseña. Revisa tu correo.");
  }

  async function logout() {
    const sb = getBrowserSupabase();
    if (sb) await sb.auth.signOut();
    clearGuest();
    setUser(null);
  }

  function continueGuest() {
    if (!guestNick.trim()) return;
    localStorage.setItem("local_user", guestNick.trim());
    setGuestNick("");
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-16">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      {user && !processingRecovery && (
        <div className="space-y-3">
          <p className="text-muted">Conectado como {user}</p>
          <button onClick={logout} className="rounded bg-paper-2 px-4 py-2 text-sm text-ink">
            Cerrar sesión
          </button>
        </div>
      )}
      {!user && (
        <>
          {(mode === "login" || mode === "signup") && (
            <form onSubmit={submit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink"
              />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="contraseña (mín. 6)"
                className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              {notice && <p className="text-sm text-green-400">{notice}</p>}
              <button type="submit" className="w-full rounded bg-orange-500 px-4 py-2 font-semibold text-gray-900">
                {mode === "signup" ? "Crear cuenta (nube)" : "Entrar (nube)"}
              </button>
              <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="w-full text-xs text-muted hover:text-orange-400">
                {mode === "signup" ? "Ya tengo cuenta" : "Crear cuenta nueva"}
              </button>
              <button type="button" onClick={() => setMode("forgot")} className="w-full text-xs text-muted hover:text-orange-400">
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={forgot} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              {notice && <p className="text-sm text-green-400">{notice}</p>}
              <button type="submit" className="w-full rounded bg-orange-500 px-4 py-2 font-semibold text-gray-900">
                Enviar enlace de recuperación
              </button>
              <button type="button" onClick={() => setMode("login")} className="w-full text-xs text-muted hover:text-orange-400">
                Volver al login
              </button>
            </form>
          )}

          {mode === "reset" && (
            <form onSubmit={submit} className="space-y-3">
              <p className="text-sm text-muted">Define tu nueva contraseña a continuación.</p>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mín. 6 caracteres"
                className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink"
              />
              {processingRecovery && <p className="text-xs text-muted">Procesando enlace...</p>}
              {error && <p className="text-sm text-red-400">{error}</p>}
              {notice && <p className="text-sm text-green-400">{notice}</p>}
              <button type="submit" className="w-full rounded bg-orange-500 px-4 py-2 font-semibold text-gray-900">
                Actualizar contraseña
              </button>
            </form>
          )}

          <div className="rounded-xl border border-line bg-paper p-4">
            <p className="text-sm font-medium mb-2">modo local / invitado</p>
            <p className="text-xs text-muted mb-2">Guarda en este navegador sin cuenta.</p>
            <input
              value={guestNick}
              onChange={(e) => setGuestNick(e.target.value)}
              placeholder="Tu nickname / alias"
              className="w-full rounded border border-line bg-paper-2 px-3 py-2 text-sm text-ink"
            />
            <button onClick={continueGuest} className="mt-2 w-full rounded bg-accent px-4 py-2 font-semibold text-paper">
              Continuar como invitado (local)
            </button>
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {notice && <p className="text-sm text-green-400">{notice}</p>}

      <div className="mt-4 text-center">
        <Link href="/" className="text-xs text-accent underline">Volver al generador</Link>
      </div>
    </div>
  );
}