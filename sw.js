// Service worker: instant repeat visits and offline browsing.
// Photos and fonts are cached as they're seen; the catalog (products.js) and the page
// are fetched fresh when online and fall back to the cached copy when not.
const VERSION = "v4";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./products.js", "./lqip.js", "./images/logo.svg", "./site.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isDoc = req.mode === "navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/products.js");
  if (isDoc) {
    // network first, cache fallback
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
    return;
  }
  // everything else (photos, fonts, icons): cache first, then network
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok && (url.origin === location.origin || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com"))) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })));
});
