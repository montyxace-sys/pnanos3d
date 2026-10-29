/**
 * Genera imágenes de marcador de posición (SVG) en /public/img.
 * Sustitúyelas por las fotos reales manteniendo los mismos nombres de archivo.
 *
 *   npm run placeholders
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/img");

/** @type {Array<{name: string, label: string, w: number, h: number}>} */
const images = [
  ...make("cocina", ["Cocina 01", "Cocina 02", "Cocina 03", "Cocina 04", "Cocina 05", "Cocina 06"], 1600, 1067),
  ...make("bano", ["Baño 01", "Baño 02", "Baño 03", "Baño 04"], 1600, 1067),
  ...make("estancia", ["Estancia 01", "Estancia 02", "Estancia 03"], 1600, 1067),
  ...make("board", ["Board 01", "Board 02", "Board 03", "Board 04", "Board 05", "Board 06", "Board 07", "Board 08"], 800, 568),
  { name: "proceso", label: "Consulta de proyecto", w: 1400, h: 933 },
  { name: "detalles", label: "Detalle de acabados", w: 1400, h: 933 },
  { name: "retrato", label: "Retrato profesional", w: 900, h: 900 },
];

function make(prefix, labels, w, h) {
  return labels.map((label, i) => ({
    name: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    label,
    w,
    h,
  }));
}

const palette = ["#e8e3da", "#dfdcd4", "#e4e6e2", "#e9e2df", "#e0e4e9", "#e6e6e0"];

mkdirSync(outDir, { recursive: true });

images.forEach((img, i) => {
  const bg = palette[i % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.w}" height="${img.h}" viewBox="0 0 ${img.w} ${img.h}" role="img" aria-label="${img.label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#cfcabf"/>
    </linearGradient>
    <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="40" height="40" fill="none"/>
      <path d="M0 0V40" stroke="#00000010" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${img.w}" height="${img.h}" fill="url(#g)"/>
  <rect width="${img.w}" height="${img.h}" fill="url(#p)"/>
  <rect x="24" y="24" width="${img.w - 48}" height="${img.h - 48}" fill="none" stroke="#00000025" stroke-width="2"/>
  <text x="50%" y="49%" text-anchor="middle" font-family="Georgia, serif" font-size="${Math.round(img.w / 18)}" fill="#4a4741">${img.label}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(img.w / 42)}" fill="#6b675f">imagen de muestra · sustituir por foto real</text>
</svg>
`;
  writeFileSync(resolve(outDir, `${img.name}.svg`), svg, "utf8");
});

// El logotipo `public/img/logo.svg` es un SVG a mano (no se genera aquí para no
// sobrescribirlo). Si cambias la marca, edita ese fichero directamente.

console.log(`Generadas ${images.length} imágenes en public/img`);
