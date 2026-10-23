// Test natijasi uçun Instagram story rasmi (1080×1920): natija nonga tamğalanadi.
// Hammasi brauzerda çiziladi, heç qayerga yuborilmaydi.
import { til, tx } from "./i18n.js";

// Doto kirill harflarini bilmaydi: kirill va rus versiyada sarlavha Onest bilan.
const HEAD = til === "kr" || til === "ru" ? "800 84px Onest, sans-serif" : "900 92px Doto, monospace";

const C = {
  crust: "#cf8a33", rim: "#a85d1b", rimEdge: "#7d4210", dough: "#f0cf97", pip: "#6b3510", char: "#17110d",
};
const W = 1080, H = 1920;

function loadFonts() {
  return Promise.all([
    document.fonts.load("900 100px Doto", "yozgiç Yangi alifbo testi 0123456789/"),
    document.fonts.load("500 40px Onest"),
    document.fonts.load("700 40px Onest", "töğri javob"),
    document.fonts.load("800 40px Onest", tx("Yangi alifbo testi")),
  ]).catch(() => {});
}

function dot(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

// Logo: char disk, dough markaz, ö nuqta harfi (favicon çizmasi), yonida "yozgiç".
function logo(g, x, y) {
  g.fillStyle = C.char; dot(g, x + 40, y + 40, 40);
  g.fillStyle = C.dough; dot(g, x + 40, y + 40, 33);
  g.fillStyle = C.char;
  [[13, 9], [19, 9], [13, 14], [16, 14], [19, 14], [10.5, 17.5], [21.5, 17.5], [10.5, 21], [21.5, 21], [13, 24.5], [16, 24.5], [19, 24.5]]
    .forEach(([px, py]) => dot(g, x + px * 2.5, y + py * 2.5, 4.3));
  g.font = "900 72px Doto, monospace";
  g.textBaseline = "middle";
  g.fillText("yozgiç", x + 104, y + 44);
}

// Non: tekis halqalar, ikki çekiç pip halqasi (saytdagi non kabi 56 va 64 ta).
function non(g, cx, cy, R) {
  [[R, C.rimEdge], [R * 0.97, C.rim], [R * 0.885, C.rimEdge], [R * 0.86, C.dough]].forEach(([r, color]) => {
    g.fillStyle = color; dot(g, cx, cy, r);
  });
  g.fillStyle = C.pip;
  [[0.72, 56], [0.81, 64]].forEach(([k, n], ring) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.07;
      dot(g, cx + R * k * Math.cos(a), cy + R * k * Math.sin(a), 5.5);
    }
  });
}

export async function drawStory(canvas, score) {
  await loadFonts();
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");

  g.fillStyle = C.crust;
  g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(23,17,13,.15)";
  for (let y = 18; y < H; y += 36) for (let x = 18; x < W; x += 36) dot(g, x, y, 4.2);

  logo(g, 96, 120);
  g.fillStyle = C.char;
  g.textBaseline = "alphabetic";
  g.font = HEAD;
  g.fillText(tx("Yangi alifbo"), 96, 400);
  g.fillText(tx("testi"), 96, 500);

  const cx = W / 2, cy = 1040;
  non(g, cx, cy, 400);

  // Ball va "/10" bitta guruh bölib markazlanadi va non içiga sığadigan qilib kiçraytiriladi.
  g.fillStyle = C.char;
  const measure = (text, size) => { g.font = `900 ${size}px Doto, monospace`; return g.measureText(text).width; };
  const k = Math.min(1, 540 / (measure(String(score), 420) + 16 + measure("/10", 130)));
  const big = Math.round(420 * k), small = Math.round(130 * k), gap = 16 * k;
  const w1 = measure(String(score), big), w2 = measure("/10", small);
  const left = cx - (w1 + gap + w2) / 2;
  g.font = `900 ${big}px Doto, monospace`;
  g.fillText(String(score), left, cy + 110);
  g.font = `900 ${small}px Doto, monospace`;
  g.fillText("/10", left + w1 + gap, cy + 110);
  g.textAlign = "center";
  g.font = "700 42px Onest, sans-serif";
  g.fillText(tx("töğri javob"), cx, cy + 205);
  g.textAlign = "left";

  g.font = "500 46px Onest, sans-serif";
  g.fillText(tx("Siz ham sinab köring:"), 96, 1640);
  // Doto nuqtani plyus qilib çizadi, şuning uçun domen Onest bilan.
  g.font = "800 104px Onest, sans-serif";
  g.fillText("yozgich.uz", 96, 1770);
}

export async function storyBlob(score) {
  const canvas = document.createElement("canvas");
  await drawStory(canvas, score);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
