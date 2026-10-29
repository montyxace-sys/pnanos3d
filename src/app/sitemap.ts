import type { MetadataRoute } from "next";

// Con output: "export" estas rutas de metadatos deben resolverse en build.
export const dynamic = "force-static";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, "");
}

const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${siteUrl()}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  }));
}