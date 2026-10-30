"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase";

export default function AccountPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sb = getBrowserSupabase();
    if (!sb) {
      const t = setTimeout(() => setChecked(true), 0);
      return () => clearTimeout(t);
    }
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email) setEmail(data.session.user.email);
      setChecked(true);
    });
    return undefined;
  }, []);

  if (!checked) return <p className="mx-auto py-16 text-muted">Cargando…</p>;
  if (!email)
    return (
      <div className="mx-auto max-w-md space-y-4 py-16">
        <h1 className="text-2xl font-bold">Sin sesión</h1>
        <a href="/login" className="text-blue-400 underline">Iniciar sesión</a>
      </div>
    );

  return (
    <div className="mx-auto max-w-md space-y-4 py-16">
      <h1 className="text-2xl font-bold">Mi cuenta</h1>
      <p className="text-muted">Conectado: {email}</p>
      <button
        className="rounded bg-gray-700 px-4 py-2 text-sm text-white"
        onClick={async () => {
          const sb = getBrowserSupabase();
          await sb?.auth.signOut();
          router.push("/login");
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}