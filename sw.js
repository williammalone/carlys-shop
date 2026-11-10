// Service worker: instant repeat visits and offline browsing.
// VERSION is stamped by tools/build.js from a hash of the site's own files, so every deploy
// gets a fresh cache and old ones are deleted. Pages, styles, scripts and data are fetched
// from the network first (cache as fallback); photos and fonts are cache-first.
const VERSION = "9c83b5135f";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./products.js", "./lqip.js", "./images/logo.svg", "./site.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const networkFirst = req.mode === "navigate" || (same && /\.(html|css|js|json|webmanifest|xml|txt)$/.test(url.pathname)) || (same && url.pathname.endsWith("/"));
  if (networkFirst) {
    e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === "navigate" ? caches.match("./index.html") : Response.error()))));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => { if (res.ok && (same || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("googleapis.com"))) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })));
});
