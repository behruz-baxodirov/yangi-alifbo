// JS örnatadigan matnlar 4 versiyada: yangi lotin (asl), eski lotin, kirill, rus.
// Kalit — yangi lotindagi asl matnning özi. Rusça lugat i18n-ru.js da.
import { RU } from "./i18n-ru.js";
import { toCyrillic } from "./kirill.js";
import { toOldLatin } from "./eski.js";

export const til = globalThis.document?.documentElement.dataset.til || "yangi";

const fill = (s, params) => s.replace(/\{(\w+)\}/g, (all, k) => (k in params ? String(params[k]) : all));

/**
 * full = false: rusçada tarjima, qolganida asl matn (eski/kirillga sahifaning özi ögiradi, yozuv.js).
 * full = true: DOM ga tuşmaydigan matn uçun (rasm, ulaşiş matni) — eski va kirillga ham ögiriladi.
 */
export function tr(version, uz, params = {}, full = false) {
  if (version === "ru") return fill(RU[uz] ?? uz, params);
  const text = fill(uz, params);
  if (!full) return text;
  return version === "eski" ? toOldLatin(text) : version === "kr" ? toCyrillic(text) : text;
}

export const t = (uz, params) => tr(til, uz, params);
export const tx = (uz, params) => tr(til, uz, params, true);

/** Boşqa versiyaga ötganda sahifadagi joy saqlanadi: ?n=… va #konverter yangi havolaga köçadi. */
export function placeIn(href, search, hash) {
  return href.split(/[?#]/)[0] + search + hash;
}
