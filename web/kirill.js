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

// Brend qöşimça olsa ham (Yozgiçni, Yozgiçda) öz yozuvida qoladi.
const BRANDS = ["Yozgiç"];
export const isBrand = (word) => BRANDS.some((b) => word.startsWith(b) && /^\p{Ll}*$/u.test(word.slice(b.length)));

function isKept(word) {
  if (KEEP.has(word) || isBrand(word)) return true;
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

// Sahifani ögirganda tegilmaydigan elementlar (yozuv.js va site/lib/html.mjs bir xil röyxatni işlatadi).
export const EXCLUDE = 'code, kbd, pre, textarea, input, script, style, [lang="en"], [lang="ru"], [data-lotin], .out';
