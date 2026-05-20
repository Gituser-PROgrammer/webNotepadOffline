const DB_NAME = "web-notepad-offline";
const STORE_NAME = "web-notepad-files";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}

async function saveFile(url, blob) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");

    tx.objectStore(STORE_NAME).put(blob, url);

    tx.oncomplete = () => resolve();

    tx.onerror = () => reject(tx.error);
  });
}

async function getFile(url) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");

    const request = tx.objectStore(STORE_NAME).get(url);

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => reject(request.error);
  });
}

async function clearFiles() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");

    tx.objectStore(STORE_NAME).clear();

    tx.oncomplete = () => resolve();

    tx.onerror = () => reject(tx.error);
  });
}
