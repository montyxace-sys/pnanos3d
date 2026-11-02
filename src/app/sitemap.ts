import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tusplanos3d.es").replace(/\/$/, "");
}

type RouteConfig = {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

const routes: RouteConfig[] = [
  { path: "/",               priority: 1.0, changeFrequency: "weekly"  },
  { path: "/electricidad/",  priority: 0.9, changeFrequency: "weekly"  },
  { path: "/climatizacion/", priority: 0.8, changeFrequency: "weekly"  },
  { path: "/ayuda/",         priority: 0.6, changeFrequency: "monthly" },
  { path: "/contacto/",      priority: 0.7, changeFrequency: "monthly" },
  { path: "/aviso-legal/",   priority: 0.2, changeFrequency: "yearly"  },
  { path: "/cookies/",       priority: 0.2, changeFrequency: "yearly"  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl()}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
