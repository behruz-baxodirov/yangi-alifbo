import { test } from "node:test";
import assert from "node:assert/strict";
import { renderExplain } from "./soz-izoh.js";

test("explanation for a changed word", () => {
  const r = renderExplain("sho'x");
  assert.equal(r.result, "şöx");
  assert.deepEqual(r.rules.sort(), ["o", "sh"]);
  assert.match(r.whyHtml, /<li><b data-lotin>sh → ş<\/b>: bitta harf<\/li>/);
  assert.equal(r.wordHtml, "<mark>ş</mark><mark>ö</mark>x");
});

test("lookalike letters and an already correct word", () => {
  assert.match(renderExplain("ő").whyHtml, /class="bad"><b data-lotin>ő<\/b> özbekça harf emas\. Töğrisi <b data-lotin>ö<\/b> \(tepasida ikki nuqta\)\./);
  assert.match(renderExplain("şahar").whyHtml, /Bu söz yangi alifboda töğri yozilgan\./);
  assert.equal(renderExplain("  ").result, "");
});
