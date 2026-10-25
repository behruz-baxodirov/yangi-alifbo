import { test } from "node:test";
import assert from "node:assert/strict";
import { raceAt, savings } from "./vaqt.js";

test("at the start both lanes are empty and at zero", () => {
  const r = raceAt(0);
  assert.equal(r.slow.clock, "0,0 s");
  assert.equal(r.fast.clock, "0,0 s");
  assert.equal(r.slow.text, "");
  assert.equal(r.finished, false);
});

test("Yozgiç lane: o, then o', then ö and done at 0.4 s", () => {
  assert.equal(raceAt(0.3).fast.text, "Ko'");
  assert.equal(raceAt(0.3).fast.chip, 1);
  const r = raceAt(1);
  assert.equal(r.fast.done, true);
  assert.equal(r.fast.clock, "0,4 s");
  assert.equal(r.fast.text, "Kö");
});

test("manual lane walks search, copy, back, paste", () => {
  assert.equal(raceAt(1).slow.step, 0);
  assert.equal(raceAt(1).slow.search, true);
  assert.equal(raceAt(3).slow.step, 1);
  assert.equal(raceAt(4).slow.step, 2);
  assert.equal(raceAt(5).slow.step, 3);
  assert.equal(raceAt(5).slow.search, false);
});

test("after 6.4 s both lanes stop and the result shows", () => {
  const r = raceAt(7);
  assert.equal(r.slow.clock, "6,4 s");
  assert.equal(r.slow.text, "Kö");
  assert.equal(r.slow.step, -1);
  assert.equal(r.finished, true);
  assert.equal(r.slow.fill, 0.8);
  assert.equal(r.fast.fill, 0.05);
});

test("savings: 6 s per letter", () => {
  assert.deepEqual(savings(40), { week: 28, year: 24, count: 14600 });
  assert.equal(savings(200).count, 73000);
});
