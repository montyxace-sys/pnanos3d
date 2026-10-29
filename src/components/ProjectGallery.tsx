"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/data";
import { withBase } from "@/lib/base";

type Props = {
  categories: { id: string; label: string }[];
  projects: Project[];
  boards?: { id: string; title: string; image: string }[];
};

/**
 * Galería con filtro por categoría y visor ampliado (lightbox).
 * El contenido llega como prop desde el servidor (datos dinámicos).
 */
export default function ProjectGallery({ categories, projects, boards = [] }: Props) {
  const [active, setActive] = useState<string>("todos");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const filtered =
    active === "todos" ? projects : projects.filter((p) => p.category === active);

  const close = useCallback(() => setOpenIndex(null), []);
  const go = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + filtered.length) % filtered.length;
      });
    },
    [filtered.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, go]);

  const current = openIndex !== null ? filtered[openIndex] : null;

  return (
    <div>
      {/* Filtro */}
      <div
        role="group"
        aria-label="Filtrar proyectos"
        className="mb-8 flex flex-wrap gap-2 border-b border-line pb-4"
      >
        {[{ id: "todos", label: "Todo" }, ...categories].map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setActive(cat.id);
                setOpenIndex(null);
              }}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition ${
                isActive
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink-soft hover:border-accent-bright hover:text-accent"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Rejilla de proyectos */}
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, index) => (
          <li key={project.id} className="group">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="block w-full overflow-hidden border border-line bg-paper-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={`Ampliar ${project.title}`}
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={withBase(`/img/${project.image}`)}
                  alt={project.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="border-t border-line px-4 py-3">
                <p className="font-serif text-base">{project.title}</p>
                {project.summary ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{project.summary}</p>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="border border-dashed border-line px-6 py-10 text-center text-muted">
          No hay proyectos en esta categoría todavía.
        </p>
      ) : null}

      {/* Design boards */}
      {boards.length > 0 ? (
        <section aria-labelledby="boards" className="mt-16">
          <h2 id="boards" className="text-2xl">
            Tableros de diseño
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Selección de propuestas de acabados y mobiliario. Pulsá una imagen para verla
            ampliada.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {boards.map((board) => (
              <li key={board.id}>
                <figure className="border border-line bg-paper-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBase(`/img/${board.image}`)}
                    alt={board.title}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <figcaption className="border-t border-line px-3 py-2 text-xs text-ink-soft">
                    {board.title}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Visor ampliado */}
      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-ink/95 p-4 md:p-8"
          onClick={close}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-lg text-paper">{current.title}</p>
              {current.summary ? (
                <p className="mt-1 max-w-xl text-sm text-paper/70">{current.summary}</p>
              ) : null}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="rounded border border-paper/40 px-3 py-1.5 text-sm text-paper hover:bg-paper/10"
            >
              Cerrar (Esc)
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center gap-4 py-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Imagen anterior"
              className="h-11 w-11 shrink-0 rounded-full border border-paper/40 text-paper hover:bg-paper/10"
            >
              ‹
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBase(`/img/${current.image}`)}
              alt={current.title}
              className="max-h-[70vh] w-auto max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Imagen siguiente"
              className="h-11 w-11 shrink-0 rounded-full border border-paper/40 text-paper hover:bg-paper/10"
            >
              ›
            </button>
          </div>

          <p className="text-center text-xs text-paper/60">
            {openIndex! + 1} de {filtered.length}
          </p>
        </div>
      ) : null}
    </div>
  );
}
