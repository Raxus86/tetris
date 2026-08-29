/* Kill stale PWA caches, then step aside so the tablet always loads a fresh game. */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of windows) {
        if ("navigate" in client) {
          await client.navigate(client.url);
        } else {
          client.postMessage({ type: "reload" });
        }
      }
    })(),
  );
});
