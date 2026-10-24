// Rasmlar almaşganda eski Blob URL böşatiladi; yuklab oliş havolalari sahifa umriga boğlangan.
export function createObjectUrls(api = URL) {
  const active = new Map();
  return {
    replace(key, blob) {
      if (active.has(key)) api.revokeObjectURL(active.get(key));
      const url = api.createObjectURL(blob);
      active.set(key, url);
      return url;
    },
    clear() {
      for (const url of active.values()) api.revokeObjectURL(url);
      active.clear();
    },
  };
}

export const objectUrls = createObjectUrls();
globalThis.addEventListener?.("pagehide", (event) => {
  if (!event.persisted) objectUrls.clear(); // BFCacheʼdagi sahifa qaytsa, rasmlar hali kerak.
});
