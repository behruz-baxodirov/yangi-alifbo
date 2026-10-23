// Yangi lotin → eski lotin: /eski/ sahifalari va eski yozuv rejimi uçun. kirill.js ning juftigi.
import { KEEP, PROTECTED, isBrand } from "./kirill.js";

const OLD = { ö: "oʻ", ğ: "gʻ", ş: "sh", ç: "ch" };

function convertWord(word) {
  if (KEEP.has(word) || isBrand(word) || !/[öğşçÖĞŞÇ]/u.test(word)) return word;
  const allCaps = word === word.toUpperCase() && [...word].filter((c) => /\p{L}/u.test(c)).length > 1;
  return word.replace(/[öğşçÖĞŞÇ]/gu, (ch) => {
    const old = OLD[ch.toLowerCase()];
    if (ch === ch.toLowerCase()) return old;
    return allCaps ? old.toUpperCase() : old[0].toUpperCase() + old.slice(1);
  });
}

export function toOldLatin(text) {
  return text
    .split(PROTECTED)
    .map((part, i) => (i % 2 ? part : part.replace(/\p{L}+(?:ʼ\p{L}+)*/gu, convertWord)))
    .join("");
}
