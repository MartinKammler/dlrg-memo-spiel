// Service Worker: alles vorab cachen, damit das Spiel offline läuft.
// Bei jeder Änderung an Dateien VERSION hochzählen.
const VERSION = 'dlrg-memory-v12';
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
  'img/klassisch/k01.webp',
  'img/rueckseite.webp',
  'img/tisch.webp',
  'img/klassisch/k02.webp',
  'img/klassisch/k03.webp',
  'img/klassisch/k04.webp',
  'img/klassisch/k05.webp',
  'img/klassisch/k06.webp',
  'img/klassisch/k07.webp',
  'img/klassisch/k08.webp',
  'img/klassisch/k09.webp',
  'img/klassisch/k10.webp',
  'img/klassisch/k11.webp',
  'img/klassisch/k12.webp',
  'img/klassisch/k13.webp',
  'img/klassisch/k14.webp',
  'img/klassisch/k15.webp',
  'img/klassisch/k16.webp',
  'img/rettungsgeraete/r01.webp',
  'img/rettungsgeraete/r02.webp',
  'img/rettungsgeraete/r03.webp',
  'img/rettungsgeraete/r04.webp',
  'img/rettungsgeraete/r05.webp',
  'img/rettungsgeraete/r06.webp',
  'img/rettungsgeraete/r07.webp',
  'img/rettungsgeraete/r08.webp',
  'img/wasserwelt/w01.webp',
  'img/wasserwelt/w02.webp',
  'img/wasserwelt/w03.webp',
  'img/wasserwelt/w04.webp',
  'img/wasserwelt/w05.webp',
  'img/wasserwelt/w06.webp',
  'img/wasserwelt/w07.webp',
  'img/wasserwelt/w08.webp',
  'img/wasserwelt/w09.webp',
  'img/wasserwelt/w12.webp',
  'img/wasserwelt/w13.webp',
  'img/wasserwelt/w14.webp',
  'img/wasserwelt/w15.webp',
  'img/wasserwelt/w16.webp',
  'img/wasserwelt/w17.webp',
  'img/wasserwelt/w18.webp',
  'img/wasserwelt/w19.webp',
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
