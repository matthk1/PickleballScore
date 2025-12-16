const CACHE_NAME = "pickleball-pwa-v2";

const ASSETS_TO_CACHE = [
  // --- CORE FILES & LOCAL ASSETS ---
  "/",
  "/index.html",
  "/manifest.json",
  "/sw.js", 
  "/icons/icon-192.png", 
  "/icons/icon-512.png",

  // --- CDN DEPENDENCIES (CRITICAL) ---
  "https://cdn.tailwindcss.com",
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js",
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js",
  "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js",

  // --- BUILD ASSETS ---
 "/assets/index-BgsxrxEL.js"
];

// 1. INSTALL: Pre-cache all defined assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching critical assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('Failed to pre-cache assets:', error);
      })
  );
  self.skipWaiting(); // Forces the Service Worker to activate immediately
});

// 2. FETCH: Strategy = Cache First, then Fallback to Network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        // Cache miss - fetch from the network
        return fetch(event.request);
      })
  );
});

// 3. ACTIVATE: Clean up old caches (Crucial for version updates)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
