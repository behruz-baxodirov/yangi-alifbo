// Test natijasi uçun Instagram story rasmi (1080×1920): natija nonga tamğalanadi.
// Hammasi brauzerda çiziladi, heç qayerga yuborilmaydi.
import { til, tx } from "./i18n.js";

// Doto kirill harflarini bilmaydi: kirill va rus versiyada sarlavha Onest bilan.
const HEAD = til === "kr" || til === "ru" ? "800 84px Onest, sans-serif" : "900 92px Doto, monospace";

import { C, W, H, loadFonts as load, logo, non, background } from "./kanvas.js";

const loadFonts = () => load(["Yangi alifbo", "testi", "töğri javob", "Siz ham sinab köring:"].map((s) => tx(s)).join(" "));

export async function drawStory(canvas, score) {
  await loadFonts();
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");

  background(g);

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
