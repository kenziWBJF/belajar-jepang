const CACHE_NAME = 'belajar-jepang-n5-v1';
const APP_FILES = [
    './learntojapan.html',
    './manifest.webmanifest',
    './icon.svg',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(cacheName => cacheName.startsWith('belajar-jepang-n5-') && cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put('./learntojapan.html', copy));
                    return response;
                })
                .catch(() => caches.match('./learntojapan.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then(cachedResponse => cachedResponse || fetch(request))
    );
});
