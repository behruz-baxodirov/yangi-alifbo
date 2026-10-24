import { test } from "node:test";
import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";

test("a pending word lookup never replaces a newer query", async () => {
  const listeners = {};
  const field = { value: "", addEventListener: (name, fn) => { listeners[name] = fn; } };
  const out = { innerHTML: "" };
  let resolve;
  const response = new Promise((done) => { resolve = done; });
  globalThis.document = {
    documentElement: { dataset: { til: "yangi" } }, body: {},
    querySelectorAll: () => [], getElementById: (id) => id === "soz-q" ? field : out,
  };
  globalThis.window = {};
  globalThis.fetch = () => response;
  await import("./soz-qidiruv.js");
  field.value = "shah";
  listeners.input();
  await delay(150);
  field.value = "anvar";
  listeners.input();
  resolve({ json: async () => [{ e: "Shahzod", y: "Şahzod", s: "shahzod" }, { e: "Anvar", y: "Anvar", s: "anvar" }] });
  await delay(0);
  assert.doesNotMatch(out.innerHTML, /Shahzod/);
  await delay(150);
  assert.match(out.innerHTML, /Anvar/);
});
