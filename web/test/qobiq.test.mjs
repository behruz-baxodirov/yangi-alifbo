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

const rule = (sel) => css.match(new RegExp(`(?:^|\\n)${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] ?? "";
const rules = (sel) => [...css.matchAll(new RegExp(`(?:^|\\n)${sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{([^}]*)\\}`, "g"))].map((m) => m[1]);
const z = (sel) => Math.max(0, ...rules(sel).map((r) => Number(r.match(/z-index:\s*(\d+)/)?.[1] ?? 0)));

test("skip link sits above the header", () => {
  assert.ok(z(".skip") > z(".bar"), `.skip ${z(".skip")} <= .bar ${z(".bar")}`);
});

test("flour under the converter reaches the hero bottom on any screen height", () => {
  assert.match(rule(".hero"), /overflow-y: clip/);
  assert.doesNotMatch(rule(".try::before"), /vh/);
});

test("switcher list opens toward the left from the right edge", () => {
  assert.match(rule(".til-list"), /right: 0/);
  assert.doesNotMatch(rule(".til-list"), /left: 0/);
});

test("wordmark gives way on very narrow layouts", () => {
  assert.match(css, /@media \(max-width: 259px\) \{[^}]*\.logo span \{ display: none; \}/);
});

test("on phones the switcher name stays for screen readers", () => {
  const phone = css.match(/@media \(max-width: 639px\) \{[\s\S]*?\n\}/)[0];
  assert.doesNotMatch(phone, /\.til-nomi \{ display: none/);
  assert.match(phone, /\.til-nomi \{[^}]*clip/);
});

test("the last menu link before the download button has no divider", () => {
  assert.match(css, /\.site-menu nav a:not\(\.btn\):nth-last-child\(2\) \{ border-bottom: 0; \}/);
  assert.doesNotMatch(css, /last-of-type/);
});
