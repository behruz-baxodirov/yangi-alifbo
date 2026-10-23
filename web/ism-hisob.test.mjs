import { test } from "node:test";
import assert from "node:assert/strict";
import { ismKarta } from "./ism-hisob.js";

test("old latin, cyrillic and capitals in, new alphabet out", () => {
  assert.deepEqual(ismKarta("G'ulom"), { yangi: "Ğulom", eski: "Gʻulom", changed: ["ğ"] });
  assert.equal(ismKarta("Шаҳзод").yangi, "Şahzod");
  assert.equal(ismKarta("SHAHZOD").yangi, "ŞAHZOD");
  assert.deepEqual(ismKarta("Choʻlpon").changed, ["ö", "ç"]);
});

test("spaces trimmed, first letter capitalised, unchanged name has no changed letters", () => {
  assert.deepEqual(ismKarta("  anvar "), { yangi: "Anvar", eski: "Anvar", changed: [] });
  assert.equal(ismKarta("shahlo  karimova").yangi, "Şahlo Karimova");
});

test("empty input gives null and long input is cut to 40 letters", () => {
  assert.equal(ismKarta("   "), null);
  assert.equal([...ismKarta("a".repeat(60)).yangi].length, 40);
});
