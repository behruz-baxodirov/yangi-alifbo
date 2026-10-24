// Fayllarni yangi alifboga ögiriş: matn (.txt .md .csv), subtitr (.srt .vtt) va Word (.docx).
// Hammasi brauzerda: fayl heç qayerga yuborilmaydi.
import { convert, convertSegments } from "./converter.js";
import { readZip, writeZip } from "./zip.js";

const MAX_BYTES = 20 * 1024 * 1024;
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
  const lines = text.split(/(\r?\n)/);
  let metadata = false;
  const out = lines.map((part, i) => {
    if (i % 2) return part;
    if (!part.trim()) { metadata = false; return part; }
    if (/^(?:\uFEFF?WEBVTT|NOTE\b|STYLE$|REGION$)/.test(part)) metadata = true;
    if (metadata || KEEP_LINE.test(part) || lines[i + 2]?.includes("-->")) return part;
    // Teg/atributlar va HTML entityʼlar saqlanadi; matn format teglari orasida ham birikadi.
    return part.split(/(&#?\w+;)/).map((piece, k) => {
      if (k % 2) return piece;
      const tokens = piece.split(/(<[^>]*>)/);
      const converted = convertSegments(tokens.filter((_, j) => j % 2 === 0), opts);
      return tokens.map((token, j) => j % 2 ? token : converted[j / 2]).join("");
    }).join("");
  }).join("");
  return { text: out, changed: delta(text, out) };
}

const ENTITY = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (s) => s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (all, e) =>
  e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITY[e] ?? all);
const encode = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Word XML: yonma-yon <w:t> matnlari umumiy kontekstda ögiriladi, har belgi asl run uslubida qoladi.
 * Abzats, satr, tab va maydon çegaralari kontekstni uzadi; XMLʼning qolgan qismi özgarmaydi.
 */
export function convertDocxXml(xml, opts) {
  const tokens = [];
  let group = [];
  const flush = () => {
    const converted = convertSegments(group.map((tok) => tok.text), opts);
    group.forEach((tok, i) => { tok.converted = converted[i]; });
    group = [];
  };
  for (const m of xml.matchAll(/<w:t(\s[^>]*)?>([\s\S]*?)<\/w:t>|<\/?w:(?:p|br|tab|cr|fldChar|instrText|drawing|object|sym)\b[^>]*>/g)) {
    if (m[2] === undefined) { flush(); continue; }
    const tok = { start: m.index, end: m.index + m[0].length, attrs: m[1] ?? "", text: decode(m[2]) };
    tokens.push(tok);
    group.push(tok);
  }
  flush();
  let out = "", last = 0, changed = 0;
  for (const tok of tokens) {
    const text = tok.converted;
    changed += delta(tok.text, text);
    // Almaşmagan XML, jumladan entity yozilişi ham asl holida qoladi.
    const rendered = text === tok.text ? xml.slice(tok.start, tok.end) : `<w:t${tok.attrs}>${encode(text)}</w:t>`;
    out += xml.slice(last, tok.start) + rendered;
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
