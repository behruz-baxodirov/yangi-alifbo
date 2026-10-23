import { test } from "node:test";
import assert from "node:assert/strict";
import { EXCLUDE } from "../../web/kirill.js";
import { localizeHtml, isExcludedSelectorSupported } from "./html.mjs";

const up = (s) => s.toUpperCase();

test("text nodes change, excluded elements do not", () => {
  assert.equal(localizeHtml("<p>şahar <code>ş</code></p>", up), "<p>ŞAHAR <code>ş</code></p>");
  assert.equal(localizeHtml('<p data-lotin>a <b>b</b></p>c', up), '<p data-lotin>a <b>b</b></p>C');
  assert.equal(localizeHtml('<span lang="ru">я</span><span lang="en">x</span>y', up), '<span lang="ru">я</span><span lang="en">x</span>Y');
  assert.equal(localizeHtml('<div class="out">a</div>', up), '<div class="out">a</div>');
  assert.equal(localizeHtml('<p>a<br>b<input value="x">c</p>', up), '<p>A<br>B<input value="x">C</p>');
});

test("only prose attributes change", () => {
  assert.equal(localizeHtml('<img alt="non" src="a.png">', up), '<img alt="NON" src="a.png">');
  assert.equal(localizeHtml('<a href="/x" title="t" aria-label="l">a</a>', up), '<a href="/x" title="T" aria-label="L">A</a>');
  assert.equal(
    localizeHtml('<!-- x --><meta charset="utf-8"><meta name="description" content="d"><meta property="og:url" content="u">', up),
    '<!-- x --><meta charset="utf-8"><meta name="description" content="D"><meta property="og:url" content="u">',
  );
});

test("entities are never passed to the converter", () => {
  assert.equal(localizeHtml("<p>a &amp; b &#8217; c</p>", up), "<p>A &amp; B &#8217; C</p>");
});

test("JSON-LD: prose converted, technical keys and URLs untouched", () => {
  const ld = '<script type="application/ld+json">{"@type":"FAQPage","name":"a","url":"https://x.uz/a","x":["b"]}</script>';
  const out = localizeHtml(ld, up);
  assert.match(out, /"name": "A"/);
  assert.match(out, /"url": "https:\/\/x\.uz\/a"/);
  assert.match(out, /"@type": "FAQPage"/);
  assert.match(out, /"B"/);
  assert.equal(localizeHtml("<script>var a = 'ş';</script>", up), "<script>var a = 'ş';</script>");
});

test("every simple selector in EXCLUDE is honoured", () => {
  for (const sel of EXCLUDE.split(",").map((s) => s.trim())) assert.ok(isExcludedSelectorSupported(sel), sel);
});

test("letters that change length in lower case do not shift raw elements", () => {
  assert.equal(localizeHtml("<p>İ</p><script>x</script><p>a</p>", up), "<p>İ</p><script>x</script><p>A</p>");
});
