import type { MetadataRoute } from "next";
import { siteUrl } from "./sitemap";

// Con output: "export" estas rutas de metadatos deben resolverse en build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
