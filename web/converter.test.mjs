import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { convert, detectScript } from "./converter.js";

const fixtures = JSON.parse(
  readFileSync(new URL("../core/fixtures/cases.json", import.meta.url), "utf8"),
);

test("shared fixtures match the keyboard engine", () => {
  assert.ok(fixtures.length >= 60);
  for (const c of fixtures) assert.equal(convert(c.in), c.out, c.note);
});

test("conversion is idempotent over fixtures", () => {
  for (const c of fixtures) assert.equal(convert(convert(c.in)), convert(c.in), c.note);
});

test("tutuq option off keeps the apostrophe", () => {
  assert.equal(convert("ma'no", { tutuq: false }), "ma'no");
  assert.equal(convert("o'zbek", { tutuq: false }), "özbek");
  assert.equal(convert("маъно Исҳоқ Ishoq", { tutuq: false }), "ma'no Is'hoq Is'hoq");
});

test("cyrillic to new latin", () => {
  const cases = [
    ["Ўзбекистон", "Özbekiston"],
    ["шаҳар", "şahar"],
    ["Исҳоқ", "Isʼhoq"],
    ["мўъжиза", "möjiza"],
    ["маъно", "maʼno"],
    ["қатъий", "qatʼiy"],
    ["ёз", "yoz"],
    ["ер", "yer"],
    ["поезд", "poyezd"],
    ["подъезд", "podyezd"],
    ["премьер", "premyer"],
    ["цирк", "sirk"],
    ["лицей", "litsey"],
    ["акция", "aksiya"],
    ["ЧИРОҚ", "ÇIROQ"],
    ["ЯНГИ", "YANGI"],
    ["Янги алифбо", "Yangi alifbo"],
    ["машҳур", "maşhur"],
    ["ғоя", "ğoya"],
    ["Тошкент шаҳри", "Toşkent şahri"],
    ["юлдуз", "yulduz"],
  ];
  for (const [input, expected] of cases) assert.equal(convert(input), expected, input);
});

test("urls, emails and handles are left alone", () => {
  assert.equal(convert("https://shop.uz/chegirma"), "https://shop.uz/chegirma");
  assert.equal(convert("info@shosh.uz yozing"), "info@shosh.uz yozing");
  assert.equal(convert("@shoh_channel kanali"), "@shoh_channel kanali");
  assert.equal(convert("www.choyxona.uz da choy"), "www.choyxona.uz da çoy");
  assert.equal(convert("t.me/shoh_channel ga obuna"), "t.me/shoh_channel ga obuna");
  assert.equal(convert("championat.asia saytida"), "championat.asia saytida");
  assert.equal(convert("HTTPS://Shop.uz/Chegirma"), "HTTPS://Shop.uz/Chegirma");
  assert.equal(convert("@Shoh.Channel kanali"), "@Shoh.Channel kanali");
  assert.equal(convert("Choshgohda shaharga."), "Çoşgohda şaharga.");
});

test("common apostrophe-less exceptions are fixed", () => {
  assert.equal(convert("Ishoq"), "Isʼhoq");
  assert.equal(convert("ISHOQ"), "ISʼHOQ");
  assert.equal(convert("ashob"), "asʼhob");
  assert.equal(convert("mushaf"), "musʼhaf");
  assert.equal(convert("Ishoqov"), "Isʼhoqov");
  assert.equal(convert("ishonch"), "işonç");
});

test("detectScript", () => {
  assert.equal(detectScript("салом"), "cyrillic");
  assert.equal(detectScript("salom"), "latin");
  assert.equal(detectScript("salom дунё"), "mixed");
  assert.equal(detectScript("123"), "latin");
});
