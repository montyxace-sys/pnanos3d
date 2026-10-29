// Supabase Edge Function: contact-notify
// Recibe la confirmación del formulario y envía un aviso por email con Resend.
// La API key de Resend vive como secret de Supabase, nunca en el navegador.
//
// Secrets requeridos:
//   RESEND_API_KEY       clave de API de Resend
//   CONTACT_TO_EMAIL     destinatario de los avisos
//   CONTACT_FROM_EMAIL   remitente verificado en Resend
//   ALLOWED_ORIGIN       (opcional) origen permitido; por defecto "*"
//
// Despliegue (no ejecutado en este repositorio):
//   supabase functions deploy contact-notify
//   supabase secrets set RESEND_API_KEY=... CONTACT_TO_EMAIL=... CONTACT_FROM_EMAIL=...

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  let payload: { name?: unknown; email?: unknown; message?: unknown };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const name = String(payload.name ?? "").trim().slice(0, 100);
  const email = String(payload.email ?? "").trim().slice(0, 255);
  const message = String(payload.message ?? "").trim().slice(0, 2000);

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return json({ ok: false, error: "invalid_payload" }, 400);
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("CONTACT_TO_EMAIL");
  const from = Deno.env.get("CONTACT_FROM_EMAIL");

  if (!apiKey || !to || !from) {
    console.error("contact-notify: faltan secrets (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)");
    return json({ ok: false, error: "not_configured" }, 503);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Nueva solicitud de contacto: ${name}`,
        text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}\n`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("contact-notify: error de Resend", res.status, detail);
      return json({ ok: false, error: "resend_failed" }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("contact-notify: fallo de red", err);
    return json({ ok: false, error: "network_error" }, 502);
  }
});
