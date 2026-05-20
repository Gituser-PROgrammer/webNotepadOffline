importScripts("./idb.js");
importScripts("./assets.js");

self.addEventListener("install", event => {
  console.log("Installing Service Worker...");

  self.skipWaiting();

  event.waitUntil(updateOfflineFiles());
});

self.addEventListener("activate", event => {
  console.log("Service Worker Activated");

  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function updateOfflineFiles() {
  console.log("Updating Offline Files...");

  // clear old files
  await clearFiles();

  // download fresh files
  for (const url of ASSETS) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }

      const blob = await response.blob();

      await saveFile(url, blob);

      console.log("Saved:", url);

    } catch (err) {
      console.error(err);
    }
  }

  console.log("Offline Files Updated");
}

async function handleRequest(request) {
  const url = new URL(request.url);

  try {
    // try internet first
    const networkResponse = await fetch(request);

    return networkResponse;

  } catch {

    console.log("Offline:", url.pathname);

    // fallback to IndexedDB
    const blob = await getFile(url.pathname);

    if (blob) {
      return new Response(blob);
    }

    return new Response("Offline file not found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}
