// Edge function: analytics-ingest
// Recibe visitas/enventos del frontend y los inserta en analytics_events con Service Role
// (evita depender de PostgREST para el navegador y problemas de schema cache).
//
// Se permite llamada anónima desde el navegador (cors *). Throttle ligeramente en cliente.

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  let payload: any;
  try { payload = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }

  const path = String(payload.path ?? "").trim().slice(0, 400);
  if (!path) return json({ ok: false, error: "invalid_payload" }, 400);
  const referrer = payload.referrer ? String(payload.referrer).slice(0, 500) : null;
  const sessionId = payload.session_id ? String(payload.session_id).slice(0, 120) : null;
  const deviceType = payload.device_type ? String(payload.device_type).slice(0, 40) : null;

  const sUrl = Deno.env.get("SUPABASE_URL");
  const sKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY");
  if (!sUrl || !sKey) return json({ ok: false, error: "not_configured" }, 503);

  try {
    const res = await fetch(`${sUrl}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: sKey,
        Authorization: `Bearer ${sKey}`,
      },
      body: JSON.stringify({ path, referrer, session_id: sessionId, device_type: deviceType }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("analytics-ingest insert fail", res.status, detail);
      return json({ ok: false, error: "insert_failed" }, 502);
    }
  } catch (e) {
    console.error("analytics-ingest network error", e);
    return json({ ok: false, error: "network_error" }, 502);
  }

  return json({ ok: true });
});