// Ism kartasi uçun hisob: istalgan yozuvdagi ism → yangi alifbo, eski yozuvi va özgargan harflar.
import { convert } from "./converter.js";
import { toOldLatin } from "./eski.js";

const NEW = ["ö", "ğ", "ş", "ç", "ʼ"];
const MAX = 40;

export function ismKarta(input) {
  const text = input.trim().replace(/\s+/g, " ");
  if (!text) return null;
  // Har qismning birinçi harfi katta; qolgani qanday yozilgan bölsa şunday (SHAHZOD ham saqlanadi).
  const capital = text.replace(/(^|[\s-])(\p{Ll})/gu, (all, sep, ch) => sep + ch.toUpperCase());
  const yangi = [...convert(capital)].slice(0, MAX).join("");
  const lower = yangi.toLowerCase();
  return { yangi, eski: toOldLatin(yangi), changed: NEW.filter((ch) => lower.includes(ch)) };
}
