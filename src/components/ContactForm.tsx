"use client";

import { useMemo, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { withBase } from "@/lib/base";
import type { SiteData } from "@/lib/data";

/** Límites espejo de las restricciones definidas en las migraciones de Supabase. */
const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 255 },
  phone: { max: 30 },
  projectType: { max: 40 },
  message: { min: 10, max: 2000 },
} as const;

// RFC 5322 simplificado, suficiente para validar en cliente.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldKey = "name" | "email" | "phone" | "projectType" | "message";

type Values = Record<FieldKey, string>;

const EMPTY: Values = { name: "", email: "", phone: "", projectType: "", message: "" };

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

const PROJECT_TYPES = [
  { value: "", label: "Selecciona una opción" },
  { value: "cocina", label: "Cocina" },
  { value: "bano", label: "Baño" },
  { value: "estancia", label: "Otra estancia" },
  { value: "vivienda-completa", label: "Vivienda completa" },
  { value: "por-definir", label: "Aún no lo tengo claro" },
];

function validate(values: Values): Partial<Record<FieldKey, string>> {
  const errors: Partial<Record<FieldKey, string>> = {};

  const name = values.name.trim();
  if (name.length < LIMITS.name.min) {
    errors.name = `Indica tu nombre (mínimo ${LIMITS.name.min} caracteres).`;
  } else if (name.length > LIMITS.name.max) {
    errors.name = `El nombre no puede superar los ${LIMITS.name.max} caracteres.`;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Necesitamos tu email para responderte.";
  } else if (email.length > LIMITS.email.max) {
    errors.email = `La dirección de email no puede superar los ${LIMITS.email.max} caracteres.`;
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Introduce un email válido, por ejemplo nombre@dominio.com.";
  }

  const phone = values.phone.trim();
  if (phone && phone.length > LIMITS.phone.max) {
    errors.phone = `El teléfono no puede superar los ${LIMITS.phone.max} caracteres.`;
  }

  const projectType = values.projectType;
  if (projectType.length > LIMITS.projectType.max) {
    errors.projectType = "Valor de tipo de proyecto no válido.";
  }

  const message = values.message.trim();
  if (message.length < LIMITS.message.min) {
    errors.message = `Cuéntanos algo más (mínimo ${LIMITS.message.min} caracteres).`;
  } else if (message.length > LIMITS.message.max) {
    errors.message = `El mensaje no puede superar los ${LIMITS.message.max} caracteres.`;
  }

  return errors;
}

