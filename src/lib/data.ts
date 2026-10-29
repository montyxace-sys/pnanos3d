import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

export type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  summary?: string;
};

export type ProjectsData = {
  categories: { id: string; label: string }[];
  projects: Project[];
  boards: { id: string; title: string; image: string }[];
  source: "supabase" | "local";
};

export type ProcessData = {
  ordinalName: string;
  ordinals: { key: string; title: string; text: string }[];
  steps: { code: string; title: string; text: string; detail: string }[];
  note: string;
};

export type CredentialsData = {
  sections: { title: string; items: string[] }[];
  pendingNote: string;
};

export type SiteData = {
  siteName: string;
  siteFullName: string;
  tagline: string;
  description: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: string[];
  social: { label: string; href: string }[];
  channels: { label: string; note?: string; href: string }[];
};

const contentDir = join(process.cwd(), "src", "content");

async function readJson<T>(file: string): Promise<T> {
  const raw = await readFile(join(contentDir, file), "utf8");
  return JSON.parse(raw) as T;
}

type LocalProjects = {
  categories: ProjectsData["categories"];
  projects: Project[];
  boards: ProjectsData["boards"];
};

/**
 * Proyectos y galería.
 * 1. Si hay Supabase configurado, intenta leer la tabla `projects`.
 * 2. Si falla (sin credenciales, sin red, tabla vacía), usa el JSON local.
 */
export async function getProjects(): Promise<ProjectsData> {
  const local = await readJson<LocalProjects>("projects.json");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { ...local, source: "local" };
  }

  try {
    const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("projects")
      .select("id,title,category,image,summary,sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return { ...local, source: "local" };
    }

    const categories = Array.from(
      new Set(data.map((row) => String(row.category ?? "otros"))),
    ).map((id) => ({
      id,
      label: local.categories.find((c) => c.id === id)?.label ?? id,
    }));

    return {
      categories,
      boards: local.boards,
      projects: data.map((row) => ({
        id: String(row.id),
        title: String(row.title ?? ""),
        category: String(row.category ?? "otros"),
        image: String(row.image ?? ""),
        summary: row.summary ? String(row.summary) : undefined,
      })),
      source: "supabase",
    };
  } catch {
    return { ...local, source: "local" };
  }
}

export async function getProcess(): Promise<ProcessData> {
  return readJson<ProcessData>("process.json");
}

export async function getCredentials(): Promise<CredentialsData> {
  return readJson<CredentialsData>("credentials.json");
}

export async function getSite(): Promise<SiteData> {
  return readJson<SiteData>("site.json");
}
