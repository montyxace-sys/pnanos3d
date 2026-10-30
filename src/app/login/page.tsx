"use client";

import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setUser(data.session.user.email);
    });
  }, []);

  async function login() {
    const sb = getBrowserSupabase();
    if (!sb) return alert("Configura Supabase (.env).");
    await sb.auth.signInWithOAuth({ provider: "google" });
  }
  async function logout() {
    const sb = getBrowserSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    setUser(null);
  }

  return (
    <div className="mx-auto max-w-md space-y-6 py-16">
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      {user ? (
        <>
          <p className="text-muted">Conectado como {user}</p>
          <button onClick={logout} className="rounded bg-gray-700 px-4 py-2 text-sm text-white">
            Cerrar sesión
          </button>
        </>
      ) : (
        <button onClick={login} className="rounded bg-orange-500 px-4 py-2 font-semibold text-gray-900">
          Continuar con Google
        </button>
      )}
    </div>
  );
}