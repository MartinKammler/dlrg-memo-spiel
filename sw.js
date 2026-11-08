// Service Worker: alles vorab cachen, damit das Spiel offline läuft.
// Bei jeder Änderung an Dateien VERSION hochzählen.
const VERSION = 'dlrg-memory-v22';
const DATEIEN = [
  './',
  'app.js',
  'cards.js',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'img/baderegeln/b01.webp',
  'img/baderegeln/b02.webp',
  'img/baderegeln/b03.webp',
  'img/baderegeln/b04.webp',
  'img/baderegeln/b05.webp',
  'img/baderegeln/b06.webp',
  'img/baderegeln/b07.webp',
  'img/baderegeln/b08.webp',
  'img/baderegeln/b09.webp',
  'img/baderegeln/b10.webp',
  'img/dlrg-logo.webp',
  'img/eisregeln/e01.webp',
  'img/eisregeln/e02.webp',
  'img/eisregeln/e03.webp',
  'img/eisregeln/e04.webp',
  'img/eisregeln/e05.webp',
  'img/eisregeln/e06.webp',
  'img/eisregeln/e07.webp',
  'img/eisregeln/e08.webp',
  'img/eisregeln/e09.webp',
  'img/eisregeln/e10.webp',
  'img/eisregeln/e11.webp',
  'img/eisregeln/e12.webp',
  'img/rettungsgeraete/r01.webp',
  'img/rettungsgeraete/r02.webp',
  'img/rettungsgeraete/r03.webp',
  'img/rettungsgeraete/r04.webp',
  'img/rettungsgeraete/r05.webp',
  'img/rettungsgeraete/r06.webp',
  'img/rettungsgeraete/r07.webp',
  'img/rettungsgeraete/r08.webp',
  'img/rueckseite.webp',
  'img/tisch.webp',
  'index.html',
  'manifest.webmanifest',
  'style.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
