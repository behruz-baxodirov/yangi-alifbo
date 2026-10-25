// Tez yoziş maşqi uçun hisob: söz yozilayotganda va tugaganda baholaş, natija.
import { convert } from "./converter.js";

const NEW = /[öğşçÖĞŞÇʼ]/u;
const nfc = (s) => s.normalize("NFC");

export const localDay = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
// Oxirgi n kun (eskisi birinçi): şu kuni maşq qilinganmi.
export function lastDays(kunlar, today, n = 7) {
  const set = new Set(kunlar);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (n - 1 - i));
    return set.has(localDay(d));
  });
}

// Oxirgi maşq natijasi (qaytib kelgan foydalanuvçi uçun yon kartalar).
export function readLast(raw) {
  try {
    const last = JSON.parse(raw)?.last;
    if (!last || typeof last !== "object") return null;
    const { wpm, accuracy } = last;
    if (!Number.isFinite(wpm) || wpm < 0 || !Number.isFinite(accuracy) || accuracy < 0 || accuracy > 100) return null;
    return { wpm, accuracy };
  } catch { return null; }
}

export function readPractice(raw) {
  const empty = { best: 0, kunlar: [] };
  try {
    const value = JSON.parse(raw);
    if (!value || !Number.isFinite(value.best) || value.best < 0 || !Array.isArray(value.kunlar)) return empty;
    return { best: value.best, kunlar: [...new Set(value.kunlar.filter((day) => typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day)))] };
  } catch { return empty; }
}

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
  const letters = [...got.toLowerCase()];
  const missed = [...want.toLowerCase()].filter((ch, i) => NEW.test(ch) && letters[i] !== ch);
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
