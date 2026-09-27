/* 玄機決策 Service Worker：離線快取 App 程式與頁面。
 * 只快取「程式檔」，從不接觸 IndexedDB 中的人物資料；App 更新時只替換程式快取，本機資料不受影響。 */
const BUILD = new URL(self.location.href).searchParams.get("v") || "dev";
const CACHE = `xuanji-app-${BUILD}`;
const ROUTES = ["/", "/persons/", "/persons/edit/", "/persons/view/", "/glossary/", "/settings/", "/demo/"];
const STATIC = ["/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

const assetRefs = text => {
  const out = new Set();
  for (const m of text.matchAll(/\/_next\/static\/[^"'\s)\\]+/g)) out.add(m[0]);
  for (const m of text.matchAll(/(?<![\w/])static\/(?:chunks|css|media)\/[^"'\s,\]\\)]+/g)) out.add("/_next/" + m[0]);
  return [...out];
};

async function cacheWithAssets(cache, url) {
  const res = await fetch(url, { cache: "reload" });
  if (!res.ok) return;
  await cache.put(url, res.clone());
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("html") || ct.includes("text/plain") || url.endsWith(".txt")) {
    const refs = assetRefs(await res.text());
    await Promise.all(refs.map(async a => { if (!(await cache.match(a))) { try { const r = await fetch(a); if (r.ok) await cache.put(a, r); } catch { /* 略過 */ } } }));
  }
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all([
      ...ROUTES.flatMap(r => [cacheWithAssets(cache, r), cacheWithAssets(cache, r + "index.txt")]),
      ...STATIC.map(u => cacheWithAssets(cache, u)),
    ].map(p => p.catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("xuanji-app-") && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 帶雜湊的程式檔：永不改變，快取優先
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
    return;
  }

  // 頁面與頁面資料：網路優先（取得新版），離線時用快取
  const isPage = req.mode === "navigate" || url.pathname.endsWith(".txt");
  if (isPage) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(url.pathname, res.clone());
        return res;
      } catch {
        return (await cache.match(url.pathname, { ignoreSearch: true }))
          || (req.mode === "navigate" ? await cache.match("/") : undefined)
          || new Response("離線中，且此頁尚未快取。", { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } });
      }
    })());
    return;
  }

  // 其他（圖示、manifest）：快取優先並背景更新
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })());
});
