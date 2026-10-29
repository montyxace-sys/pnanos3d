import type { NextConfig } from "next";

/**
 * Static export para GitHub Pages.
 * NEXT_PUBLIC_BASE_PATH debe ajustarse al nombre del repositorio
 * cuando se publique como project page (p. ej. /mi-repo).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath === "" ? undefined : basePath,
  trailingSlash: true,
  images: {
    // GitHub Pages no ejecuta el optimizador de imágenes de Next.
    unoptimized: true,
  },
};

export default nextConfig;
