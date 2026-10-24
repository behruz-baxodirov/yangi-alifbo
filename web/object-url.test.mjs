import { test } from "node:test";
import assert from "node:assert/strict";
import { createObjectUrls } from "./object-url.js";

test("replacing a preview releases its previous URL and cleanup releases the rest", () => {
  const revoked = [];
  let n = 0;
  const urls = createObjectUrls({ createObjectURL: () => `blob:${++n}`, revokeObjectURL: (url) => revoked.push(url) });
  assert.equal(urls.replace("preview", {}), "blob:1");
  assert.equal(urls.replace("preview", {}), "blob:2");
  urls.replace("download", {});
  assert.deepEqual(revoked, ["blob:1"]);
  urls.clear();
  urls.clear();
  assert.deepEqual(revoked, ["blob:1", "blob:2", "blob:3"]);
});
