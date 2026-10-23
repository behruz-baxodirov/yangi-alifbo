// "Bu söz qanday yoziladi?" natijasi: bosh sahifa va /soz/ qidiruvi bir xil izoh körsatadi.
import { explain, RULE_TEXT } from "./soz.js";
import { t } from "./i18n.js";

const NEW_LETTERS = /[öğşçÖĞŞÇʼ]/u;
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const li = (html, cls = "") => `<li${cls ? ` class="${cls}"` : ""}>${html}</li>`;

/** result — yangi yozuv, rules — işlagan qoidalar (jadval qatorlari uçun), wordHtml va whyHtml — tayyor HTML. */
export function renderExplain(text) {
  const r = explain(text);
  if (!r.result) return { result: "", rules: [], wordHtml: "", whyHtml: "" };
  const changed = r.result !== text.trim();
  const wordHtml = [...r.result].map((ch) => (changed && NEW_LETTERS.test(ch) ? `<mark>${ch}</mark>` : esc(ch))).join("");
  const whyHtml = [
    r.cyrillic ? li(t("Kirill harflari lotinga ögirildi")) : "",
    ...r.rules.map((id) => {
      const { ex, note } = RULE_TEXT[id];
      return li(`<b data-lotin>${esc(ex)}</b>${note ? `: ${t(note)}` : ""}`);
    }),
    ...r.lookalikes.map((l) => li(t("{bad} özbekça harf emas. Töğrisi {good} ({note}).", {
      bad: `<b data-lotin>${l.bad}</b>`, good: `<b data-lotin>${l.good}</b>`, note: t(l.note),
    }), "bad")),
    r.ok ? li(t("Bu söz yangi alifboda töğri yozilgan.")) : "",
    r.ng ? li(t("{ng} özgarmaydi.", { ng: "<span data-lotin>ng</span>" })) : "",
  ].join("");
  return { result: r.result, rules: r.rules, wordHtml, whyHtml };
}
