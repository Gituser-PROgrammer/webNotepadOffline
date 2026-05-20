if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");

      console.log("Service Worker Registered");
    } catch (err) {
      console.error("Service Worker Failed:", err);
    }
  });
}
