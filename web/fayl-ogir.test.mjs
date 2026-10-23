import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { convertText, convertSubtitle, convertDocxXml, convertFile } from "./fayl-ogir.js";
import { readZip } from "./zip.js";

const opts = { tutuq: true };
const runs = (...texts) => `<w:p>${texts.map((x) => `<w:r><w:t>${x}</w:t></w:r>`).join("")}</w:p>`;
const texts = (xml) => [...xml.matchAll(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]);

test("a letter and its apostrophe in different runs still become one letter", () => {
  assert.deepEqual(texts(convertDocxXml(runs("O", "'zbek"), opts).xml), ["Ö", "zbek"]);
  assert.deepEqual(texts(convertDocxXml(runs("O", "&apos;zbek"), opts).xml), ["Ö", "zbek"]);
  assert.deepEqual(texts(convertDocxXml(runs("O", "’zbek"), opts).xml), ["Ö", "zbek"]);
  assert.deepEqual(texts(convertDocxXml(runs("s", "hahar"), opts).xml), ["ş", "ahar"]);
  assert.deepEqual(texts(convertDocxXml(runs("ma", "'no"), opts).xml), ["ma", "ʼno"]);
});

test("only text runs change; field codes, attributes and entities stay", () => {
  const xml = '<w:p><w:r><w:instrText>HYPERLINK "sh"</w:instrText></w:r><w:r><w:t xml:space="preserve">choy &amp; non </w:t></w:r></w:p>';
  const out = convertDocxXml(xml, opts);
  assert.match(out.xml, /<w:instrText>HYPERLINK "sh"<\/w:instrText>/);
  assert.match(out.xml, /<w:t xml:space="preserve">çoy &amp; non <\/w:t>/);
  assert.equal(out.changed, 1);
});

test("subtitles: numbers and timings untouched", () => {
  const srt = "1\n00:00:01,000 --> 00:00:02,000\nshahar\n\n2\n00:00:03,000 --> 00:00:04,000\nchoy ich\n";
  assert.equal(convertSubtitle(srt, opts).text, "1\n00:00:01,000 --> 00:00:02,000\nşahar\n\n2\n00:00:03,000 --> 00:00:04,000\nçoy iç\n");
  assert.equal(convertSubtitle("WEBVTT\n\n00:01.000 --> 00:02.000\no'g'il\n", opts).text, "WEBVTT\n\n00:01.000 --> 00:02.000\nöğil\n");
});

test("plain text keeps its BOM and converts Cyrillic", () => {
  const r = convertText("﻿Шаҳар", opts);
  assert.equal(r.text, "﻿Şahar");
  assert.equal(r.changed, 1);
});

test("a real .docx end to end", async () => {
  const bytes = new Uint8Array(readFileSync(new URL("../core/fixtures/namuna.docx", import.meta.url)));
  const out = await convertFile({ name: "namuna.docx", bytes }, opts);
  assert.equal(out.name, "namuna-yangi.docx");
  assert.ok(out.changed >= 8);
  const doc = new TextDecoder().decode((await readZip(out.bytes)).find((e) => e.name === "word/document.xml").data);
  assert.match(doc, /Özbekiston/);
  assert.match(doc, /şahar/);
  assert.match(doc, /Isʼhoq/);
});

test("unsupported formats and huge files are refused", async () => {
  await assert.rejects(convertFile({ name: "a.pdf", bytes: new Uint8Array(3) }, opts), /format/);
  await assert.rejects(convertFile({ name: "a.txt", bytes: new Uint8Array(20 * 1024 * 1024 + 1) }, opts), /hajm/);
  const txt = await convertFile({ name: "Xat.TXT", bytes: new TextEncoder().encode("o'zbek") }, opts);
  assert.equal(txt.name, "Xat-yangi.TXT");
  assert.equal(new TextDecoder().decode(txt.bytes), "özbek");
});

test("a Windows-1251 subtitle is read as Cyrillic, not destroyed", async () => {
  const cp1251 = new Uint8Array([0x31, 0x0a, 0xd8, 0xe0, 0xf5, 0xe0, 0xf0, 0x0a]); // "1\nШахар\n"
  const out = await convertFile({ name: "a.srt", bytes: cp1251 }, opts);
  assert.equal(new TextDecoder().decode(out.bytes), "1\nŞaxar\n");
  assert.equal(out.changed, 1);
});
