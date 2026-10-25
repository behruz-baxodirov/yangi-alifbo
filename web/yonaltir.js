// Eski boş sahifa havolalari (Instagramdagi /#telefonda va h.k.) endi alohida sahifalarga olib boradi.
const HOMES = ["/", "/eski/", "/kr/", "/ru/"];
const TARGETS = {
  "#telefonda": "telefon/",
  "#qoidalar": "qoidalar/",
  "#soz-tekshir": "qoidalar/#soz-tekshir",
  "#test": "test/",
};

// Asl manba: boş sahifa <head> idagi inline skript (analitikadan oldin işlaydi) şu bilan bir xil bölişi testda tekşiriladi.
export function redirectFor(rawPath, hash) {
  const pathname = rawPath.replace(/index\.html$/, "");
  if (!HOMES.includes(pathname) || !(hash in TARGETS)) return null;
  return pathname + TARGETS[hash];
}
