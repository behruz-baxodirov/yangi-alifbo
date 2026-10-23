import { test } from "node:test";
import assert from "node:assert/strict";
import { NEW, checkTyping } from "./tekshir.js";

test("five letters are tracked, tutuq last", () => {
  assert.deepEqual(NEW, ["ö", "ğ", "ş", "ç", "ʼ"]);
});

test("empty or unrelated text waits", () => {
  assert.equal(checkTyping("").verdict, "kutish");
  assert.equal(checkTyping("   ").verdict, "kutish");
  assert.equal(checkTyping("salom dunyo").verdict, "kutish");
});

test("new letters light up, upper case too", () => {
  const r = checkTyping("Öğil ŞAHAR");
  assert.deepEqual(r.found, ["ö", "ğ", "ş"]);
  assert.equal(r.verdict, "ishlayapti");
});

test("all four letters means done, tutuq is optional", () => {
  assert.equal(checkTyping("öğil şahar çoy").verdict, "tayyor");
  assert.deepEqual(checkTyping("öğil şahar çoy maʼno").found, NEW);
});

test("decomposed ö (o + combining diaeresis) counts", () => {
  assert.deepEqual(checkTyping("ö").found, ["ö"]);
});

test("old forms left in the text mean Yozgic is off", () => {
  for (const text of ["o'g'il", "shahar", "choy", "Oʻzbek", "tog‘", "SH"]) {
    assert.equal(checkTyping(text).verdict, "ishlamadi", text);
  }
  assert.deepEqual(checkTyping("o'g'il shahar choy").old, ["o'", "g'", "sh", "ch"]);
});

test("s'h and other apostrophes are not old forms", () => {
  assert.equal(checkTyping("Is'hoq ma'no").verdict, "kutish");
});

test("any new letter wins over leftovers", () => {
  assert.equal(checkTyping("ö shahar").verdict, "ishlayapti");
});
