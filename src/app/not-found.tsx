import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Error 404</p>
      <h1 className="mt-3 text-4xl">Esta página no existe</h1>
      <p className="mt-4 text-sm text-muted">
        Puede que el enlace esté desactualizado o que la dirección esté mal escrita.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded bg-ink px-6 py-3 text-sm font-semibold tracking-wide text-paper uppercase transition hover:bg-accent"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
