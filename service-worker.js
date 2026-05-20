const SW_VERSION = 'v1.73.0-DEMO';
const CACHE_NAME = `seahorse-demo-${SW_VERSION}`;
const STATIC_ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('seahorse-demo-') && k !== CACHE_NAME).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url); if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/version.json')) return;
  const isHTML = req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if (isHTML) { e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(req, c)); return r; }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))); return; }
  e.respondWith(caches.match(req).then(c => c || fetch(req).then(r => { if (r.ok) { const cl = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(req, cl)); } return r; })));
});
