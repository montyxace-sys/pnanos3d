import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)), "out");
const PORT = 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
    let file = join(root, pathname);
    if (pathname.endsWith("/")) {
      file = join(file, "index.html");
    } else {
      try {
        if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      } catch {
        // no es un directorio
      }
    }
    const data = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "pragma": "no-cache",
      "expires": "0",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
  }
}).listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}/`);
});