import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { tr } from "./i18n.js";
import { RU } from "./i18n-ru.js";
import { QUESTIONS, grade } from "./test-savollar.js";
import { RULE_TEXT, explain } from "./soz.js";

const dir = new URL("./", import.meta.url);
const SKIP = /\.test\.mjs$|^i18n-ru\.js$|^vidjet\.js$|^mashq-matn\.js$/;
const sources = readdirSync(dir).filter((f) => f.endsWith(".js") && !SKIP.test(f))
  .map((f) => [f, readFileSync(new URL(f, dir), "utf8")]);

// t("…") va tx("…") çaqiruvlari: oddiy satr yoki {belgi} li satr.
const CALL = /\bt[x]?\(\s*(["'`])((?:\\.|(?!\1)[^\\])*)\1/g;
const unescape = (s) => s.replace(/\\(["'`\\])/g, "$1");

test("every t()/tx() key has a Russian translation", () => {
  const missing = [];
  for (const [file, src] of sources) {
    for (const [, , key] of src.matchAll(CALL)) {
      const k = unescape(key);
      if (!RU[k]) missing.push(`${file}: ${k}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("no template interpolation inside t()", () => {
  const bad = [];
  for (const [file, src] of sources) {
    for (const [, q, key] of src.matchAll(CALL)) if (q === "`" && key.includes("${")) bad.push(`${file}: ${key}`);
  }
  assert.deepEqual(bad, []);
});

test("placeholders are filled after lookup", () => {
  assert.equal(tr("yangi", "{n} ta harf özgardi", { n: 3 }), "3 ta harf özgardi");
  assert.equal(tr("ru", "{n} ta harf özgardi", { n: 3 }), RU["{n} ta harf özgardi"].replace("{n}", "3"));
  assert.equal(tr("eski", "Keyingi savol"), "Keyingi savol");
});

test("old latin and cyrillic come from conversion in tr(..., {full: true})", () => {
  assert.equal(tr("eski", "Keyingi savol", {}, true), "Keyingi savol");
  assert.equal(tr("eski", "töğri javob", {}, true), "toʻgʻri javob");
  assert.equal(tr("kr", "töğri javob", {}, true), "тўғри жавоб");
});

test("quiz, grades and rule notes are translated", () => {
  const keys = [
    ...QUESTIONS.flatMap((q) => [q.q, q.why]),
    ...[0, 4, 7, 10].map(grade),
    ...Object.values(RULE_TEXT).map((r) => r.note).filter(Boolean),
    ...explain("őġșčİı").lookalikes.map((l) => l.note),
  ];
  assert.deepEqual(keys.filter((k) => !RU[k]), []);
});

test("Russian quiz texts keep the «…» examples", () => {
  for (const q of QUESTIONS) {
    const ex = (s) => [...s.matchAll(/«([^»]*)»/g)].map((m) => m[1]).sort();
    assert.deepEqual(ex(RU[q.q]), ex(q.q), q.q);
  }
});
