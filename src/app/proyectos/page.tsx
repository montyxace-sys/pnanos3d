import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import ProjectGallery from "@/components/ProjectGallery";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Galería de proyectos realizados, con filtro por tipología y visor ampliado.",
};

export default async function ProyectosPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">Galería</p>
      <h1 className="mt-3 text-4xl">Proyectos destacados</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
        Filtra por tipología y pulsa cualquier imagen para verla ampliada. Las fotografías
        definitivas y las fichas de cada obra se cargan desde los datos del estudio.
      </p>

      {projects.source === "supabase" ? (
        <p className="mt-4 inline-block border border-line bg-paper-2 px-3 py-1.5 text-xs text-muted">
          Datos sincronizados desde Supabase.
        </p>
      ) : null}

      <div className="mt-10">
        <ProjectGallery
          categories={projects.categories}
          projects={projects.projects}
          boards={projects.boards}
        />
      </div>
    </div>
  );
}
