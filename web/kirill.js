// Yangi lotin → özbek kirill: "Kirillda öqiş" rejimi uçun. Konverterning teskarisi.

// Havolalar, email, @handle va domenlar ögirilmaydi (converter.js dagi kabi).
const TLD = "uz|me|com|ru|org|net|io|asia|info|app|dev|tv|co|ai|gov|edu|kz|tj|kg|tm|tr";
export const PROTECTED = new RegExp(
  "(https?:\\/\\/\\S+|www\\.\\S+|[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+|@[\\w.]*\\w" +
    `|(?<![\\p{L}\\d@.-])(?:[\\w-]+\\.)+(?:${TLD})(?:\\/\\S*)?(?![\\p{L}\\d]))`,
  "iu",
);

// Nom va inglizça sözlar lotinda qoladi.
export const KEEP = new Set([
  "Yozgiç", "Mac", "macOS", "iOS", "iPhone", "Android", "Gboard", "Samsung", "Windows", "Terminal", "Telegram",
  "Instagram", "GitHub", "Apple", "Silicon", "Intel", "Notepad", "ChatGPT", "Claude", "AI", "Space", "Shift",
  "Control", "Enter", "Ctrl", "Alt", "fn", "beta", "Open", "System", "Settings", "Keep", "Run", "More", "info", "PC", "MB",
]);

const MAP = {
  a: "а", b: "б", d: "д", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о",
  p: "п", q: "қ", r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з", ö: "ў", ğ: "ғ", ş: "ш", ç: "ч",
};
const IOTATED = { o: "ё", u: "ю", a: "я", e: "е" };
const VOWELS = "aeiouö";
const UZ_LETTER = /^[a-zöğşçʼ]$/i;

const isUpper = (ch) => ch !== ch.toLowerCase();

function isKept(word) {
  if (KEEP.has(word)) return true;
  if ([...word].some((ch) => !UZ_LETTER.test(ch) || /[cw]/i.test(ch))) return true;
  if (/^[A-Z]{2,4}$/.test(word)) return true;
  return /^.\S*\p{Lu}/u.test(word) && word !== word.toUpperCase();
}

function transliterate(word) {
  const chars = [...word];
  const allCaps = word === word.toUpperCase() && chars.filter((c) => /\p{L}/u.test(c)).length > 1;
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i], lo = ch.toLowerCase();
    const prev = chars[i - 1]?.toLowerCase(), next = chars[i + 1]?.toLowerCase();
    let cyr;
    if (ch === "ʼ") {
      cyr = "ъ";
    } else if (lo === "s" && next === "ʼ" && chars[i + 2]?.toLowerCase() === "h") {
      cyr = "с";
      i++; // tutuq tuşib qoladi: sʼh → сҳ
    } else if (lo === "y" && next in IOTATED && (next !== "e" || !prev || VOWELS.includes(prev))) {
      cyr = IOTATED[next];
      i++;
    } else if (lo === "e") {
      cyr = !prev || VOWELS.includes(prev) ? "э" : "е";
    } else {
      cyr = MAP[lo] ?? ch;
    }
    out += allCaps || isUpper(ch) ? cyr.toUpperCase() : cyr;
  }
  return out;
}

function convertWord(word) {
  if (/[Ѐ-ӿ]/u.test(word)) return word;
  const [head, ...rest] = word.split("ʼ");
  if (isKept(head)) return head + rest.map((part) => `ʼ${isKept(part) ? part : transliterate(part)}`).join("");
  return isKept(word) ? word : transliterate(word);
}

export function toCyrillic(text) {
  return text
    .split(PROTECTED)
    .map((part, i) => (i % 2 ? part : part.replace(/\p{L}+(?:ʼ\p{L}+)*/gu, convertWord)))
    .join("");
}

// Sahifani kirillga ögiriş va qaytariş. Asl matn har tugun uçun saqlanadi, qaytariş aniq.
export const EXCLUDE = 'code, kbd, pre, textarea, input, script, style, [lang="en"], [lang="ru"], [data-lotin], .out';
const ATTRS = ["aria-label", "placeholder", "alt", "title"];
const texts = new WeakMap(); // Text → { latin, cyr }
const attrs = new WeakMap(); // Element → { [attr]: { latin, cyr } }
let current = "lotin";
let observer;

const skip = (el) => !el || !!el.closest(EXCLUDE);

function textNode(t) {
  if (skip(t.parentElement)) return;
  const seen = texts.get(t);
  if (current === "kirill") {
    if (seen && t.data === seen.cyr) return;
    const cyr = toCyrillic(t.data);
    texts.set(t, { latin: t.data, cyr });
    if (cyr !== t.data) t.data = cyr;
  } else if (seen && t.data === seen.cyr) {
    t.data = seen.latin;
  }
}

function attrNode(el, name) {
  if (skip(el) || !el.hasAttribute(name)) return;
  const map = attrs.get(el) ?? {};
  const value = el.getAttribute(name);
  const seen = map[name];
  if (current === "kirill") {
    if (seen && value === seen.cyr) return;
    map[name] = { latin: value, cyr: toCyrillic(value) };
    attrs.set(el, map);
    if (map[name].cyr !== value) el.setAttribute(name, map[name].cyr);
  } else if (seen && value === seen.cyr) {
    el.setAttribute(name, seen.latin);
  }
}

function walk(node) {
  if (node.nodeType === Node.TEXT_NODE) return textNode(node);
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  ATTRS.forEach((name) => attrNode(node, name));
  const it = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = it.nextNode(); n; n = it.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) textNode(n);
    else ATTRS.forEach((name) => attrNode(n, name));
  }
}

/** Butun sahifani tanlangan yozuvga ötkazadi; kirillda keyin qöşilgan matnlar ham ögiriladi. */
export function applyScript(root, script) {
  current = script;
  walk(root);
  observer ??= new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "characterData") textNode(m.target);
      else if (m.type === "attributes") attrNode(m.target, m.attributeName);
      else m.addedNodes.forEach(walk);
    }
  });
  observer.disconnect();
  if (script === "kirill") {
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
}
