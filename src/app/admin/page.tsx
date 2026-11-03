"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminChat from "@/components/AdminChat";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Event = { id: number; path: string; referrer: string | null; created_at: string };
type Submission = { id: number; name: string; email: string; message: string; created_at: string };

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [tab, setTab] = useState<"stats" | "chat">("stats");

  async function load() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError("Supabase no configurado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [evRes, subRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/analytics_events?select=*&order=created_at.desc&limit=500`, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        }),
        fetch(`${SUPABASE_URL}/rest/v1/contact_submissions?select=*&order=created_at.desc&limit=100`, {
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        }),
      ]);
      const evText = await evRes.text();
      const subText = await subRes.text();
      if (!evRes.ok || !subRes.ok) {
        console.error("admin load fail", evRes.status, evText, subRes.status, subText);
        throw new Error("Error al cargar datos (" + evRes.status + "/" + subRes.status + "): " + (evText || subText));
      }
      setEvents(evText ? JSON.parse(evText) : []);
      setSubmissions(subText ? JSON.parse(subText) : []);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const views24h = events.filter((e) => new Date(e.created_at).getTime() >= dayAgo).length;

  const pathCounts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.path] = (acc[e.path] || 0) + 1;
    return acc;
  }, {});
  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxCount = topPaths.length ? topPaths[0][1] : 1;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-ink">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de administración</h1>
        <div className="flex gap-3">
          {tab === "stats" && (
            <button onClick={load} disabled={loading} className="rounded bg-orange-500 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-orange-400 disabled:opacity-50">
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          )}
          <Link href="/" className="rounded border border-line bg-paper px-3 py-1.5 text-sm hover:bg-paper-2">
            Volver al inicio
          </Link>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="mb-6 flex gap-2 border-b border-line">
        <button
          onClick={() => setTab("stats")}
          className={`px-4 py-2 text-sm font-semibold ${tab === "stats" ? "border-b-2 border-orange-500 text-ink" : "text-muted hover:text-ink"}`}
        >
          Estadísticas
        </button>
        <button
          onClick={() => setTab("chat")}
          className={`px-4 py-2 text-sm font-semibold ${tab === "chat" ? "border-b-2 border-orange-500 text-ink" : "text-muted hover:text-ink"}`}
        >
          Chat soporte
        </button>
      </div>

      {tab === "chat" ? (
        <AdminChat />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi label="Visitas totales" value={events.length} />
            <Kpi label="Últimas 24h" value={views24h} />
            <Kpi label="Mensajes de contacto" value={submissions.length} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="text-lg font-bold mb-3">Páginas más visitadas</h2>
              {topPaths.length === 0 && <p className="text-sm text-muted">Sin datos.</p>}
              <div className="space-y-2">
                {topPaths.map(([path, count]) => (
                  <div key={path} className="flex items-center gap-3">
                    <span className="w-40 truncate text-xs text-ink-soft" title={path}>
                      {path}
                    </span>
                    <div className="flex-1 h-2 rounded bg-paper-2 overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="text-lg font-bold mb-3">Actividad reciente</h2>
              <div className="space-y-1 max-h-64 overflow-y-auto text-xs">
                {events.slice(0, 25).map((e) => (
                  <div key={e.id} className="flex justify-between gap-2 border-b border-line py-1">
                    <span className="truncate text-ink-soft">{e.path}</span>
                    <span className="text-muted whitespace-nowrap">
                      {new Date(e.created_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                ))}
                {events.length === 0 && <p className="text-muted">Sin eventos.</p>}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <h2 className="text-lg font-bold mb-4">Mensajes de contacto</h2>
            {submissions.length === 0 && <p className="text-sm text-muted">Sin mensajes.</p>}
            <div className="space-y-3">
              {submissions.map((s) => (
                <div key={s.id} className="rounded-xl border border-line bg-paper-2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <p className="font-semibold text-ink">
                      {s.name} <span className="text-muted font-normal">&lt;{s.email}&gt;</span>
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(s.created_at).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <p className="text-sm text-ink-soft whitespace-pre-wrap">{s.message}</p>
                </div>
              ))}
            </div>
          </div>

          {lastRefresh && (
            <p className="text-xs text-muted">
              Última actualización: {lastRefresh.toLocaleString("es-ES")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 text-center">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-4xl font-bold text-orange-500">{value}</p>
    </div>
  );
}