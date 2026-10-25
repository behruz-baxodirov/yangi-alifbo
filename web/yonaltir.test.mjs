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

test("index.html paths count as home too", () => {
  assert.equal(redirectFor("/index.html", "#test"), "/test/");
  assert.equal(redirectFor("/kr/index.html", "#qoidalar"), "/kr/qoidalar/");
});

test("the inline head script redirects exactly like redirectFor, before analytics", async () => {
  const { readFileSync } = await import("node:fs");
  for (const page of ["../site/pages/index.html", "../site/ru/index.html"]) {
    const html = readFileSync(new URL(page, import.meta.url), "utf8");
    const head = html.match(/<!--head-->([\s\S]*?)<!--\/head-->/)[1];
    const code = head.match(/<script id="eski-havola">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(code, `${page}: inline redirect script`);
    for (const pathname of ["/", "/eski/", "/kr/", "/ru/", "/index.html", "/fayl/"]) {
      for (const hash of ["#telefonda", "#qoidalar", "#soz-tekshir", "#test", "#konverter", ""]) {
        let to = null;
        new Function("location", code)({ pathname, hash, replace: (u) => { to = u; } });
        assert.equal(to, redirectFor(pathname, hash), `${page} ${pathname}${hash}`);
      }
    }
  }
});
