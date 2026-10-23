// "Bu söz qanday yoziladi?": söz yangi alifboda qanday yozilişi va qaysi qoida işlagani.
import { convert } from "./converter.js";

const APOS = "'`‘’ʻʼ´";

// ex: imlo misoli (kirill rejimida ham lotinda qoladi), note: izoh.
export const RULE_TEXT = {
  o: { ex: "o' → ö", note: "" },
  g: { ex: "g' → ğ", note: "" },
  sh: { ex: "sh → ş", note: "bitta harf" },
  ch: { ex: "ch → ç", note: "bitta harf" },
  sh2: { ex: "s'h → sʼh", note: "s va h alohida öqiladi, ş bölmaydi" },
  tutuq: { ex: "' → ʼ", note: "tutuq belgisi qoladi, şakli ʼ" },
};

// Telefon menyusidagi öxşaş, lekin boşqa harflar.
const NOTES = { ö: "tepasida ikki nuqta", ğ: "tepasida qayiqça", ş: "ostida ilmoq", ç: "ostida ilmoq" };
const LOOKALIKES = {};
for (const [good, bads] of Object.entries({ ö: "őôòóõōøǒ", ğ: "ġǧĝģ", ş: "șšśŝ", ç: "čćĉċ" })) {
  for (const bad of bads) {
    LOOKALIKES[bad] = { good, note: NOTES[good] };
    LOOKALIKES[bad.toUpperCase()] = { good: good.toUpperCase(), note: NOTES[good] };
  }
}
LOOKALIKES["İ"] = { good: "I", note: "nuqtasiz" };
LOOKALIKES["ı"] = { good: "i", note: "nuqtali" };

const A = `[${APOS}]`;
const SH2 = new RegExp(`[sS]${A}[hH]|[сС][ҳҲ]|(?<!\\p{L})(?:işoq|ishoq|aşob|ashob|muşaf|mushaf)`, "giu");
const RULES = [
  ["o", new RegExp(`[oO]${A}|[ўЎ]`, "u")],
  ["g", new RegExp(`[gG]${A}|[ғҒ]`, "u")],
  ["sh", /[sS][hH]|[шщШЩ]/u],
  ["ch", /[cC][hH]|[чЧ]/u],
];
// Tutuq: harf + apostrof + harf (o', g', s'h emas) yoki ъ (ўъ emas).
const TUTUQ = new RegExp(`(\\p{L})${A}(?=(\\p{L}))`, "gu");
const isTutuq = (text) =>
  /(?<![ўЎ])[ъЪ]/u.test(text) ||
  [...text.matchAll(TUTUQ)].some(([, prev, next]) => !/[oOgG]/.test(prev) && !(/[sS]/.test(prev) && /[hH]/.test(next)));

export function explain(text) {
  const input = text.trim();
  const lookalikes = [];
  const fixed = [...input].map((ch) => {
    const l = LOOKALIKES[ch];
    if (!l) return ch;
    if (!lookalikes.some((x) => x.bad === ch)) lookalikes.push({ bad: ch, good: l.good, note: l.note });
    return l.good;
  }).join("");
  if (!fixed) return { result: "", rules: [], cyrillic: false, ok: false, ng: false, lookalikes };

  const withoutSh2 = fixed.replace(SH2, " ");
  const rules = RULES.filter(([, re]) => re.test(withoutSh2)).map(([id]) => id);
  if (SH2.test(fixed)) rules.push("sh2");
  SH2.lastIndex = 0;
  if (isTutuq(fixed)) rules.push("tutuq");

  const result = convert(fixed);
  return {
    result,
    rules,
    cyrillic: /[Ѐ-ӿ]/u.test(fixed),
    ok: lookalikes.length === 0 && result === input,
    ng: /ng/i.test(result),
    lookalikes,
  };
}
