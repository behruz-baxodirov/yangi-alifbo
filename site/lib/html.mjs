// HTML ichidagi matnni ögiradi (eski lotin, kirill), teglarga va EXCLUDE dagi elementlarga tegmaydi.
// Brauzerdagi yozuv.js / kirill.js bilan bir xil qoida: EXCLUDE içi va undagi atributlar özgarmaydi.
import { EXCLUDE } from "../../web/kirill.js";

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const RAW = new Set(["script", "style", "textarea"]);
const PROSE_ATTRS = new Set(["title", "alt", "placeholder", "aria-label"]);
const META_CONTENT = /^(description|og:title|og:description|twitter:title|twitter:description)$/;
const LD_KEEP = new Set(["@context", "@type", "@id", "url", "image", "logo", "sameAs", "inLanguage", "contentUrl"]);

// EXCLUDE dagi oddiy selektorlar: teg, [attr], [attr="v"], .class
function parseSelector(sel) {
  let m;
  if ((m = sel.match(/^[a-z][a-z0-9-]*$/))) return { tag: sel };
  if ((m = sel.match(/^\[([\w-]+)\]$/))) return { attr: m[1] };
  if ((m = sel.match(/^\[([\w-]+)="([^"]*)"\]$/))) return { attr: m[1], value: m[2] };
  if ((m = sel.match(/^\.([\w-]+)$/))) return { cls: m[1] };
  return null;
}

const SELECTORS = EXCLUDE.split(",").map((s) => parseSelector(s.trim()));

export function isExcludedSelectorSupported(sel) {
  return parseSelector(sel) !== null;
}

function parseAttrs(src) {
  const attrs = {};
  for (const m of src.matchAll(/([^\s=/>]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g)) {
    attrs[m[1].toLowerCase()] = m[2] === undefined ? "" : m[2].replace(/^["']|["']$/g, "");
  }
  return attrs;
}

function matches(tag, attrs) {
  return SELECTORS.some((s) =>
    s && ((s.tag && s.tag === tag)
      || (s.attr && s.attr in attrs && (s.value === undefined || attrs[s.attr] === s.value))
      || (s.cls && (attrs.class ?? "").split(/\s+/).includes(s.cls))));
}

// Belgi nomlari (&amp; &#8217;) ögirgiçga berilmaydi.
const text = (s, fn) => s.split(/(&#?\w+;)/).map((p, i) => (i % 2 ? p : fn(p))).join("");

function convertTag(tagSrc, tag, attrs, fn) {
  return tagSrc.replace(/([^\s=/<>]+)(\s*=\s*)("[^"]*"|'[^']*')/g, (all, name, eq, quoted) => {
    const n = name.toLowerCase();
    const prose = PROSE_ATTRS.has(n)
      || (n === "content" && tag === "meta" && META_CONTENT.test(attrs.name ?? attrs.property ?? ""));
    if (!prose) return all;
    const q = quoted[0];
    return `${name}${eq}${q}${text(quoted.slice(1, -1), fn)}${q}`;
  });
}

function convertLd(json, fn) {
  const walk = (v, key) => {
    if (typeof v === "string") return LD_KEEP.has(key) || /^https?:/.test(v) ? v : fn(v);
    if (Array.isArray(v)) return v.map((x) => walk(x, key));
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, k)]));
    return v;
  };
  return JSON.stringify(walk(JSON.parse(json), ""), null, 1);
}

export function localizeHtml(html, fn) {
  let out = "";
  const stack = []; // {tag, excluded}
  const excluded = () => stack.length > 0 && stack[stack.length - 1].excluded;
  const re = /<!--[\s\S]*?-->|<![^>]*>|<\/?([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g;
  let last = 0, m;
  while ((m = re.exec(html))) {
    if (m.index > last) {
      const t = html.slice(last, m.index);
      out += excluded() ? t : text(t, fn);
    }
    last = re.lastIndex;
    const tagSrc = m[0];
    if (!m[1]) { out += tagSrc; continue; } // izoh yoki doctype
    const tag = m[1].toLowerCase();
    if (tagSrc[1] === "/") {
      const i = stack.map((s) => s.tag).lastIndexOf(tag);
      if (i >= 0) stack.length = i;
      out += tagSrc;
      continue;
    }
    const attrs = parseAttrs(m[2]);
    const ld = tag === "script" && attrs.type === "application/ld+json";
    const ex = excluded() || (!ld && matches(tag, attrs));
    out += ex ? tagSrc : convertTag(tagSrc, tag, attrs, fn);
    if (RAW.has(tag)) {
      // toLowerCase() emas: "İ" kabi harflar uzunlikni özgartirib, indeksni suradi.
      const close = new RegExp(`</${tag}`, "ig");
      close.lastIndex = last;
      const end = close.exec(html);
      const stop = end ? end.index : html.length;
      const body = html.slice(last, stop);
      out += ld && !ex ? convertLd(body, fn) : body;
      last = re.lastIndex = stop;
      continue;
    }
    if (!VOID.has(tag) && !tagSrc.endsWith("/>")) stack.push({ tag, excluded: ex });
  }
  const tail = html.slice(last);
  return out + (excluded() ? tail : text(tail, fn));
}
