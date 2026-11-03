"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { question: `${a} + ${b}`, answer: a + b };
}

export default function ContactoClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Anti-spam: honeypot check
    if (honeypot.trim() !== "") {
      // Bot detected - silently reject
      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      return;
    }

    // Anti-spam: captcha check
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      setError("Respuesta incorrecta a la verificación anti-spam.");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      if (!SUPABASE_URL) {
        // Fallback: mailto
        window.location.href = `mailto:info@tusplanos3d.es?subject=Contacto: ${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nDe: " + name + " <" + email + ">")}`;
        setStatus("ok");
        return;
      }

      const res = await fetch(`${SUPABASE_URL}/functions/v1/contact-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, captchaAnswer: parseInt(captchaInput, 10), captchaExpected: captcha.answer }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al enviar");
      }

      setStatus("ok");
      setName("");
      setEmail("");
      setMessage("");
      setCaptchaInput("");
      setCaptcha(generateCaptcha());
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 text-ink">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Contacto</p>
      <h1 className="mt-3 text-3xl font-bold">¿Tienes alguna pregunta?</h1>
      <p className="mt-4 text-sm text-ink-soft">
        Rellena el formulario y te responderemos en menos de 24 horas. También puedes escribirnos a{" "}
        <a href="mailto:info@tusplanos3d.es" className="text-accent underline">
          info@tusplanos3d.es
        </a>
        .
      </p>

      {status === "ok" ? (
        <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="text-lg font-semibold text-green-300">¡Mensaje enviado!</p>
          <p className="mt-2 text-sm text-ink-soft">Te responderemos lo antes posible.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-orange-400"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-orange-400 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-orange-400 focus:outline-none"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mensaje</label>
            <textarea
              required
              minLength={10}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-orange-400 focus:outline-none resize-none"
              placeholder="Escribe tu mensaje (mínimo 10 caracteres)..."
            />
          </div>

          {/* Honeypot anti-spam (oculto para humanos, los bots lo rellenan) */}
          <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
            <label htmlFor="website">No rellenar este campo</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Captcha anti-spam */}
          <div className="rounded-lg border border-line bg-paper/80 p-4">
            <label className="block text-sm font-medium mb-2">
              Verificación anti-spam: ¿Cuánto es{" "}
              <strong className="text-orange-400">{captcha.question}</strong>?
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-orange-400 focus:outline-none"
              placeholder="Respuesta"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded bg-orange-500 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-orange-400 disabled:opacity-50"
          >
            {status === "sending" ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      )}

      <div className="mt-12 border-t border-line pt-6">
        <h2 className="text-lg font-semibold">Otros canales</h2>
        <div className="mt-3 space-y-2 text-sm text-ink-soft">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:info@tusplanos3d.es" className="text-accent underline">
              info@tusplanos3d.es
            </a>
          </p>
          <p>
            <strong>Teléfono:</strong>{" "}
            <a href="tel:+34600000000" className="text-accent underline">
              +34 600 000 000
            </a>
          </p>
        </div>
        <div className="mt-6">
          <Link href="/" className="text-sm text-accent underline">
            Volver al generador de planos
          </Link>
        </div>
      </div>
    </div>
  );
}