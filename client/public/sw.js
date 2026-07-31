/**
 * Neo-Sentinel service worker.
 *
 * Strategy:
 *   documents  - network first, cache as offline fallback. Cache-first on the
 *                HTML would pin the app to a stale index.html that references
 *                build assets which no longer exist.
 *   hashed assets - cache first. Vite fingerprints these filenames, so a cached
 *                entry can never be stale for a given URL.
 *   /api      - never cached. Always live.
 *
 * Bump CACHE_NAME on any change to this file; `activate` purges every other cache.
 */
const CACHE_NAME = 'neo-sentinel-v2';
const OFFLINE_DOCUMENT = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_DOCUMENT))
      .catch((error) => console.warn('Precache failed:', error)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))),
      )
      .then(() => self.clients.claim()),
  );
});

const CACHEABLE_DESTINATIONS = new Set(['script', 'style', 'image', 'font']);

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Navigations: go to the network so a new deploy is picked up immediately,
  // and fall back to the cached shell only when offline.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(OFFLINE_DOCUMENT, copy));
          return response;
        })
        .catch(() => caches.match(OFFLINE_DOCUMENT)),
    );
    return;
  }

  if (!CACHEABLE_DESTINATIONS.has(request.destination)) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
