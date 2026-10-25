import { test } from "node:test";
import assert from "node:assert/strict";
import { liveOk, judgeWord, summary, localDay, readPractice } from "./mashq-hisob.js";
import { MATN } from "./mashq-matn.js";

test("the word in progress tolerates Yozgiç's in-between o'", () => {
  assert.equal(liveOk("öğil", "o'"), true);
  assert.equal(liveOk("öğil", "ö"), true);
  assert.equal(liveOk("öğil", ""), true);
  assert.equal(liveOk("öğil", "ox"), false);
  // Yangi harfdan oldingi tugma: o, s, c, g hali yakunlanmagan.
  assert.equal(liveOk("öğil", "o"), true);
  assert.equal(liveOk("şahar", "s"), true);
  assert.equal(liveOk("çoy", "c"), true);
  assert.equal(liveOk("toğ", "tog"), true);
  assert.equal(liveOk("çoy", "x"), false);
});

test("a finished word must be typed in the new alphabet", () => {
  assert.deepEqual(judgeWord("öğil", "öğil"), { ok: true, missed: [] });
  assert.deepEqual(judgeWord("öğil", "o'g'il"), { ok: false, missed: ["ö", "ğ"] });
  assert.deepEqual(judgeWord("Şahar", "şahar"), { ok: false, missed: [] });
  assert.equal(judgeWord("çoy", "çoy").ok, true); // NFD
});

test("a new letter in the wrong position still counts as a missed letter", () => {
  assert.deepEqual(judgeWord("şaş", "şas"), { ok: false, missed: ["ş"] });
  assert.deepEqual(judgeWord("şahar", "aşhar"), { ok: false, missed: ["ş"] });
});

test("practice days use the local date and stored records are validated", () => {
  assert.equal(localDay(new Date(2026, 9, 24, 0, 5)), "2026-10-24");
  for (const raw of [null, "{}", "false", '"x"', '{"best":8,"kunlar":null}', 'invalid']) {
    assert.deepEqual(readPractice(raw), { best: 0, kunlar: [] });
  }
  assert.deepEqual(readPractice('{"best":15,"kunlar":["2026-10-24","bad","2026-10-24"]}'), { best: 15, kunlar: ["2026-10-24"] });
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

test("last seven days of practice, oldest first", async () => {
  const { lastDays } = await import("./mashq-hisob.js");
  const today = new Date(2026, 9, 26);
  assert.deepEqual(lastDays([], today), [false, false, false, false, false, false, false]);
  assert.deepEqual(lastDays(["2026-10-26", "2026-10-24", "2026-10-01"], today), [false, false, false, false, true, false, true]);
  assert.equal(lastDays(["2026-10-20"], today)[0], true);
});

test("the last run is read back only when it is a sane record", async () => {
  const { readLast } = await import("./mashq-hisob.js");
  assert.equal(readLast(null), null);
  assert.equal(readLast('{"best":3,"kunlar":[]}'), null);
  assert.deepEqual(readLast('{"best":30,"kunlar":[],"last":{"wpm":30,"accuracy":96}}'), { wpm: 30, accuracy: 96 });
  for (const last of ['{"wpm":-1,"accuracy":50}', '{"wpm":20,"accuracy":101}', '{"wpm":"x","accuracy":50}', "7"]) {
    assert.equal(readLast(`{"best":1,"kunlar":[],"last":${last}}`), null, last);
  }
});
