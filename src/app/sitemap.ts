import type { MetadataRoute } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"
).replace(/\/$/, "");

// Con output: "export" estas rutas de metadatos deben resolverse en build.
export const dynamic = "force-static";

const routes = [
  "/",
  "/proceso/",
  "/proyectos/",
  "/herramientas/plano/",
  "/credenciales/",
  "/contacto/",
  "/privacidad/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "/" : route}`,
    lastModified: now,
    changeFrequency: route === "/" || route === "/proyectos/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
