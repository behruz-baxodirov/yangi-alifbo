// Fayllarni yangi alifboga ögiriş: matn (.txt .md .csv), subtitr (.srt .vtt) va Word (.docx).
// Hammasi brauzerda: fayl heç qayerga yuborilmaydi.
import { convert } from "./converter.js";
import { readZip, writeZip } from "./zip.js";

const MAX_BYTES = 20 * 1024 * 1024;
const APOS = "'`‘’ʻʼ´";
const NEW = /[öğşçÖĞŞÇʼ]/gu;
const count = (s) => (s.match(NEW) ?? []).length;
const delta = (before, after) => Math.max(0, count(after) - count(before));

export function convertText(text, opts) {
  const out = convert(text, opts);
  return { text: out, changed: delta(text, out) };
}

// Raqam, vaqt (-->), WEBVTT va NOTE qatorlari, böş qatorlar tegilmaydi.
const KEEP_LINE = /^(\d+|WEBVTT.*|NOTE\b.*|.*-->.*|\s*)$/;

export function convertSubtitle(text, opts) {
  const out = text.split(/(\r?\n)/).map((part, i) => (i % 2 || KEEP_LINE.test(part) ? part : convert(part, opts))).join("");
  return { text: out, changed: delta(text, out) };
}

const ENTITY = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (s) => s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (all, e) =>
  e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITY[e] ?? all);
const encode = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Word XML: faqat <w:t> matnlari özgaradi. Bir abzats içida bir run "o" bilan tugab, keyingisi
 * apostrof bilan boşlansa (yoki "s" + "h"), belgi oldingi runga köçiriladi; harf + ' + harf tutuq böladi.
 */
export function convertDocxXml(xml, opts) {
  const tokens = [];
  let para = 0;
  for (const m of xml.matchAll(/<w:t(\s[^>]*)?>([\s\S]*?)<\/w:t>|<\/w:p>/g)) {
    if (m[0] === "</w:p>") { para++; continue; }
    tokens.push({ start: m.index, end: m.index + m[0].length, attrs: m[1] ?? "", text: decode(m[2]), para });
  }
  for (let i = 0; i < tokens.length; i++) {
    const a = tokens[i];
    if (!a.text) continue;
    const b = tokens.slice(i + 1).find((x) => x.text);
    if (!b || b.para !== a.para) continue;
    if ((/[oOgG]$/.test(a.text) && APOS.includes(b.text[0])) || (/[sScC]$/.test(a.text) && /^[hH]/.test(b.text))) {
      a.text += b.text[0];
      b.text = b.text.slice(1);
    } else if (opts.tutuq && /\p{L}$/u.test(a.text) && APOS.includes(b.text[0]) && /^\p{L}/u.test(b.text.slice(1))) {
      b.text = "ʼ" + b.text.slice(1);
    }
  }
  let out = "", last = 0, changed = 0;
  for (const tok of tokens) {
    const before = decode(xml.slice(tok.start, tok.end).replace(/^<w:t[^>]*>|<\/w:t>$/g, ""));
    const text = convert(tok.text, opts);
    changed += delta(before, text);
    out += xml.slice(last, tok.start) + `<w:t${tok.attrs}>${encode(text)}</w:t>`;
    last = tok.end;
  }
  return { xml: out + xml.slice(last), changed };
}

const DOCX_PARTS = /^word\/(document|header\d*|footer\d*|footnotes|endnotes|comments)\.xml$/;

export async function convertDocx(bytes, opts) {
  const entries = await readZip(bytes);
  const dec = new TextDecoder(), enc = new TextEncoder();
  let changed = 0;
  for (const entry of entries) {
    if (!DOCX_PARTS.test(entry.name)) continue;
    const r = convertDocxXml(dec.decode(entry.data), opts);
    entry.data = enc.encode(r.xml);
    changed += r.changed;
  }
  return { bytes: await writeZip(entries), changed };
}

/** { name, bytes } → { name: "<nom>-yangi.<kengaytma>", bytes, changed }; Error("format") yoki Error("hajm"). */
export async function convertFile(file, opts) {
  if (file.bytes.length > MAX_BYTES) throw new Error("hajm");
  const dot = file.name.lastIndexOf(".");
  const ext = dot > 0 ? file.name.slice(dot + 1) : "";
  const name = `${dot > 0 ? file.name.slice(0, dot) : file.name}-yangi.${ext}`;
  const kind = ext.toLowerCase();
  // UTF-8 bölmasa (eski Windows subtitrlari), Windows-1251 deb öqiladi; natija doim UTF-8.
  const asText = () => {
    try {
      return new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }).decode(file.bytes);
    } catch {
      return new TextDecoder("windows-1251").decode(file.bytes);
    }
  };
  if (["txt", "md", "csv"].includes(kind) || ["srt", "vtt"].includes(kind)) {
    const r = kind === "srt" || kind === "vtt" ? convertSubtitle(asText(), opts) : convertText(asText(), opts);
    return { name, bytes: new TextEncoder().encode(r.text), changed: r.changed };
  }
  if (kind === "docx") {
    const r = await convertDocx(file.bytes, opts);
    return { name, ...r };
  }
  throw new Error("format");
}
