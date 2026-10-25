import { test } from "node:test";
import assert from "node:assert/strict";
import { WORDS, wordSteps } from "./sahna.js";

const presses = (steps) => steps.filter((s) => s.type === "press").map((s) => s.i);
const lastScreen = (steps) => steps.filter((s) => s.type === "screen").at(-1);

test("o'zbek: six presses, the pair shows old, then merges into ö", () => {
  const steps = wordSteps(WORDS[0]);
  assert.deepEqual(presses(steps), [0, 1, 2, 3, 4, 5]);
  const p1 = steps.findIndex((s) => s.type === "press" && s.i === 1);
  assert.deepEqual(steps[p1 + 1], { type: "old", text: "o'", before: "" });
  assert.deepEqual(steps[p1 + 2], { type: "merge", i: 0, to: "ö" });
  assert.deepEqual(lastScreen(steps), { type: "screen", text: "özbek", mark: 0 });
});

test("tog': the merge is on keys 2 and 3", () => {
  const steps = wordSteps(WORDS[2]);
  assert.ok(steps.some((s) => s.type === "merge" && s.i === 2 && s.to === "ğ"));
  assert.deepEqual(lastScreen(steps), { type: "screen", text: "toğ", mark: 2 });
});

test("the first key of a pair shows on screen before the merge", () => {
  const steps = wordSteps(WORDS[1]);
  assert.deepEqual(steps.slice(0, 2), [{ type: "press", i: 0 }, { type: "screen", text: "c", mark: -1 }]);
});

test("a pause blocks stage stamps until it runs out, and a longer pause wins", async () => {
  const { createPause } = await import("./sahna.js");
  const p = createPause();
  assert.equal(p.active(1000), false);
  p.pause(6000, 1000);
  assert.equal(p.active(1001), true);
  assert.equal(p.active(6999), true);
  assert.equal(p.active(7000), false);
  p.pause(6000, 2000);
  p.pause(1000, 3000);
  assert.equal(p.active(7500), true);
});
