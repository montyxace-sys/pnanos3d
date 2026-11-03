// Edge Function: admin-insights
// Devuelve las últimas vistas y contactos para el panel admin (Service Role).
// Evita el uso directo de PostgREST desde el navegador (y sus problemas de schema cache).

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  const sUrl = Deno.env.get("SUPABASE_URL");
  const sKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SERVICE_ROLE_KEY");
  if (!sUrl || !sKey) return json({ ok: false, error: "not_configured" }, 503);

  const h = { "Content-Type": "application/json", apikey: sKey, Authorization: `Bearer ${sKey}` };

  const [evRes, subRes, insRes] = await Promise.all([
    fetch(`${sUrl}/rest/v1/analytics_events?select=*&order=created_at.desc&limit=5000`, { headers: h }),
    fetch(`${sUrl}/rest/v1/contact_submissions?select=*&order=created_at.desc&limit=100`, { headers: h }),
    fetch(`${sUrl}/rest/v1/analytics_events?select=id`, { headers: { ...h } }),
  ]);

  const evText = await evRes.text();
  const subText = await subRes.text();

  if (!evRes.ok || !subRes.ok) {
    console.error("admin-insights fail", evRes.status, evText, subRes.status, subText);
    return json({ ok: false, error: "load_failed", details: evText || subText }, 502);
  }

  const j = (t: string) => (t ? JSON.parse(t) : []);
  return json({
    ok: true,
    events: j(evText),
    submissions: j(subText),
  });
});