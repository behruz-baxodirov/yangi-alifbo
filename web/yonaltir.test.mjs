import { test } from "node:test";
import assert from "node:assert/strict";
import { redirectFor } from "./yonaltir.js";

test("old home anchors lead to the new pages in the same version", () => {
  assert.equal(redirectFor("/", "#telefonda"), "/telefon/");
  assert.equal(redirectFor("/", "#qoidalar"), "/qoidalar/");
  assert.equal(redirectFor("/", "#soz-tekshir"), "/qoidalar/#soz-tekshir");
  assert.equal(redirectFor("/", "#test"), "/test/");
  assert.equal(redirectFor("/kr/", "#qoidalar"), "/kr/qoidalar/");
  assert.equal(redirectFor("/eski/", "#test"), "/eski/test/");
  assert.equal(redirectFor("/ru/", "#telefonda"), "/ru/telefon/");
});

test("other anchors and other pages stay where they are", () => {
  assert.equal(redirectFor("/", "#konverter"), null);
  assert.equal(redirectFor("/", ""), null);
  assert.equal(redirectFor("/fayl/", "#telefonda"), null);
});
