// Söz va ism sahifalari: site/sozlar.txt dagi har yozuvga 4 versiyada alohida sahifa va /soz/ röyxati.
// Söz şakllari (eski, yangi, kirill) har versiyada özgarmaydi; faqat atrofidagi matn ögiriladi.
import { convert } from "../../web/converter.js";
import { toCyrillic } from "../../web/kirill.js";
import { toOldLatin } from "../../web/eski.js";
import { explain, RULE_TEXT } from "../../web/soz.js";

export const SOZ_UPDATED = "2026-10-24";
const TURLAR = new Set(["soz", "ism-e", "ism-a", "joy"]);
const TILLAR = ["yangi", "eski", "kr", "ru"];
const LETTERS = [..."ABDEFGHIJKLMNOPQRSTUVXYZ", "Ö", "Ğ", "Ş", "Ç"];
const LETTER_ID = { Ö: "oo", Ğ: "gg", Ş: "sh", Ç: "ch" };

const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function parseSozlar(text) {
  return text.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((line) => {
    const [word, tur] = line.split("|").map((s) => s.trim());
    if (!TURLAR.has(tur)) throw new Error(`nomaʼlum tur: ${line}`);
    const eski = word.replace(/([oOgG])['‘’`ʼ]/g, "$1ʻ").replace(/(?<![oOgG])['‘’`ʻ]/g, "ʼ");
    return { eski, tur };
  });
}

export function slugify(eski) {
  return eski.toLowerCase().replace(/[ʻʼ'‘’`]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Ramka matni: {belgi} lar ögirişdan himoyalanadi, keyin söz şakllari öz holiça qöyiladi.
function frame(til, tpl, vars = {}) {
  const keys = Object.keys(vars);
  let text = tpl.replace(/\{(\w+)\}/g, (all, k) => (k in vars ? `\u0001${keys.indexOf(k)}\u0001` : all));
  if (til === "eski") text = toOldLatin(text);
  if (til === "kr") text = toCyrillic(text);
  return text.replace(/\u0001(\d+)\u0001/g, (all, i) => vars[keys[i]]);
}

const UZ = {
  crumb: "Sözlar",
  h1: "{eski} yangi alifboda: {yangi}",
  desc: "{eski} sözi yangi özbek alifbosida {yangi} deb yoziladi. Kirillça: {kir}. Qaysi harf özgargani va qanday yoziladi.",
  eski: "Eski lotin", yangi: "Yangi lotin", kir: "Kirill",
  what: "Nima özgardi",
  same: "Bu söz özgarmaydi: yangi alifboda ham avvalgidek yoziladi.",
  card: "Ism kartasini yasang",
  near: "Yaqin sözlar",
  cta: "Butun matnni ögiriş kerakmi? {link}",
  ctaLink: "Konverter",
  idxTitle: "Sözlar va ismlar yangi alifboda",
  idxDesc: "{n} ta söz, ism va joy nomi yangi özbek alifbosida: eski yozuvi, yangi yozuvi va kirillçasi.",
  idxLede: "{n} ta söz, ism va joy nomi: eski yozuvi, yangi yozuvi va kirillçasi. Röyxatda yöq sözni qidiruvga yozing.",
  search: "Sözni qidiring",
  count: "ta",
  searchPh: "Masalan: {ex}",
  letters: "Harflar",
};
const RU = {
  crumb: "Слова",
  h1: "{kir} на новом алфавите: {yangi}",
  desc: "Слово {kir} ({eski}) на новом узбекском алфавите пишется {yangi}. Какие буквы изменились и как это набрать.",
  eski: "Старая латиница", yangi: "Новая латиница", kir: "Кириллица",
  what: "Что изменилось",
  same: "Это слово не меняется: на новом алфавите оно пишется как раньше.",
  card: "Сделать карточку с именем",
  near: "Похожие слова",
  cta: "Нужно перевести целый текст? {link}",
  ctaLink: "Конвертер",
  idxTitle: "Слова и имена на новом алфавите",
  idxDesc: "{n} слов, имён и названий мест на новом узбекском алфавите: старое написание, новое и кириллица.",
  idxLede: "{n} слов, имён и названий мест: старое написание, новое и кириллица. Если слова нет в списке, введите его в поиск.",
  search: "Найти слово",
  count: "шт.",
  searchPh: "Например: {ex}",
  letters: "Буквы",
};
const RU_NOTES = {
  "bitta harf": "одна буква",
  "s va h alohida öqiladi, ş bölmaydi": "s и h читаются раздельно, ş не получается",
  "tutuq belgisi qoladi, şakli ʼ": "тутук остаётся, его знак — ʼ",
};

function str(til, key, vars) {
  return til === "ru" ? frame("ru", RU[key], vars) : frame(til, UZ[key], vars);
}

// ASCII da bir xil bölib qoladigan sözlar (bosh / boʻsh) uçun ikkinçisiga -2, -3 qöşiladi.
function prepare(entries) {
  const used = new Map();
  return entries.map((entry) => {
    const yangi = convert(entry.eski);
    const base = slugify(entry.eski);
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    return { ...entry, yangi, kir: toCyrillic(yangi), slug: n === 1 ? base : `${base}-${n}` };
  });
}

const initial = (w) => w.yangi[0].toUpperCase();

function rules(til, w) {
  const r = explain(w.eski);
  if (w.yangi === w.eski || r.rules.length === 0) return `<p class="soz-same">${str(til, "same")}</p>`;
  const note = (n) => (til === "ru" ? RU_NOTES[n] ?? n : frame(til, n));
  return `<ul class="soz-why">${r.rules.map((id) => {
    const { ex, note: n } = RULE_TEXT[id];
    return `<li><b data-lotin>${esc(ex)}</b>${n ? `: ${note(n)}` : ""}</li>`;
  }).join("")}</ul>`;
}

function sozMain(til, w, related) {
  const L = (s) => `<span data-lotin>${esc(s)}</span>`;
  const head = til === "kr" || til === "ru" ? `<span lang="uz-Cyrl">${esc(w.kir)}</span>` : L(w.eski);
  const card = w.tur.startsWith("ism")
    ? `<p><a class="btn btn-ink" href="/ism/?n=${encodeURIComponent(w.yangi)}">${str(til, "card")}</a></p>` : "";
  const near = related.map((x) => `<li><a href="/soz/${x.slug}/">${L(x.eski)} → ${L(x.yangi)}</a></li>`).join("");
  return `<div class="page-head">
  <p class="page-crumbs"><a class="page-crumb" href="/soz/">← ${str(til, "crumb")}</a> · <a href="/soz/#harf-${LETTER_ID[initial(w)] ?? initial(w).toLowerCase()}" data-lotin>${initial(w)}</a></p>
  <h1 class="page-title page-title--text">${str(til, "h1", { eski: head, kir: head, yangi: L(w.yangi) })}</h1>
</div>
<section class="soz-page">
  <dl class="soz-forms">
    <div><dt>${str(til, "eski")}</dt><dd data-lotin>${esc(w.eski)}</dd></div>
    <div class="soz-hot"><dt>${str(til, "yangi")}</dt><dd data-lotin>${esc(w.yangi)}</dd></div>
    <div><dt>${str(til, "kir")}</dt><dd lang="uz-Cyrl">${esc(w.kir)}</dd></div>
  </dl>
  <h2 class="soz-h2">${str(til, "what")}</h2>
  ${rules(til, w)}
  ${card}
  <h2 class="soz-h2">${str(til, "near")}</h2>
  <ul class="soz-list">${near}</ul>
  <p class="soz-cta">${str(til, "cta", { link: `<a href="/#konverter">${str(til, "ctaLink")}</a>` })}</p>
</section>`;
}

export function sozPages(entries) {
  const words = prepare(entries);
  const byLetter = new Map();
  for (const w of words) byLetter.set(initial(w), [...(byLetter.get(initial(w)) ?? []), w]);
  const pages = [];
  for (const w of words) {
    const group = byLetter.get(initial(w));
    const i = group.indexOf(w);
    const related = Array.from({ length: Math.min(6, group.length - 1) }, (_, k) => group[(i + 1 + k) % group.length]);
    for (const til of TILLAR) {
      const plainHead = til === "kr" || til === "ru" ? w.kir : w.eski;
      pages.push({
        path: `/soz/${w.slug}/`,
        til,
        title: `${str(til, "h1", { eski: plainHead, kir: plainHead, yangi: w.yangi })} · Yozgiç`,
        description: str(til, "desc", { eski: w.eski, kir: w.kir, yangi: w.yangi }),
        main: sozMain(til, w, related),
        script: "sahifa.js",
        updated: SOZ_UPDATED,
      });
    }
  }
  return pages;
}

export function sozIndexPages(entries) {
  const words = prepare(entries);
  const groups = new Map(LETTERS.map((l) => [l, []]));
  for (const w of words) {
    if (!groups.has(initial(w))) groups.set(initial(w), []);
    groups.get(initial(w)).push(w);
  }
  const used = [...groups].filter(([, list]) => list.length);
  const id = (l) => `harf-${LETTER_ID[l] ?? l.toLowerCase()}`;
  return TILLAR.map((til) => {
    const L = (s) => `<span data-lotin>${esc(s)}</span>`;
    const item = (w) => {
      const left = til === "kr" || til === "ru" ? `<span lang="uz-Cyrl">${esc(w.kir)}</span>` : L(w.eski);
      return `<li><a href="/soz/${w.slug}/"><span class="soz-old">${left}</span> → <b>${L(w.yangi)}</b></a></li>`;
    };
    const main = `<div class="page-head">
  <h1 class="page-title">${str(til, "idxTitle")}</h1>
  <p class="page-lede">${str(til, "idxLede", { n: words.length })}</p>
  <div class="check soz-qidir">
    <label class="check-label" for="soz-q">${str(til, "search")}</label>
    <input class="check-field" id="soz-q" type="search" placeholder="${str(til, "searchPh", { ex: til === "kr" ? "Шаҳзод" : "Shahzod" })}" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="soz-natija" id="soz-natija" aria-live="polite"></div>
  </div>
</div>
<section class="soz-index">
  <nav class="harflar" aria-label="${str(til, "letters")}" data-lotin>${used.map(([l]) => `<a href="#${id(l)}">${l}</a>`).join("")}</nav>
  ${used.map(([l, list]) => `<section class="harf" id="${id(l)}"><h2 class="harf-h${l === "Ğ" ? " harf-h--text" : ""}"><span data-lotin>${l}</span><span class="harf-n">${list.length} ${str(til, "count")}</span></h2><ul class="soz-list">${list.map(item).join("")}</ul></section>`).join("\n  ")}
</section>`;
    return {
      path: "/soz/",
      til,
      title: `${str(til, "idxTitle")} · Yozgiç`,
      description: str(til, "idxDesc", { n: words.length }),
      main,
      script: "soz-qidiruv.js",
      updated: SOZ_UPDATED,
    };
  });
}

export function sozJson(entries) {
  return JSON.stringify(prepare(entries).map((w) => ({ e: w.eski, y: w.yangi, s: w.slug, t: w.tur })));
}
