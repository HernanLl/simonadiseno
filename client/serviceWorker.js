const staticCacheName = "site-static";
const assets = [
  "/",
  "/index.html",
  "/static/js/collapseButton.js",
  "/static/css/dist/hamburgers.css",
  "/static/css/normalize.css",
  "/static/assets/favicon.png",
  "/static/css/styles.css",
];

self.addEventListener("install", (e) => {
  caches.open(staticCacheName).then((cache) => {
    console.log("cached registered");
    cache.addAll(assets);
  });
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      return cacheRes || fetch(e.request);
    })
  );
});
