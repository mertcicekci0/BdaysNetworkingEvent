const CACHE_NAME = 'bd25-network-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '../src/css/main.css',
    '../src/css/components/modal.css',
    '../src/css/components/profile.css',
    '../src/css/components/qr-scanner.css',
    '../src/css/components/leaderboard.css',
    '../src/css/utils/animations.css',
    '../src/js/config/constants.js',
    '../src/js/utils/storage.js',
    '../src/js/utils/notifications.js',
    '../src/js/components/modal.js',
    '../src/js/components/profile.js',
    '../src/js/components/qr-scanner.js',
    '../src/js/components/leaderboard.js',
    '../src/js/app.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    'https://unpkg.com/html5-qrcode'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Activate Event
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 