// Tez yoziş maşqi uçun hisob: söz yozilayotganda va tugaganda baholaş, natija.
import { convert } from "./converter.js";

const NEW = /[öğşçÖĞŞÇʼ]/u;
const nfc = (s) => s.normalize("NFC");

/** Yozilayotgan söz: Yozgiç bir lahza o' ni körsatadi, keyin ö qöyadi — buni xato sanamaymiz. */
export function liveOk(target, typed) {
  const t = nfc(target);
  if (t.startsWith(nfc(convert(typed)))) return true;
  // Oxirgi o, g, s, c (yoki apostrof) hali yangi harfga aylanmagan bölişi mumkin: keyingi tugma hal qiladi.
  return /[oOgGsScC'’ʻ`]$/.test(typed) && t.startsWith(nfc(convert(typed.slice(0, -1))));
}

/** Tugagan söz aynan yangi alifboda bölişi kerak; missed — yozilmay qolgan yangi harflar. */
export function judgeWord(target, typed) {
  const want = nfc(target), got = nfc(typed);
  const lower = got.toLowerCase();
  const missed = [...want.toLowerCase()].filter((ch) => NEW.test(ch) && !lower.includes(ch));
  return { ok: want === got, missed: [...new Set(missed)] };
}

export function summary(results, ms) {
  if (!results.length || !ms) return { wpm: 0, accuracy: 0, worst: null };
  const ok = results.filter((r) => r.ok).length;
  const count = {};
  for (const r of results) for (const ch of r.missed) count[ch] = (count[ch] ?? 0) + 1;
  const worst = Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { wpm: Math.round(ok / (ms / 60000)), accuracy: Math.round((100 * ok) / results.length), worst };
}
