// Eski lotin va kirill sahifalar yangi lotin juftidan faqat matni bilan farq qiladi; JSON-LD har versiyaning öz tili va manzilida.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const webDir = fileURLToPath(new URL("../", import.meta.url));
function pages(dir = webDir, rel = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return pages(join(dir, e.name), `${rel}${e.name}/`);
    return e.name === "index.html" ? [rel] : [];
  });
}
const ALL = pages().sort();
const load = (rel) => readFileSync(join(webDir, rel, "index.html"), "utf8");
const YANGI = ALL.filter((rel) => !/^(eski|kr|ru)\//.test(rel));

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

// <body> tuzilmasi: teglar va id/class/for/aria-controls/data-* atributlari, matnsiz.
// Boşqa versiyaga tegişli data-faqat bloklari (içidagi hamma narsa bilan) tuşirib qoldiriladi.
function shape(html, til) {
  const body = html.slice(html.indexOf("<body"));
  const out = [];
  let skip = null; // { tag, depth }
  for (const [tagSrc, close, name] of body.matchAll(/<(\/?)([a-zA-Z][\w-]*)(?:"[^"]*"|'[^']*'|[^'">])*>/g)) {
    const tag = name.toLowerCase();
    const selfClosing = VOID.has(tag) || tagSrc.endsWith("/>");
    if (skip) {
      if (tag === skip.tag && !selfClosing) skip.depth += close ? -1 : 1;
      if (skip.depth === 0) skip = null;
      continue;
    }
    const only = !close && tagSrc.match(/\sdata-faqat="([^"]*)"/)?.[1];
    if (only && only !== til) {
      if (!selfClosing) skip = { tag, depth: 1 };
      continue;
    }
    const attrs = close ? [] : [...tagSrc.matchAll(/\s((?:id|class|for|aria-controls|data-[\w-]+)="[^"]*")/g)].map(([, a]) => a);
    out.push(`${close}${tag} ${attrs.join(" ")}`.trim());
  }
  return out;
}

test("eski va kirill sahifalarning tuzilmasi yangi lotin jufti bilan bir xil", () => {
  assert.ok(YANGI.length > 100, String(YANGI.length));
  for (const rel of YANGI) {
    const latin = load(rel);
    for (const [prefix, til] of [["eski/", "eski"], ["kr/", "kr"]]) {
      assert.deepEqual(shape(load(prefix + rel), til), shape(latin, til), `${prefix}${rel}`);
    }
  }
});

test("FAQPage: inLanguage sahifaning öz tili, @id öz manzilida", () => {
  let seen = 0;
  for (const rel of ALL) {
    const html = load(rel);
    if (!html.includes('"FAQPage"')) continue;
    const lang = html.match(/<html lang="([^"]+)"/)[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)[1];
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])["@graph"];
    const faq = graph.find((n) => n["@type"] === "FAQPage");
    assert.equal(faq.inLanguage, lang, rel);
    assert.ok(faq["@id"].startsWith(`${canonical}#`), `${rel}: ${faq["@id"]}`);
    seen++;
  }
  assert.ok(seen >= 4, String(seen));
});

test("kirill bosh sahifa sarlavhasi kirill sörovlariga mos", () => {
  const title = load("kr/").match(/<title>([^<]+)<\/title>/)[1].toLowerCase();
  for (const words of ["янги алифбо клавиатура", "кирилл-лотин конвертор"]) assert.ok(title.includes(words), title);
});
