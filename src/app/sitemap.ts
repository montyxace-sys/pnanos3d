import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://montyxace-sys.github.io/pnanos3d").replace(/\/$/, "");
}

const routes = ["/", "/electricidad/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route, index) => ({
    url: `${siteUrl()}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: index === 0 ? 1 : 0.8,
  }));
}
