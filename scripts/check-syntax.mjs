/**
 * Comprobación de sintaxis (sin tipos) de los ficheros TS/TSX del proyecto,
 * reutilizando el esbuild instalado en otro proyecto local.
 *   node scripts/check-syntax.mjs
 */
import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = join(fileURLToPath(import.meta.url), "..", "..");

let esbuild;
try {
  esbuild = require("C:/Users/Monty/Desktop/project/node_modules/esbuild");
} catch (err) {
  console.log("esbuild no disponible:", err.message);
  process.exit(0);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if ([".ts", ".tsx"].includes(extname(full))) out.push(full);
  }
  return out;
}

const files = walk(join(root, "src"));
let errors = 0;

for (const file of files) {
  try {
    await esbuild.build({
      entryPoints: [file],
      bundle: false,
      write: false,
      logLevel: "silent",
      format: "esm",
      platform: "neutral",
      jsx: "preserve",
      loader: { ".ts": "ts", ".tsx": "tsx" },
    });
  } catch (err) {
    errors++;
    console.log(`SINTAXIS: ${file}`);
    for (const e of err.errors ?? []) {
      console.log(`  línea ${e.location?.line}: ${e.text}`);
    }
  }
}

console.log(`Comprobados ${files.length} ficheros, errores de sintaxis: ${errors}`);
