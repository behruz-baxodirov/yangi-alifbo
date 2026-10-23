import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { convert } from "./converter.js";
import { toOldLatin } from "./eski.js";

test("new letters back to old latin", () => {
  assert.equal(toOldLatin("özbek toğ şahar çoy"), "oʻzbek togʻ shahar choy");
  assert.equal(toOldLatin("Özbek Ğani Şahar Çoy"), "Oʻzbek Gʻani Shahar Choy");
  assert.equal(toOldLatin("ŞAHAR ÇOY ÖZBEK"), "SHAHAR CHOY OʻZBEK");
});

test("tutuq, names and links stay as they are", () => {
  assert.equal(toOldLatin("maʼno Isʼhoq salom"), "maʼno Isʼhoq salom");
  assert.equal(toOldLatin("Yozgiç https://yozgich.uz/ş a@b.uz"), "Yozgiç https://yozgich.uz/ş a@b.uz");
});

test("home page words survive a round trip through the converter", () => {
  const html = readFileSync(new URL("./index.html", import.meta.url), "utf8")
    .replace(/<head>[\s\S]*?<\/head>/, "")
    .replace(/<(script|style|code|kbd)\b[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ");
  const failures = [];
  for (const w of new Set(html.match(/[\p{L}ʼ-]+/gu))) {
    if (convert(w) !== w) continue; // eski yozuvdagi misol
    if (convert(toOldLatin(w)) !== w) failures.push(`${w} → ${toOldLatin(w)} → ${convert(toOldLatin(w))}`);
  }
  assert.deepEqual(failures, []);
});
