// Varni ERP PWA Service Worker
const CACHE_NAME = "varni-erp-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/varni-logo.svg",
  "/manifest.json"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network first fallback to cache for standard navigation
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and exclude dynamic dev/chrome extensions
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache the newly fetched file if it's a valid static resource
        if (networkResponse.status === 200 && event.request.url.match(/\.(html|js|css|png|svg|json)$/)) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If seeking page navigation, return index.html cache
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});
