// Service Worker mejorado para TusPlanos3D (network-first de rutas/RSC)
const CACHE = "tusplanos3d-v5";
const CORE = [
  "/",
  "/manifest.json",
  "/img/logo.svg",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const networkFirst =
    event.request.mode === "navigate" ||
    url.searchParams.has("_rsc") ||
    url.pathname.includes("__next.") ||
    url.pathname.endsWith(".html");
  if (networkFirst) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type !== "basic") return res;
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request).then((c) => c || caches.match("/index.html"))),
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type !== "basic") return res;
          const clone = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => undefined as any);
    }),
  );
});