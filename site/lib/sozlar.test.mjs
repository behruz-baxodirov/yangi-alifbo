import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { convert } from "../../web/converter.js";
import { toOldLatin } from "../../web/eski.js";
import { parseSozlar, slugify, sozPages, sozIndexPages, sozJson } from "./sozlar.mjs";

const list = parseSozlar(readFileSync(new URL("../sozlar.txt", import.meta.url), "utf8"));

test("slugs come from the old spelling in ASCII", () => {
  assert.equal(slugify("Oʻzbekiston"), "ozbekiston");
  assert.equal(slugify("Gʻulom"), "gulom");
  assert.equal(slugify("Isʼhoq"), "ishoq");
  assert.equal(slugify("choʻpon"), "chopon");
  assert.equal(slugify("Mirzo Ulugʻbek"), "mirzo-ulugbek");
});

test("parser normalises apostrophes and skips comments", () => {
  assert.deepEqual(parseSozlar("Gʻulom | ism-e\n# x\n\nma'no | soz\nto'y | soz"), [
    { eski: "Gʻulom", tur: "ism-e" },
    { eski: "maʼno", tur: "soz" },
    { eski: "toʻy", tur: "soz" },
  ]);
  assert.throws(() => parseSozlar("a | nimadir"), /tur/);
});

test("the list: about 800 entries, every old spelling survives a round trip, slugs unique", () => {
  assert.ok(list.length >= 750, String(list.length));
  const bad = list.filter(({ eski }) => toOldLatin(convert(eski)) !== eski).map((e) => e.eski);
  assert.deepEqual(bad, []);
  const slugs = JSON.parse(sozJson(list)).map((x) => x.s);
  assert.equal(new Set(slugs).size, slugs.length);
});

const pages = sozPages([
  { eski: "Shahzod", tur: "ism-e" },
  { eski: "Shahlo", tur: "ism-a" },
  { eski: "shahar", tur: "soz" },
]);
const one = (til, slug = "shahzod") => pages.find((p) => p.til === til && p.path === `/soz/${slug}/`);

test("four pages per word with the same slug", () => {
  assert.equal(pages.length, 12);
  for (const til of ["yangi", "eski", "kr", "ru"]) assert.ok(one(til), til);
});

test("word forms are inserted untouched in every version", () => {
  assert.match(one("yangi").main, /Şahzod/);
  assert.match(one("yangi").main, /Шаҳзод/);
  assert.match(one("eski").main, /<h1[^>]*>[\s\S]*Shahzod[\s\S]*Şahzod[\s\S]*<\/h1>/);
  assert.match(one("eski").title, /^Shahzod yangi alifboda: Şahzod/);
  assert.match(one("kr").title, /^Шаҳзод янги алифбода: Şahzod/);
  assert.match(one("ru").title, /^Шаҳзод на новом алфавите: Şahzod/);
});

test("names link to the name card, words do not", () => {
  assert.match(one("yangi").main, /href="\/ism\/\?n=%C5%9Eahzod"/);
  assert.doesNotMatch(one("yangi", "shahar").main, /\/ism\//);
});

test("related words share the first letter", () => {
  assert.match(one("yangi").main, /href="\/soz\/shahlo\/"/);
});

test("index pages and the search list", () => {
  const index = sozIndexPages(list);
  assert.deepEqual(index.map((p) => p.til).sort(), ["eski", "kr", "ru", "yangi"]);
  assert.ok(index.every((p) => p.path === "/soz/"));
  assert.match(index.find((p) => p.til === "yangi").main, /href="\/soz\/ozbekiston\/"/);
  const json = JSON.parse(sozJson(list));
  assert.equal(json.length, list.length);
  assert.deepEqual(Object.keys(json[0]).sort(), ["e", "s", "t", "y"]);
});

test("words with the same ASCII slug get a numbered second slug", () => {
  const json = JSON.parse(sozJson([{ eski: "bosh", tur: "soz" }, { eski: "boʻsh", tur: "soz" }]));
  assert.deepEqual(json.map((x) => x.s), ["bosh", "bosh-2"]);
  assert.ok(sozPages([{ eski: "bosh", tur: "soz" }, { eski: "boʻsh", tur: "soz" }]).some((p) => p.path === "/soz/bosh-2/"));
});

test("the search example keeps its spelling in every version", () => {
  const index = sozIndexPages([{ eski: "Shahzod", tur: "ism-e" }]);
  const ph = (til) => index.find((p) => p.til === til).main.match(/placeholder="([^"]*)"/)[1];
  assert.equal(ph("yangi"), "Masalan: Shahzod");
  assert.equal(ph("eski"), "Masalan: Shahzod");
  assert.equal(ph("kr"), "Масалан: Шаҳзод");
  assert.equal(ph("ru"), "Например: Shahzod");
});
