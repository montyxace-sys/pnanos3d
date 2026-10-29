/**
 * Utilidades para trabajar con NEXT_PUBLIC_BASE_PATH
 * (necesario cuando el sitio se publica en GitHub Pages como project page).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefija rutas de assets/HTML con la basePath cuando esté definida. */
export function withBase(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!basePath) return normalized;
  if (normalized === "/") return `${basePath}/`;
  return `${basePath}${normalized}`;
}
