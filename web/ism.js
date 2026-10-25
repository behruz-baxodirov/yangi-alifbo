// /ism/: ism yangi alifboda — karta va Instagram story rasmi (1080×1920). Ism heç qayerga yuborilmaydi.
import "./sahifa.js";
import { til, t, tx } from "./i18n.js";
import { ismKarta } from "./ism-hisob.js";
import { C, W, H, loadFonts, logo, non, background, toPng } from "./kanvas.js";
import { objectUrls } from "./object-url.js";

const PAIR = { ö: "oʻ → ö", ğ: "gʻ → ğ", ş: "sh → ş", ç: "ch → ç", ʼ: "' → ʼ" };
// Doto kirill harflarini va ğ ni bilmaydi.
const HEAD = til === "kr" || til === "ru" ? "800 84px Onest, sans-serif" : "900 92px Doto, monospace";

export async function drawNameStory(canvas, card) {
  const heading = [tx("Ismim"), tx("yangi alifboda")];
  await loadFonts(`${card.yangi} ${card.eski} ${heading.join(" ")} ${tx("Eski yozuvda:")} ${tx("Siz ham yasang:")}`);
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  background(g);
  logo(g, 96, 120);

  g.fillStyle = C.char;
  g.textBaseline = "alphabetic";
  g.font = HEAD;
  g.fillText(heading[0], 96, 400);
  g.fillText(heading[1], 96, 500);

  const cx = W / 2, cy = 1000;
  non(g, cx, cy, 380);
  // Ism non içiga sığguncha kiçrayadi; ğ bölsa Onest (Doto ğ ni çizmaydi).
  const family = /ğ/i.test(card.yangi) ? (s) => `800 ${s}px Onest, sans-serif` : (s) => `900 ${s}px Doto, monospace`;
  let size = 190;
  g.font = family(size);
  while (size > 56 && g.measureText(card.yangi).width > 560) g.font = family(size -= 6);
  g.fillStyle = C.char;
  g.textAlign = "center";
  g.fillText(card.yangi, cx, cy + size * 0.35, 600);

  g.font = "500 46px Onest, sans-serif";
  g.fillText(`${tx("Eski yozuvda:")} ${card.eski}`, cx, 1470, 900);
  g.font = "700 46px Onest, sans-serif";
  g.fillText(card.changed.length ? card.changed.map((ch) => PAIR[ch]).join("    ") : tx("Ismingiz özgarmaydi"), cx, 1550, 900);
  g.textAlign = "left";

  g.font = "500 46px Onest, sans-serif";
  g.fillText(tx("Siz ham yasang:"), 96, 1680);
  g.font = "800 104px Onest, sans-serif";
  g.fillText("yozgich.uz", 96, 1800);
}

const $ = (id) => document.getElementById(id);
const field = $("ism-q"), box = $("ism-karta"), err = $("ism-err"), preview = $("ism-prev"), img = $("ism-img");
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
let card = null, shown = false;

const cardName = document.querySelector(".ism-card-name"), save = $("ism-save");
const SAMPLE = cardName.textContent;

function render() {
  card = ismKarta(field.value);
  box.hidden = !card;
  preview.hidden = true;
  err.hidden = true;
  // Yon kartadagi ism jonli yangilanadi; ism yöq bölsa namuna xira turadi.
  cardName.textContent = card ? card.yangi : SAMPLE;
  cardName.classList.toggle("is-sample", !card);
  save.disabled = !card;
  $("ism-story").disabled = !card;
  if (!card) return;
  $("ism-yangi").textContent = card.yangi;
  $("ism-eski").textContent = card.eski;
  $("ism-juft").innerHTML = card.changed.map((ch) => `<li>${esc(PAIR[ch])}</li>`).join("");
  $("ism-same").hidden = card.changed.length > 0;
  if (!shown) { shown = true; window.track?.("ism_karta"); }
}

let timer;
field.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(render, 120); });
const fromLink = new URLSearchParams(location.search).get("n");
if (fromLink) { field.value = fromLink; render(); }

// Instagram va Facebook ilova brauzerida yuklab oliş sahifani rasm bilan almaştirib yuboradi.
const inApp = /Instagram|FBAN|FBAV/.test(navigator.userAgent);
async function storyPng() {
  err.hidden = true;
  const canvas = document.createElement("canvas");
  const blob = await drawNameStory(canvas, card).then(() => toPng(canvas)).catch(() => null);
  if (!blob) err.hidden = false;
  return blob;
}

// "Rasmni saqlaş": ulaşiş oynasisiz, PNG faylni yuklab beradi.
save.addEventListener("click", async () => {
  if (!card) return;
  const blob = await storyPng();
  if (!blob) return;
  const url = objectUrls.replace("ism", blob);
  img.src = url;
  preview.hidden = false;
  window.track?.("ism_saqlandi");
  if (inApp) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = "ism-yozgich.png";
  a.click();
});

$("ism-story").addEventListener("click", async () => {
  if (!card) return;
  const blob = await storyPng();
  if (!blob) return;
  const file = new File([blob], "ism-yozgich.png", { type: "image/png" });
  const url = objectUrls.replace("ism", blob);
  img.src = url;
  preview.hidden = false;
  window.track?.("ism_story");
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e?.name === "AbortError") return; }
  }
  if (inApp) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = "ism-yozgich.png";
  a.click();
});
