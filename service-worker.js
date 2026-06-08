/*
 * Pyydys offline service worker.
 *
 * Strategy:
 *   - On install, pre-cache the app shell (index.html + manifest + icons).
 *   - For navigation requests, serve index.html from cache (SPA shell).
 *   - For static assets, use cache-first with a network update fallback.
 *   - On activate, drop any old cache versions.
 *
 * The CACHE_NAME version string is replaced on every build by the
 * register-sw script so users automatically receive updates.
 */

const CACHE_NAME = "pyydys-cache-vmq5hr6bf";
const APP_SHELL = [
  ".",
  "index.html",
  "manifest.json",
  "favicon.ico",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("pyydys-cache-") && k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Same-origin only
  if (url.origin !== self.location.origin) return;

  // Navigation requests → return cached index.html (SPA shell)
  if (req.mode === "navigate") {
    event.respondWith(
      caches
        .match("index.html")
        .then(
          (cached) =>
            cached ||
            fetch(req).catch(() =>
              new Response("Offline", { status: 503, statusText: "Offline" }),
            ),
        ),
    );
    return;
  }

  // Static assets → cache-first, then network (and update cache)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        // Refresh in background
        fetch(req)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, copy));
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match("index.html"));
    }),
  );
});
