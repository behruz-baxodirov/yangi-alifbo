// Sayt qobiği: un fon, qahrabo lenta, nuqta qatorlari endi tana töriga moslanmaydi.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const css = read("styles.css");

test("ground is flour without the dot grid", () => {
  const body = css.match(/\nbody \{[^}]*\}/)[0];
  assert.match(body, /background-color: var\(--flour\)/);
  assert.doesNotMatch(body, /radial-gradient/);
});

test("flour-deep token is defined", () => {
  assert.match(css, /--flour-deep:\s*#f4e8d2/);
});

test("dot rows no longer align to a page grid", () => {
  assert.doesNotMatch(read("app.js"), /alignDotRows/);
  assert.doesNotMatch(css, /--phase/);
});
