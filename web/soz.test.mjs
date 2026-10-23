import { test } from "node:test";
import assert from "node:assert/strict";
import { explain, RULE_TEXT } from "./soz.js";

test("s'h stays two letters with a tutuq", () => {
  const r = explain("Is'hoq");
  assert.equal(r.result, "Isʼhoq");
  assert.deepEqual(r.rules, ["sh2"]);
});

test("exception words written without the apostrophe count as s'h", () => {
  assert.deepEqual(explain("Işoq").rules, ["sh2"]);
  assert.deepEqual(explain("Ishoq").rules, ["sh2"]);
});

test("each latin rule fires once, in table order", () => {
  const r = explain("o'zbek choy shahar tog' ma'no");
  assert.equal(r.result, "özbek çoy şahar toğ maʼno");
  assert.deepEqual(r.rules, ["o", "g", "sh", "ch", "tutuq"]);
  assert.deepEqual(explain("o'g'il o'n").rules, ["o", "g"]);
});

test("cyrillic input maps to the same rules", () => {
  const r = explain("Ўзбекистон");
  assert.equal(r.cyrillic, true);
  assert.equal(r.result, "Özbekiston");
  assert.deepEqual(r.rules, ["o"]);
  assert.deepEqual(explain("Исҳоқ").rules, ["sh2"]);
  assert.deepEqual(explain("маъно").rules, ["tutuq"]);
  assert.deepEqual(explain("шаҳар чой").rules, ["sh", "ch"]);
  assert.deepEqual(explain("мўъжиза").rules, ["o"]);
});

test("lookalike letters are named and replaced", () => {
  const r = explain("ișlaş");
  assert.deepEqual(r.lookalikes, [{ bad: "ș", good: "ş", note: "ostida ilmoq" }]);
  assert.equal(r.result, "işlaş");
  assert.equal(explain("toġ").lookalikes[0].good, "ğ");
  assert.equal(explain("İstanbul").lookalikes[0].good, "I");
  assert.equal(explain("ıssiq").lookalikes[0].good, "i");
  assert.equal(explain("őrdak").lookalikes[0].note, "tepasida ikki nuqta");
});

test("a correct new-alphabet word is ok", () => {
  const r = explain("özbek");
  assert.equal(r.ok, true);
  assert.deepEqual(r.rules, []);
  assert.equal(explain("o'zbek").ok, false);
  assert.equal(explain("iș").ok, false);
});

test("ng is flagged as unchanged", () => {
  assert.equal(explain("tong").ng, true);
  assert.equal(explain("tog'").ng, false);
});

test("empty input", () => {
  assert.deepEqual(explain("  "), { result: "", rules: [], cyrillic: false, ok: false, ng: false, lookalikes: [] });
});

test("every rule has its explanation", () => {
  for (const id of ["o", "g", "sh", "ch", "sh2", "tutuq"]) assert.ok(RULE_TEXT[id]);
});
