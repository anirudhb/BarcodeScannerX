self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(r) {
        return caches.open("v1").then(function(cache) {
          cache.put(e.request, r.clone());
          return r;
        });
      });
    })
  );
});
