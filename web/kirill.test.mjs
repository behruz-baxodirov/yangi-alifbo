import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { convert } from "./converter.js";
import { toCyrillic } from "./kirill.js";

test("new latin to uzbek cyrillic", () => {
  const cases = [
    ["Odatdagidek yozing, yangi harf özi çiqadi", "Одатдагидек ёзинг, янги ҳарф ўзи чиқади"],
    ["Isʼhoq", "Исҳоқ"],
    ["maʼno", "маъно"],
    ["eʼlon", "эълон"],
    ["Yetadi", "Етади"],
    ["poeziya", "поэзия"],
    ["tayyor", "тайёр"],
    ["Qoidalar", "Қоидалар"],
    ["ŞAHAR", "ШАҲАР"],
    ["Toğ", "Тоғ"],
    ["yuklab", "юклаб"],
    ["kelyapti", "келяпти"],
    ["Behruz Baxodirov", "Беҳруз Баходиров"],
  ];
  for (const [latin, cyr] of cases) assert.equal(toCyrillic(latin), cyr, latin);
});

test("names, code-like words and links stay latin", () => {
  assert.equal(toCyrillic("Mac va Windows uçun"), "Mac ва Windows учун");
  assert.equal(toCyrillic("macOSʼda"), "macOSʼда");
  assert.equal(toCyrillic("Telegramʼda yozing"), "Telegramʼда ёзинг");
  assert.equal(toCyrillic("yozgich.uz"), "yozgich.uz");
  assert.equal(toCyrillic("@behruz_si"), "@behruz_si");
  assert.equal(toCyrillic("https://t.me/baxodirov_ai"), "https://t.me/baxodirov_ai");
  assert.equal(toCyrillic("AI vositalari"), "AI воситалари");
  assert.equal(toCyrillic("Yozgiç bepul"), "Yozgiç бепул");
  assert.equal(toCyrillic("ЎРҚ-1184"), "ЎРҚ-1184");
  assert.equal(toCyrillic("12:00, 1,3 MB"), "12:00, 1,3 MB");
});

// Kirill matnni konverter qaytarib berganda farq qiladigan, maʼlum sözlar.
const LOSSY = new Set([]);

test("site words survive a round trip through the converter", () => {
  const html = readFileSync(new URL("./index.html", import.meta.url), "utf8")
    .replace(/<head>[\s\S]*?<\/head>/, "")
    .replace(/<(script|style|code|kbd)\b[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ");
  const words = new Set(html.match(/[\p{L}ʼ-]+/gu));
  const failures = [];
  for (const w of words) {
    if (convert(w) !== w) continue; // eski yozuvdagi misol
    const cyr = toCyrillic(w);
    if (cyr === w || LOSSY.has(w)) continue;
    if (convert(cyr) !== w) failures.push(`${w} → ${cyr} → ${convert(cyr)}`);
  }
  assert.deepEqual(failures, []);
});

test("the brand keeps its spelling with a suffix", () => {
  assert.equal(toCyrillic("Yozgiçni Yozgiçda şahar"), "Yozgiçni Yozgiçda шаҳар");
});
