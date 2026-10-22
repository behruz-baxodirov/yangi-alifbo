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

export function detectScript(text) {
  const cyr = (text.match(/[Ѐ-ӿ]/gu) || []).length;
  const lat = (text.match(/[A-Za-zÀ-ɏ]/gu) || []).length;
  if (cyr && lat) return "mixed";
  return cyr ? "cyrillic" : "latin";
}

export function convert(text, { tutuq = true } = {}) {
  return text
    .split(PROTECTED)
    .map((part, i) => (i % 2 ? part : convertPlain(part, tutuq)))
    .join("");
}

function convertPlain(text, tutuq) {
  let out = cyrillicToLatin(text);
  out = out.replace(new RegExp(`([oOgG])[${APOS}]`, "gu"), (_, l) => WITH_APOS[l]);
  out = out.replace(/([sScC])[hH]/gu, (_, l) => WITH_H[l]);
  if (tutuq) {
    out = out.replace(new RegExp(`(\\p{L})[${APOS}](?=\\p{L})`, "gu"), `$1${TUTUQ}`);
  }
  out = fixExceptions(out);
  return out.replaceAll(HOLD, TUTUQ);
}

function fixExceptions(text) {
  let out = text;
  for (const [wrong, right] of EXCEPTIONS) {
    const re = new RegExp(`(?<!\\p{L})${wrong}`, "giu");
    out = out.replace(re, (m) => matchCase(m, right));
  }
  return out;
}

function matchCase(sample, word) {
  if (sample === sample.toUpperCase()) return word.toUpperCase();
  if (isUpper(sample[0])) return word[0].toUpperCase() + word.slice(1);
  return word;
}

function cyrillicToLatin(text) {
  if (!/[Ѐ-ӿ]/u.test(text)) return text;
  const chars = [...text];
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (!isCyrillic(ch)) {
      out += ch;
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
  }
  return out;
}
