// /mashq/: tez yoziş maşqi. Söz böşliq bosilganda baholanadi (Yozgiç almaştirib ulgurgan böladi).
import "./sahifa.js";
import { til, t, tx } from "./i18n.js";
import { MATN } from "./mashq-matn.js";
import { liveOk, judgeWord, summary, localDay, readPractice, readLast, lastDays } from "./mashq-hisob.js";
import { checkTyping } from "./tekshir.js";
import { C, W, H, loadFonts, logo, non, background, toPng } from "./kanvas.js";
import { objectUrls } from "./object-url.js";

const $ = (id) => document.getElementById(id);
const textEl = $("mashq-matn"), field = $("mashq-in"), stat = $("mashq-stat"), hint = $("mashq-hint");
const result = $("mashq-natija"), best = $("mashq-best");
const KEY = "yozgich-mashq";
const WORDS = 20, SENTENCES = 3;

let rejim = "o", target = [], index = 0, results = [], started = 0, done = false, last = null;

const pick = (list, n) => [...list].sort(() => Math.random() - 0.5).slice(0, n);
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

function load() {
  try { return readPractice(localStorage.getItem(KEY)); } catch { return readPractice(null); }
}
function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* saqlab bölmasa, faqat şu sahifada */ }
}
// Yon panel: eng yaxşi natija va oxirgi 7 kunda qaysi kunlari maşq qilingan.
function showBest() {
  const data = load();
  best.textContent = data.best ? t("Eng yaxşi natija: {n} söz/daqiqa", { n: data.best }) : t("Hali natija yöq");
  const week = lastDays(data.kunlar, new Date());
  $("mashq-kunlar").innerHTML = week.map((on) => `<i${on ? ' class="on"' : ""}></i>`).join("");
  $("mashq-kunlar-sr").textContent = t("Oxirgi 7 kunda {n} kun maşq qilingan", { n: week.filter(Boolean).length });
  let stored = null;
  try { stored = readLast(localStorage.getItem(KEY)); } catch { /* saqlanmagan */ }
  if (stored) {
    $("mashq-wpm-k").textContent = stored.wpm;
    $("mashq-acc-k").textContent = `${stored.accuracy}%`;
  }
}

function paint() {
  textEl.innerHTML = target.map((w, i) => {
    const cls = i < index ? (results[i].ok ? "ok" : "no") : i === index ? "now" : "";
    return `<span class="${cls}">${esc(w)}</span>`;
  }).join(" ");
}

function start(mode) {
  rejim = mode;
  const source = MATN[mode];
  target = (mode === "gaplar" ? pick(source, SENTENCES).join(" ") : pick(source, WORDS).join(" ")).split(" ");
  index = 0; results = []; started = 0; done = false;
  field.value = "";
  field.disabled = false;
  field.classList.remove("bad");
  hint.hidden = true;
  result.hidden = true;
  stat.textContent = t("Yoza boşlang — vaqt birinçi harfdan hisoblanadi.");
  document.querySelectorAll("[data-rejim]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.rejim === mode)));
  paint();
}

function finish() {
  done = true;
  field.disabled = true;
  last = { ...summary(results, Date.now() - started), rejim };
  $("mashq-wpm").textContent = last.wpm;
  $("mashq-wpm-k").textContent = last.wpm;
  $("mashq-acc-k").textContent = `${last.accuracy}%`;
  $("mashq-detal").innerHTML = [
    t("Aniqlik: {a}%", { a: last.accuracy }),
    last.worst ? t("Köp adaşgan harf: {h}", { h: `<b data-lotin>${last.worst}</b>` }) : "",
  ].filter(Boolean).join(" · ");
  result.hidden = false;
  $("mashq-prev").hidden = true;
  const data = load();
  const today = localDay(new Date());
  if (!data.kunlar.includes(today)) data.kunlar.push(today);
  data.best = Math.max(data.best, last.wpm);
  save({ ...data, last: { wpm: last.wpm, accuracy: last.accuracy } });
  showBest();
  window.track?.("mashq_tugadi", { rejim, wpm: last.wpm });
  result.focus();
}

function commit(word) {
  const r = judgeWord(target[index], word);
  results.push(r);
  if (!r.ok && checkTyping(word).verdict === "ishlamadi") hint.hidden = false;
  index++;
  field.value = "";
  field.classList.remove("bad");
  paint();
  stat.textContent = t("{n} / {all} söz", { n: index, all: target.length });
  if (index === target.length) finish();
}

field.addEventListener("input", () => {
  if (done) return;
  if (!started) { started = Date.now(); window.track?.("mashq_boshlandi", { rejim }); }
  const value = field.value;
  if (/\s$/.test(value)) {
    if (value.trim()) commit(value.trim());
    else field.value = "";
    return;
  }
  // Oxirgi söz: töğri yozilsa, böşliq kutmasdan tugaydi.
  if (index === target.length - 1 && value.normalize("NFC") === target[index]) return commit(value);
  field.classList.toggle("bad", !liveOk(target[index], value));
});
field.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && field.value.trim() && !done) { e.preventDefault(); commit(field.value.trim()); }
});