export default function ContactForm({ site }: { site: SiteData }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fieldError = useMemo(
    () => (key: FieldKey) => (submitAttempted ? errors[key] : undefined),
    [errors, submitAttempted],
  );

  const statusIsSending = status.state === "sending";

  function setField(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // El error se conserva hasta que el usuario vuelve a escribir en el campo.
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (status.state === "error") setStatus({ state: "idle" });
  }

  function describedBy(key: FieldKey): string | undefined {
    const parts: string[] = [];
    if (fieldError(key)) parts.push(`${key}-error`);
    if (key === "message") parts.push("message-hint");
    if (key === "email") parts.push("email-hint");
    return parts.length ? parts.join(" ") : undefined;
  }

  /** `id`, `name` y límite de longitud: el resto (aria) se pasa explícito en cada campo. */
  function inputProps(key: FieldKey) {
    const maxLength =
      key === "name"
        ? LIMITS.name.max
        : key === "email"
          ? LIMITS.email.max
          : key === "phone"
            ? LIMITS.phone.max
            : LIMITS.message.max;
    return { id: key, name: key, maxLength } as const;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus({ state: "idle" });
      const first = (Object.keys(found) as FieldKey[])[0];
      document.getElementById(first)?.focus();
      return;
    }

    setStatus({ state: "sending" });

    const supabase = getSupabase();
    if (!supabase) {
      setStatus({
        state: "error",
        message: `El formulario todavía no está conectado (faltan credenciales de Supabase). Puedes escribirnos directamente a ${site.email}.`,
      });
      return;
    }

    try {
      // Timeout explícito: si la red se cuelga, no dejamos el formulario en "Enviando…".
      const timeoutSignal = AbortSignal.timeout(15000);

      const { error } = await supabase
        .from("contact_requests")
        .insert({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim() || null,
          project_type: values.projectType || null,
          message: values.message.trim(),
          source: "web-contacto",
        })
        .abortSignal(timeoutSignal);

      if (error) {
        const errorName = "name" in error ? String((error as { name?: unknown }).name ?? "") : "";
        const aborted =
          errorName === "AbortError" ||
          errorName === "TimeoutError" ||
          /abort|timeout/i.test(error.message);
        setStatus({
          state: "error",
          message: aborted
            ? "Se ha agotado el tiempo de espera del servidor. Tus datos siguen en el formulario: inténtalo de nuevo."
            : error.code === "23505"
              ? "Ya existe una solicitud con estos datos. Modifica algún campo y vuelve a intentarlo."
              : `No hemos podido registrar la solicitud (${error.message}). Corrige lo indicado o inténtalo de nuevo.`,
        });
        return;
      }

      // Aviso por email (Resend) vía Edge Function: mejor esfuerzo, no bloquea.
      const fnUrl = process.env.NEXT_PUBLIC_CONTACT_FUNCTION_URL;
      if (fnUrl) {
        try {
          await fetch(fnUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: values.name.trim(),
              email: values.email.trim(),
              message: values.message.trim(),
            }),
            signal: AbortSignal.timeout(10000),
          });
        } catch {
          // El registro ya está guardado: no convertimos un fallo de aviso en error.
        }
      }

      setValues(EMPTY);
      setErrors({});
      setSubmitAttempted(false);
      formRef.current?.reset();
      setStatus({
        state: "success",
        message: "Solicitud enviada. Nos pondremos en contacto contigo para confirmar los detalles.",
      });
    } catch (err) {
      const isAbort =
        err instanceof Error &&
        (err.name === "AbortError" || err.name === "TimeoutError" || /abort|timeout/i.test(err.message));
      const isNetwork = err instanceof TypeError || (err instanceof Error && /fetch|network/i.test(err.message));
      setStatus({
        state: "error",
        message: isAbort
          ? "Se ha agotado el tiempo de espera. Tus datos siguen en el formulario: inténtalo de nuevo."
          : isNetwork
            ? "No hay conexión con el servidor. Revisa tu red e inténtalo de nuevo; tu mensaje se mantiene en el formulario."
            : "Se ha producido un error inesperado al enviar. Inténtalo de nuevo en unos instantes.",
      });
    }
  }

  const errorId = (key: FieldKey) => `${key}-error`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5" aria-busy={statusIsSending}>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Nombre <span aria-hidden className="text-accent">*</span>
        </label>
        <input
          {...inputProps("name")}
          type="text"
          autoComplete="name"
          required
          minLength={LIMITS.name.min}
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
          disabled={statusIsSending}
          className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:bg-paper-2"
          aria-describedby={describedBy("name")}
          aria-invalid={Boolean(fieldError("name")) || undefined}
        />
        {fieldError("name") ? (
          <p id={errorId("name")} role="alert" className="mt-1 text-sm text-red-700">
            {fieldError("name")}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email <span aria-hidden className="text-accent">*</span>
          </label>
          <input
            {...inputProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            disabled={statusIsSending}
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:bg-paper-2"
            aria-describedby={describedBy("email")}
            aria-invalid={Boolean(fieldError("email")) || undefined}
          />
          <p id="email-hint" className="mt-1 text-xs text-muted">
            Máximo {LIMITS.email.max} caracteres.
          </p>
          {fieldError("email") ? (
            <p id={errorId("email")} role="alert" className="mt-1 text-sm text-red-700">
              {fieldError("email")}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium">
            Teléfono <span className="text-muted">(opcional)</span>
          </label>
          <input
            {...inputProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            disabled={statusIsSending}
            className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:bg-paper-2"
            aria-describedby={describedBy("phone")}
            aria-invalid={Boolean(fieldError("phone")) || undefined}
          />
          {fieldError("phone") ? (
            <p id={errorId("phone")} role="alert" className="mt-1 text-sm text-red-700">
              {fieldError("phone")}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="projectType" className="mb-1 block text-sm font-medium">
          Tipo de proyecto <span className="text-muted">(opcional)</span>
        </label>
        <select
          id="projectType"
          name="projectType"
          value={values.projectType}
          onChange={(e) => setField("projectType", e.target.value)}
          disabled={statusIsSending}
          aria-invalid={Boolean(fieldError("projectType")) || undefined}
          aria-describedby={describedBy("projectType")}
          className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:bg-paper-2"
        >
          {PROJECT_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {fieldError("projectType") ? (
          <p id={errorId("projectType")} role="alert" className="mt-1 text-sm text-red-700">
            {fieldError("projectType")}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Cuéntanos tu proyecto <span aria-hidden className="text-accent">*</span>
        </label>
        <textarea
          {...inputProps("message")}
          rows={6}
          required
          minLength={LIMITS.message.min}
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          disabled={statusIsSending}
          className="w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:bg-paper-2"
          aria-describedby={describedBy("message")}
          aria-invalid={Boolean(fieldError("message")) || undefined}
        />
        <p id="message-hint" className="mt-1 text-xs text-muted">
          Entre {LIMITS.message.min} y {LIMITS.message.max} caracteres.
        </p>
        {fieldError("message") ? (
          <p id={errorId("message")} role="alert" className="mt-1 text-sm text-red-700">
            {fieldError("message")}
          </p>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Usaremos tus datos únicamente para responder a esta solicitud. Consulta la{" "}
        <a href={withBase("/privacidad/")} className="text-accent underline underline-offset-2">
          información sobre privacidad
        </a>
        .
      </p>

      {status.state === "success" ? (
        <p role="status" className="rounded border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
          {status.message}
        </p>
      ) : null}

      {status.state === "error" ? (
        <p role="alert" className="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={statusIsSending}
        className="w-full rounded bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-paper uppercase transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {statusIsSending ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
