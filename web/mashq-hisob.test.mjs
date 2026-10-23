import { test } from "node:test";
import assert from "node:assert/strict";
import { liveOk, judgeWord, summary } from "./mashq-hisob.js";
import { MATN } from "./mashq-matn.js";

test("the word in progress tolerates Yozgiç's in-between o'", () => {
  assert.equal(liveOk("öğil", "o'"), true);
  assert.equal(liveOk("öğil", "ö"), true);
  assert.equal(liveOk("öğil", ""), true);
  assert.equal(liveOk("öğil", "ox"), false);
});

test("a finished word must be typed in the new alphabet", () => {
  assert.deepEqual(judgeWord("öğil", "öğil"), { ok: true, missed: [] });
  assert.deepEqual(judgeWord("öğil", "o'g'il"), { ok: false, missed: ["ö", "ğ"] });
  assert.deepEqual(judgeWord("Şahar", "şahar"), { ok: false, missed: [] });
  assert.equal(judgeWord("çoy", "çoy").ok, true); // NFD
});

test("speed, accuracy and the most missed letter", () => {
  const r = [{ ok: true, missed: [] }, { ok: false, missed: ["ş"] }, { ok: true, missed: [] }, { ok: false, missed: ["ş"] }];
  assert.deepEqual(summary(r, 60000), { wpm: 2, accuracy: 50, worst: "ş" });
  assert.deepEqual(summary([], 0), { wpm: 0, accuracy: 0, worst: null });
});

test("practice texts: every mode filled, new alphabet only", () => {
  for (const mode of ["o", "g", "sh", "ch", "aralash", "gaplar"]) {
    assert.ok(MATN[mode].length >= 10, mode);
    for (const item of MATN[mode]) assert.doesNotMatch(item.replace(/sʼh/gi, ""), /[oOgG][''ʻ]|sh|ch/i, item);
  }
  for (const [mode, letter] of [["o", "ö"], ["g", "ğ"], ["sh", "ş"], ["ch", "ç"]]) {
    assert.ok(MATN[mode].every((w) => w.toLowerCase().includes(letter)), mode);
  }
});