document.querySelectorAll("[data-rejim]").forEach((b) => b.addEventListener("click", () => { start(b.dataset.rejim); field.focus(); }));
$("mashq-qayta").addEventListener("click", () => { start(rejim); field.focus(); });

// Story rasm: söz/daqiqa nonga tamğalanadi.
const HEAD = til === "kr" || til === "ru" ? "800 84px Onest, sans-serif" : "900 92px Doto, monospace";
export async function drawMashqStory(canvas, r) {
  const lines = [tx("Tez yoziş"), tx("maşqi"), tx("söz/daqiqa"), tx("Aniqlik: {a}%", { a: r.accuracy }), tx("Siz ham sinab köring:")];
  await loadFonts(lines.join(" "));
  canvas.width = W;
  canvas.height = H;
  const g = canvas.getContext("2d");
  background(g);
  logo(g, 96, 120);
  g.fillStyle = C.char;
  g.textBaseline = "alphabetic";
  g.font = HEAD;
  g.fillText(lines[0], 96, 400);
  g.fillText(lines[1], 96, 500);
  const cx = W / 2, cy = 1040;
  non(g, cx, cy, 400);
  g.fillStyle = C.char;
  g.textAlign = "center";
  let size = 380;
  g.font = `900 ${size}px Doto, monospace`;
  while (g.measureText(String(r.wpm)).width > 520) g.font = `900 ${size -= 20}px Doto, monospace`;
  g.fillText(String(r.wpm), cx, cy + size * 0.3);
  g.font = "700 46px Onest, sans-serif";
  g.fillText(lines[2], cx, cy + 210);
  g.font = "500 46px Onest, sans-serif";
  g.fillText(lines[3], cx, 1540);
  g.textAlign = "left";
  g.fillText(lines[4], 96, 1680);
  g.font = "800 104px Onest, sans-serif";
  g.fillText("yozgich.uz", 96, 1800);
}

const inApp = /Instagram|FBAN|FBAV/.test(navigator.userAgent);
$("mashq-story").addEventListener("click", async () => {
  if (!last) return;
  $("mashq-err").hidden = true;
  const canvas = document.createElement("canvas");
  const blob = await drawMashqStory(canvas, last).then(() => toPng(canvas)).catch(() => null);
  if (!blob) { $("mashq-err").hidden = false; return; }
  const file = new File([blob], "mashq-yozgich.png", { type: "image/png" });
  const url = objectUrls.replace("mashq", blob);
  $("mashq-img").src = url;
  $("mashq-prev").hidden = false;
  window.track?.("mashq_story");
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); return; } catch (e) { if (e?.name === "AbortError") return; }
  }
  if (inApp) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = "mashq-yozgich.png";
  a.click();
});

start("o");
showBest();
