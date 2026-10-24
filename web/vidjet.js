/* yozgich.uz vidjet — generator yasagan (web/converter.js + web/vidjet-src.js). Tarmoqqa çiqmaydi, kuki qöymaydi. */
(() => {
// Eski lotin va kirill matnini yangi özbek alifbosiga (2026) ögiradi.
// Klaviatura bilan bir xil qoidalar: core/fixtures/cases.json.

const APOS = "'`‘’ʻʼ´";
const TUTUQ = "ʼ";
// Kirill ъ dan kelgan tutuq lotin qoidalariga aralashmasligi uçun vaqtinçalik belgi.
const HOLD = "";

// Havolalar, email, @handle va oddiy domenlar (t.me/..., kun.uz) ögirilmaydi.
const TLD = "uz|me|com|ru|org|net|io|asia|info|app|dev|tv|co|ai|gov|edu|kz|tj|kg|tm|tr";
const PROTECTED = new RegExp(
  "(https?:\\/\\/\\S+|www\\.\\S+|[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+|@[\\w.]*\\w" +
    `|(?<![\\p{L}\\d@.-])(?:[\\w-]+\\.)+(?:${TLD})(?:\\/\\S*)?(?![\\p{L}\\d]))`,
  "iu",
);

const WITH_APOS = { o: "ö", O: "Ö", g: "ğ", G: "Ğ" };
const WITH_H = { s: "ş", S: "Ş", c: "ç", C: "Ç" };

// Tutuqsiz yozilgan, lekin s va h alohida öqiladigan sözlar.
const EXCEPTIONS = [
  ["işoq", "isʼhoq"],
  ["aşob", "asʼhob"],
  ["muşaf", "musʼhaf"],
];

const CYR = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ж: "j", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "x", ч: "ç", ш: "ş", щ: "ş", ы: "i", э: "e", ў: "ö",
  қ: "q", ғ: "ğ", ҳ: "h", ё: "yo", ю: "yu", я: "ya",
};
const CYR_VOWELS = "аеёиоуэюяўАЕЁИОУЭЮЯЎ";
const IOTATED = "еёюяЕЁЮЯ";

const isCyrillic = (ch) => /[Ѐ-ӿ]/u.test(ch);
const isLetter = (ch) => !!ch && /\p{L}/u.test(ch);
const isUpper = (ch) => !!ch && ch !== ch.toLowerCase() && ch === ch.toUpperCase();

function detectScript(text) {
  const cyr = (text.match(/[Ѐ-ӿ]/gu) || []).length;
  const lat = (text.match(/[A-Za-zÀ-ɏ]/gu) || []).length;
  if (cyr && lat) return "mixed";
  return cyr ? "cyrillic" : "latin";
}

function convert(text, { tutuq = true } = {}) {
  return text
    .split(PROTECTED)
    .map((part, i) => (i % 2 ? part : convertPlain(part, tutuq)))
    .join("");
}

// Word matni formatlangan bölaklarga bölingan bölsa ham butun matndagi kontekst saqlanadi.
// Har natija belgisi asl belgining bölak raqamini oladi; sh → ş birinçi harf uslubida qoladi.
function convertSegments(parts, { tutuq = true } = {}) {
  const source = parts.join("");
  const owners = parts.flatMap((part, i) => Array(part.length).fill(i));
  const result = parts.map(() => "");
  let offset = 0;
  source.split(PROTECTED).forEach((part, i) => {
    const map = { value: owners.slice(offset, offset + part.length) };
    const out = i % 2 ? part : convertPlain(part, tutuq, map);
    for (let j = 0; j < out.length; j++) result[map.value[j]] += out[j];
    offset += part.length;
  });
  return result;
}

// Oddiy konverterda xarita tuzilmaydi. Word uçun almaşgan belgining asl uslubi kuzatiladi.
function replace(text, regex, fn, map, index = (i, match) => Math.min(i, match.length - 1)) {
  if (!map) return text.replace(regex, fn);
  const next = [];
  let last = 0;
  const out = text.replace(regex, (...args) => {
    const start = args[args.length - 2], match = args[0];
    const value = fn(...args);
    for (let i = last; i < start; i++) next.push(map.value[i]);
    for (let i = 0; i < value.length; i++) next.push(map.value[start + index(i, match)]);
    last = start + match.length;
    return value;
  });
  for (let i = last; i < text.length; i++) next.push(map.value[i]);
  map.value = next;
  return out;
}

function convertPlain(text, tutuq, map) {
  let out = cyrillicToLatin(text, map);
  out = replace(out, new RegExp(`([oOgG])[${APOS}]`, "gu"), (_, l) => WITH_APOS[l], map);
  out = replace(out, /([sScC])[hH]/gu, (_, l) => WITH_H[l], map);
  if (tutuq) {
    out = replace(out, new RegExp(`(\\p{L})[${APOS}](?=\\p{L})`, "gu"), (_, l) => l + TUTUQ, map);
  }
  out = fixExceptions(out, map, tutuq);
  return out.replaceAll(HOLD, tutuq ? TUTUQ : "'");
}

function fixExceptions(text, map, tutuq) {
  let out = text;
  for (const [wrong, right] of EXCEPTIONS) {
    const re = new RegExp(`(?<!\\p{L})${wrong}`, "giu");
    out = replace(out, re, (m) => matchCase(m, tutuq ? right : right.replaceAll(TUTUQ, "'")), map, (i, m) => {
      const at = m.toLowerCase().indexOf("ş");
      return i <= at ? i : i <= at + 2 ? at : i - 2;
    });
  }
  return out;
}

function matchCase(sample, word) {
  if (sample === sample.toUpperCase()) return word.toUpperCase();
  if (isUpper(sample[0])) return word[0].toUpperCase() + word.slice(1);
  return word;
}

function cyrillicToLatin(text, map) {
  if (!/[Ѐ-ӿ]/u.test(text)) return text;
  const chars = [...text];
  let out = "";
  const nextOwners = [];
  let offset = 0;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (!isCyrillic(ch)) {
      out += ch;
      if (map) for (let j = 0; j < ch.length; j++) nextOwners.push(map.value[offset + j]);
      offset += ch.length;
      continue;
    }
    const prev = chars[i - 1];
    const next = chars[i + 1];
    const lower = ch.toLowerCase();
    let latin;

    if (lower === "ъ") {
      // ўъ → ö, ъ + е/ё/ю/я → ye/yo/yu/ya, aks holda tutuq.
      latin = prev && prev.toLowerCase() === "ў" ? "" : next && IOTATED.includes(next) ? "" : HOLD;
    } else if (lower === "ь") {
      latin = "";
    } else if (lower === "е") {
      const afterVowel = !isLetter(prev) || CYR_VOWELS.includes(prev) || "ъьЪЬ".includes(prev);
      latin = afterVowel ? "ye" : "e";
    } else if (lower === "ц") {
      latin = prev && CYR_VOWELS.includes(prev) ? "ts" : "s";
    } else if (lower === "с" && next && next.toLowerCase() === "ҳ") {
      latin = "s" + HOLD;
    } else {
      latin = CYR[lower] ?? ch;
    }

    if (isUpper(ch) && latin) {
      const allCaps = isUpper(next) || (isUpper(prev) && !isLetter(next));
      latin = allCaps ? latin.toUpperCase() : latin[0].toUpperCase() + latin.slice(1);
    }
    out += latin;
    if (map) for (let j = 0; j < latin.length; j++) nextOwners.push(map.value[offset]);
    offset += ch.length;
  }
  if (map) map.value = nextOwners;
  return out;
}

