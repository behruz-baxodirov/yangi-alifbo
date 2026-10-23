import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { bundleVidjet } from "./bundle.mjs";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const bundle = bundleVidjet(read("../../web/converter.js"), read("../../web/vidjet-src.js"));

test("the widget is one classic script without module syntax", () => {
  assert.doesNotMatch(bundle, /^\s*(export|import)\s/m);
  assert.match(bundle, /^\/\* yozgich\.uz vidjet/);
});

test("it runs on a page without any data-yozgich element", () => {
  const document = { readyState: "complete", querySelectorAll: () => [] };
  assert.doesNotThrow(() => vm.runInNewContext(bundle, { document }));
});

test("the converter inside works", () => {
  const ctx = { document: { readyState: "complete", querySelectorAll: () => [] } };
  vm.runInNewContext(`${bundle}\nthis.out = typeof convert;`, ctx);
  assert.equal(ctx.out, "undefined"); // hammasi IIFE içida, global nomlar ifloslanmaydi
});

test("web/vidjet.js is the current bundle", () => {
  assert.equal(read("../../web/vidjet.js"), bundle);
});
