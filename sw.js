/* Service worker: online = always fresh files; offline = last saved copy (so the countdown still opens without Wi-Fi). */
const CACHE = 'birthday-v1';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'css/base.css', 'css/theme-cute.css', 'css/theme-dreamy.css',
  'js/content.js', 'js/music.js', 'js/theme.js', 'js/app.js', 'js/pwa.js', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match('index.html'))));
});
