import { test } from "node:test";
import assert from "node:assert/strict";
import { daysLeft, dayDots, lawPhase } from "./sanoq.js";

test("days left until the law is in force", () => {
  assert.equal(daysLeft(new Date(2026, 9, 23)), 181);
  assert.equal(daysLeft(new Date(2027, 3, 21)), 1);
  assert.equal(daysLeft(new Date(2027, 3, 22)), 0);
  assert.equal(daysLeft(new Date(2027, 5, 1)), 0);
});

test("one dot per day from signing to entry into force", () => {
  assert.deepEqual(dayDots(new Date(2026, 9, 21)), { total: 183, passed: 0 });
  assert.equal(dayDots(new Date(2026, 9, 23)).passed, 2);
  assert.equal(dayDots(new Date(2026, 5, 1)).passed, 0);
  assert.equal(dayDots(new Date(2028, 0, 1)).passed, 183);
});

test("phase: before, on the day, after", () => {
  assert.equal(lawPhase(new Date(2027, 3, 21)), "oldin");
  assert.equal(lawPhase(new Date(2027, 3, 22, 18)), "bugun");
  assert.equal(lawPhase(new Date(2027, 3, 23)), "keyin");
});

test("time of day does not change the count", () => {
  assert.equal(daysLeft(new Date(2026, 9, 23, 23, 59)), 181);
  assert.equal(daysLeft(new Date(2026, 9, 23, 0, 1)), 181);
});
