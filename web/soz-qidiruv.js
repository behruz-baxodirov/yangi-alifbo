// /soz/ sahifasidagi qidiruv: röyxatdan mos sözlar, röyxatda yöq bölsa — konvertor natijasi va izohi.
import "./sahifa.js";
import { til, t } from "./i18n.js";
import { convert } from "./converter.js";
import { renderExplain } from "./soz-izoh.js";

const PREFIX = { yangi: "", eski: "eski/", kr: "kr/", ru: "ru/" }[til];
const field = document.getElementById("soz-q");
const out = document.getElementById("soz-natija");
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const norm = (s) => s.toLowerCase().replace(/([og])['‘’`ʼ]/g, "$1ʻ").trim();
let list = null;
let tracked = false;

async function load() {
  list ??= fetch(`/soz/sozlar.json`).then((r) => r.json()).catch(() => []);
  return list;
}

async function search() {
  const q = field.value.trim();
  if (!q) { out.innerHTML = ""; return; }
  if (!tracked) { tracked = true; window.track?.("soz_sahifa_qidiruv"); }
  const words = await load();
  if (q !== field.value.trim()) return;
  const qOld = norm(q), qNew = convert(q).toLowerCase();
  const hits = words.filter((w) => w.y.toLowerCase().startsWith(qNew) || norm(w.e).startsWith(qOld)).slice(0, 12);
  if (hits.length) {
    out.innerHTML = `<ul class="soz-list">${hits.map((w) =>
      `<li><a href="/${PREFIX}soz/${w.s}/"><span data-lotin>${esc(w.e)}</span> → <span data-lotin>${esc(w.y)}</span></a></li>`).join("")}</ul>`;
    return;
  }
  const r = renderExplain(q);
  out.innerHTML = `<p class="soz-yoq">${t("Röyxatda yöq. Yangi alifboda:")} <b class="check-word" data-lotin>${r.wordHtml}</b></p><ul class="check-why">${r.whyHtml}</ul>`;
}

let timer;
field.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(search, 120); });
field.addEventListener("focus", load, { once: true });
