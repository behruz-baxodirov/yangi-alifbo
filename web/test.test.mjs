import { test } from "node:test";
import assert from "node:assert/strict";
import { convert } from "./converter.js";
import { QUESTIONS, grade, shuffle } from "./test-savollar.js";

test("ten questions with three distinct options each", () => {
  assert.equal(QUESTIONS.length, 10);
  for (const { q, options, why } of QUESTIONS) {
    assert.ok(q && why);
    assert.equal(options.length, 3);
    assert.equal(new Set(options).size, 3, q);
  }
  assert.equal(QUESTIONS[4].options[0], "Isʼhoq");
  assert.equal(QUESTIONS[9].options[0], "22.04.2027");
});

test("the correct option is what the converter gives", () => {
  for (const i of [0, 1, 2, 3, 4, 5, 6]) {
    const word = QUESTIONS[i].q.match(/«(.+?)»/)[1];
    assert.equal(convert(word), QUESTIONS[i].options[0], QUESTIONS[i].q);
  }
  assert.equal(convert("Ўзбекистон"), QUESTIONS[8].options[0]);
});

test("question and explanation copy is in the new alphabet", () => {
  for (const { q, why } of QUESTIONS) {
    for (const text of [q, why]) {
      const plain = text.replace(/«[^»]*»/g, "").replace(/ЎРҚ-1184/g, "");
      assert.equal(convert(plain), plain, text);
    }
  }
});

test("grades by score band", () => {
  assert.match(grade(10), /^Aʼlo!/);
  assert.match(grade(9), /^Zör!/);
  assert.match(grade(7), /^Zör!/);
  assert.match(grade(6), /^Yomon emas\./);
  assert.match(grade(4), /^Yomon emas\./);
  assert.match(grade(3), /^Boşlaniş/);
  assert.match(grade(0), /^Boşlaniş/);
});

test("shuffle returns a new permutation", () => {
  const items = [1, 2, 3];
  const out = shuffle(items, () => 0);
  assert.deepEqual([...out].sort(), [1, 2, 3]);
  assert.deepEqual(items, [1, 2, 3]);
  assert.notEqual(out, items);
});
