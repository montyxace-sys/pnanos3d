"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { BarChart, LineChart, DonutChart } from "@/components/Charts";
import { Eye, Users, Globe, Monitor, Smartphone, Tablet, TrendingUp, Calendar, MapPin } from "lucide-react";
import AdminChat from "@/components/AdminChat";
import GoogleTools from "@/components/GoogleTools";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Event = { id: number; path: string; referrer: string | null; session_id: string | null; device_type: string | null; created_at: string };
type Submission = { id: number; name: string; email: string; message: string; created_at: string };

type Range = "7d" | "30d" | "90d";

const DEVICE_ICONS: Record<string, typeof Smartphone> = {
  Escritorio: Monitor,
  Móvil: Smartphone,
  Tablet: Tablet,
};

const COLORS = ["#f6821f", "#0891b2", "#22c55e", "#fbbf24", "#475569", "#06b6d4"];

function getColorForIndex(i: number): string {
  return COLORS[i % COLORS.length];
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [tab, setTab] = useState<"stats" | "chat" | "google">("stats");
  const [range, setRange] = useState<Range>("30d");

  async function load() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError("Supabase no configurado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const [evRes, subRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/analytics_events?select=*&order=created_at.desc&limit=5000`, {
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
  }, [range]);

  const metrics = useMemo(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const filtered = events.filter((e) => new Date(e.created_at).getTime() >= Date.now() - days * 86400000);
    const totalVisits = filtered.length;
    const uniqueVisitors = new Set(filtered.map((v) => v.session_id || String(v.id))).size;
    const avgPerVisitor = uniqueVisitors > 0 ? (totalVisits / uniqueVisitors).toFixed(1) : "0";

    const nowD = new Date();
    const dayMap = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(nowD.getTime() - i * 86400000);
      dayMap.set(d.toISOString().slice(0, 10), 0);
    }
    filtered.forEach((v) => {
      const key = v.created_at.slice(0, 10);
      if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) || 0) + 1);
    });
    const trend = Array.from(dayMap.entries()).map(([key, value]) => {
      const d = new Date(key);
      if (days <= 7) {
        const labels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        return { label: labels[d.getDay()], value };
      }
      return { label: `${d.getDate()}/${d.getMonth() + 1}`, value };
    });

    const pageMap = new Map<string, number>();
    filtered.forEach((v) => {
      const p = v.path || "/";
      pageMap.set(p, (pageMap.get(p) || 0) + 1);
    });
    const pages = Array.from(pageMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const deviceMap = new Map<string, number>();
    filtered.forEach((v) => {
      const d = (v.device_type || "desktop").toLowerCase();
      const nice = d === "mobile" ? "Móvil" : d === "tablet" ? "Tablet" : "Escritorio";
      deviceMap.set(nice, (deviceMap.get(nice) || 0) + 1);
    });
    const devices = (["Escritorio", "Móvil", "Tablet"] as const)
      .map((label) => ({
        label,
        value: deviceMap.get(label) || 0,
        color: label === "Escritorio" ? "#0891b2" : label === "Móvil" ? "#f97316" : "#22c55e",
      }))
      .filter((d) => d.value > 0);

    const refMap = new Map<string, number>();
    filtered.forEach((v) => {
      if (v.referrer) {
        try {
          const url = new URL(v.referrer);
          const host = url.hostname || "Otros";
          refMap.set(host, (refMap.get(host) || 0) + 1);
        } catch {
          refMap.set("Otros", (refMap.get("Otros") || 0) + 1);
        }
      } else {
        refMap.set("Acceso directo", (refMap.get("Acceso directo") || 0) + 1);
      }
    });
    const referrers = Array.from(refMap.entries())
      .map(([label, value], i) => ({ label, value, color: getColorForIndex(i) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const hourMap = new Array(24).fill(0);
    filtered.forEach((v) => {
      const h = new Date(v.created_at).getHours();
      hourMap[h]++;
    });
    const hourly = hourMap.map((value, h) => ({ label: h % 3 === 0 ? `${h}h` : "", value }));

    const dowMap = new Array(7).fill(0);
    filtered.forEach((v) => {
      const d = new Date(v.created_at).getDay();
      dowMap[d]++;
    });
    const dowLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const dow = dowLabels.map((label, i) => ({ label, value: dowMap[i] }));

    return { totalVisits, uniqueVisitors, avgPerVisitor, trend, pages, devices, referrers, hourly, dow };
  }, [events]);

  const ranges: { id: Range; label: string }[] = [
    { id: "7d", label: "7 días" },
    { id: "30d", label: "30 días" },
    { id: "90d", label: "90 días" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-ink">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Panel de administración</h1>
        <div className="flex gap-2">
          <Link href="/" className="rounded border border-line bg-paper px-3 py-1.5 text-sm hover:bg-paper-2">
            Volver al inicio
          </Link>
        </div>
      </div>

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
        <button
          onClick={() => setTab("google")}
          className={`px-4 py-2 text-sm font-semibold ${tab === "google" ? "border-b-2 border-orange-500 text-ink" : "text-muted hover:text-ink"}`}
        >
          Herramientas Google
        </button>
      </div>

      {tab === "chat" ? (
        <AdminChat />
      ) : tab === "google" ? (
        <GoogleTools />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-muted text-sm">Comportamiento y procedencia de los visitantes</p>
            </div>
            <div className="flex gap-2">
              {ranges.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    range === r.id ? "bg-orange-500 text-gray-900" : "bg-paper text-ink-soft border border-line hover:bg-paper-2"
                  }`}
                >
                  {r.label}
                </button>
              ))}
              <button onClick={load} disabled={loading} className="rounded-xl bg-paper border border-line px-3 py-2 text-sm hover:bg-paper-2 disabled:opacity-50">
                {loading ? "…" : "↻"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Visitas totales" value={metrics.totalVisits} />
            <MetricCard label="Visitantes únicos" value={metrics.uniqueVisitors} />
            <MetricCard label="Páginas/visitante" value={metrics.avgPerVisitor} />
            <MetricCard label="Periodo" value={ranges.find((r) => r.id === range)?.label || ""} />
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-ink">Tendencia de visitas</h3>
            </div>
            {metrics.totalVisits > 0 ? (
              <LineChart data={metrics.trend} height={240} color="#f6821f" />
            ) : (
              <div className="flex items-center justify-center py-12 text-muted text-sm">Sin datos en este periodo</div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-ink">Dispositivos</h3>
              </div>
              {metrics.devices.length > 0 ? (
                <>
                  <DonutChart data={metrics.devices} size={140} />
                  <div className="mt-4 space-y-2">
                    {metrics.devices.map((d) => {
                      const Icon = DEVICE_ICONS[d.label] || Monitor;
                      return (
                        <div key={d.label} className="flex items-center gap-2 text-sm">
                          <Icon className="w-4 h-4 text-muted" />
                          <span className="text-ink-soft flex-1">{d.label}</span>
                          <span className="font-semibold text-ink">{d.value}</span>
                          <span className="text-muted text-xs w-10 text-right">
                            {Math.round((d.value / metrics.totalVisits) * 100)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-12 text-muted text-sm">Sin datos</div>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-ink">Procedencia</h3>
              </div>
              {metrics.referrers.length > 0 ? (
                <div className="space-y-2.5">
                  {metrics.referrers.map((r) => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: r.color }} />
                      <span className="text-sm text-ink-soft flex-1 truncate">{r.label}</span>
                      <span className="font-semibold text-ink text-sm">{r.value}</span>
                      <span className="text-muted text-xs w-10 text-right">
                        {Math.round((r.value / metrics.totalVisits) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-muted text-sm">Sin datos</div>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-line bg-paper p-5">
              <h3 className="font-bold text-ink mb-4">Visitas por hora del día</h3>
              {metrics.totalVisits > 0 ? (
                <BarChart data={metrics.hourly} height={200} color="#f6821f" />
              ) : (
                <div className="flex items-center justify-center py-12 text-muted text-sm">Sin datos</div>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-paper p-5">
              <h3 className="font-bold text-ink mb-4">Visitas por día de la semana</h3>
              {metrics.totalVisits > 0 ? (
                <BarChart data={metrics.dow} height={200} color="#0891b2" />
              ) : (
                <div className="flex items-center justify-center py-12 text-muted text-sm">Sin datos</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-ink">Páginas más visitadas</h3>
            </div>
            {metrics.pages.length > 0 ? (
              <div className="space-y-2.5">
                {metrics.pages.map((p) => {
                  const maxVal = metrics.pages[0].value;
                  return (
                    <div key={p.label} className="flex items-center gap-3">
                      <span className="text-sm text-ink-soft w-32 truncate flex-shrink-0">{p.label}</span>
                      <div className="flex-1 h-6 bg-paper-2 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-orange-500/80 rounded-lg transition-all duration-500"
                          style={{ width: `${(p.value / maxVal) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-ink text-sm w-10 text-right">{p.value}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted text-sm">Sin datos</div>
            )}
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

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 text-center">
      <div className="text-2xl font-bold text-orange-500">{value}</div>
      <div className="text-sm text-muted mt-0.5">{label}</div>
    </div>
  );
}