// data-yozgich bölgan element ustida "Yangi alifboda" tugmasi: bosilsa matn yangi alifboga ögiriladi, qayta bosilsa asli qaytadi.
// Bu fayl bundle içida işlaydi (site/lib/bundle.mjs): convert() yuqorida, converter.js dan.
const SKIP = "script, style, textarea, input, select, code, pre, [contenteditable], .yozgich-btn";
const STYLE = "font:600 14px/1.2 system-ui,sans-serif;padding:8px 14px;margin:8px 0;border:2px solid #17110d;"
  + "border-radius:3px;background:#f0cf97;color:#17110d;cursor:pointer";

function textNodes(root) {
  const out = [];
  const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = it.nextNode(); n; n = it.nextNode()) {
    if (n.data.trim() && !n.parentElement.closest(SKIP)) out.push(n);
  }
  return out;
}

function mount(el) {
  const [on, off] = (el.getAttribute("data-yozgich-label") || "Yangi alifboda|Eski yozuvda").split("|");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "yozgich-btn";
  button.textContent = on;
  button.setAttribute("style", STYLE);
  button.setAttribute("aria-pressed", "false");
  const original = new WeakMap();
  let converted = false;
  button.addEventListener("click", () => {
    for (const node of textNodes(el)) {
      if (!converted) {
        original.set(node, node.data);
        node.data = convert(node.data);
      } else if (original.has(node)) {
        node.data = original.get(node);
      }
    }
    converted = !converted;
    button.textContent = converted ? off || on : on;
    button.setAttribute("aria-pressed", String(converted));
  });
  if (el.getAttribute("data-yozgich-button") === "bottom") el.after(button);
  else el.before(button);
}

function start() {
  document.querySelectorAll("[data-yozgich]").forEach(mount);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();

})();
