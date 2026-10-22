import { convert } from "./converter.js";
import { GLYPHS, PAIRS, PAIR_OF, layout } from "./glyphs.js";

// Qurilma: Mac'da örnatiş, Windows'da beta, telefonda konverter birinçi.
const ua = navigator.userAgent;
const touch = navigator.maxTouchPoints > 1;
const device = /iPhone|iPad|iPod|Android/i.test(ua) || (/Macintosh/.test(ua) && touch)
  ? "phone"
  : /Windows/i.test(ua) ? "windows" : "mac";
document.documentElement.dataset.device = device;

// Non markazi: çekiç halqalari va sedana (doimiy naqş, tasodifiy emas).
const center = document.getElementById("non-center");
function addAt(cls, x, y, extra = "") {
  const el = document.createElement("i");
  el.className = cls;
  el.style.cssText = `left:${x}%;top:${y}%;${extra}`;
  center.appendChild(el);
}
[[36, 56], [40.5, 64]].forEach(([r, n], ring) => {
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + ring * 0.07;
    addAt("pip", 50 + r * Math.cos(a), 50 + r * Math.sin(a));
  }
});
// Sedana halqalar orasida: harf maydoniga tegmaydi.
for (let k = 0; k < 18; k++) {
  const a = k * 2.399963, r = 38.25;
  addAt("seed", 50 + r * Math.cos(a), 50 + r * Math.sin(a), `--r:${(k * 47) % 180}deg`);
}

// Qoidalar jadvalidagi yangi harflar ham çekiç nuqtalaridan.
document.querySelectorAll("[data-glyph]").forEach((cell) => {
  const rows = GLYPHS[cell.dataset.glyph];
  const grid = document.createElement("span");
  grid.className = "glyph-grid";
  grid.style.gridTemplateColumns = `repeat(${rows[0].length}, 3px)`;
  rows.forEach((row) => [...row].forEach((c) => {
    const d = document.createElement("i");
    if (c === "X") d.className = "on";
    grid.appendChild(d);
  }));
  cell.appendChild(grid);
});

// Havola yopiq savolga olib borsa, uni oçib qöyamiz.
function openTarget() {
  const target = location.hash && document.querySelector(location.hash);
  if (target instanceof HTMLDetailsElement) target.open = true;
}
addEventListener("hashchange", openTarget);
openTarget();

// Çekiç: eski juftlikning nuqtalari yangi harfga köçadi.
const COLS = 13, ROWS = 10, POOL = 40;
const stamp = document.getElementById("stamp");
const pairLabel = document.getElementById("pair");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const dots = Array.from({ length: POOL }, () => {
  const d = document.createElement("i");
  d.className = "dot";
  return stamp.appendChild(d);
});

function place(coords) {
  dots.forEach((d, i) => {
    const c = coords[i] ?? coords[coords.length - 1];
    d.style.left = `${(c[0] / COLS) * 100}%`;
    d.style.top = `${(c[1] / ROWS) * 100}%`;
    d.style.opacity = i < coords.length ? 1 : 0;
  });
}

function showPair([from, to], stamped) {
  place(layout(stamped ? to : from, COLS));
  pairLabel.textContent = `${from.toLowerCase()} → ${to.toLowerCase()}`;
}

let step = reduceMotion ? 1 : 0;
let idleUntil = 0;
function tick() {
  if (Date.now() < idleUntil) return;
  showPair(PAIRS[Math.floor(step / 2) % PAIRS.length], step % 2 === 1);
  step++;
}
tick();
setInterval(tick, reduceMotion ? 4000 : 1600);

// Bosilgan oxirgi yangi harf nonga qayta tamğalanadi.
let lastStamped = "";
function restamp(text) {
  const letters = text.toLowerCase().match(/[öğşç]/g);
  const last = letters ? letters[letters.length - 1] : "";
  if (!last || last === lastStamped) return;
  lastStamped = last;
  idleUntil = Date.now() + 6000;
  const pair = PAIR_OF[last];
  showPair(pair, false);
  setTimeout(() => showPair(pair, true), reduceMotion ? 0 : 450);
}

// Konverter
const input = document.getElementById("in");
const output = document.getElementById("out");
function render(fromUser) {
  const text = convert(input.value);
  output.textContent = text;
  if (fromUser) restamp(text);
}
input.addEventListener("input", () => render(true));
render(false);

// Nusxa olish tugmalari
document.querySelectorAll("[data-copy]").forEach((button) => {
  const label = button.textContent;
  button.addEventListener("click", async () => {
    const text = document.getElementById(button.dataset.copy).textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "Olindi";
    } catch {
      button.textContent = { mac: "Belgilab, ⌘C bosing", windows: "Belgilab, Ctrl+C bosing", phone: "Bosib turib nusxa oling" }[device];
    }
    setTimeout(() => (button.textContent = label), 1800);
  });
});

// Telefonda havolani ulaşiş
const share = document.getElementById("share");
share?.addEventListener("click", async () => {
  const data = { title: "Yangi alifbo", text: "o' → ö, sh → ş: yangi alifboda odatdagidek yozing", url: location.href.split("#")[0] };
  if (navigator.share) {
    try { await navigator.share(data); } catch { /* foydalanuvçi bekor qildi */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(data.url);
    share.textContent = "Havola olindi";
  } catch {
    share.textContent = data.url;
  }
});

// Nuqta çiziqlarini sahifaning 12px çekiç töriga tekislaymiz.
function alignDotRows() {
  document.querySelectorAll(".rule-table, .faq").forEach((el) => {
    const left = el.getBoundingClientRect().left + scrollX;
    el.style.setProperty("--phase", `${(12 - (left % 12)) % 12}px`);
  });
}
addEventListener("resize", alignDotRows);
alignDotRows();
