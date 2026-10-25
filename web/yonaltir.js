// Eski boş sahifa havolalari (Instagramdagi /#telefonda va h.k.) endi alohida sahifalarga olib boradi.
const HOMES = ["/", "/eski/", "/kr/", "/ru/"];
const TARGETS = {
  "#telefonda": "telefon/",
  "#qoidalar": "qoidalar/",
  "#soz-tekshir": "qoidalar/#soz-tekshir",
  "#test": "test/",
};

export function redirectFor(pathname, hash) {
  if (!HOMES.includes(pathname) || !(hash in TARGETS)) return null;
  return pathname + TARGETS[hash];
}
