import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readZip, writeZip } from "./zip.js";

const enc = new TextEncoder();

test("write then read gives the same entries in the same order", async () => {
  const entries = [
    { name: "[Content_Types].xml", data: enc.encode("<Types/>") },
    { name: "word/document.xml", data: enc.encode("<w:t>Özbekiston şahar</w:t>".repeat(50)) },
    { name: "media/bin", data: new Uint8Array([0, 255, 1, 254, 7]) },
  ];
  const back = await readZip(await writeZip(entries));
  assert.deepEqual(back.map((e) => e.name), entries.map((e) => e.name));
  back.forEach((e, i) => assert.deepEqual(e.data, entries[i].data));
});

test("reads a real .docx made by macOS textutil", async () => {
  const bytes = new Uint8Array(readFileSync(new URL("../core/fixtures/namuna.docx", import.meta.url)));
  const doc = (await readZip(bytes)).find((e) => e.name === "word/document.xml");
  assert.ok(doc);
  assert.match(new TextDecoder().decode(doc.data), /zbekiston/);
});

test("garbage is rejected", async () => {
  await assert.rejects(readZip(new Uint8Array([1, 2, 3])), /zip/);
});
