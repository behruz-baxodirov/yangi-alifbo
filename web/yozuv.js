// Sahifadagi JS qöşgan matnni eski lotin yoki kirillga ögiradi (/eski/ va /kr/ sahifalari).
// Statik matnni generator allaqaçon ögirgan; bu yerda faqat keyin paydo bölgan matn ögiriladi.
import { EXCLUDE, toCyrillic } from "./kirill.js";
import { toOldLatin } from "./eski.js";

const ATTRS = ["aria-label", "placeholder", "alt", "title"];
const CONVERT = { kr: toCyrillic, eski: toOldLatin };
let fn = null;
let observer;

const skip = (el) => !el || !!el.closest(EXCLUDE);

function textNode(t) {
  if (skip(t.parentElement)) return;
  const out = fn(t.data);
  if (out !== t.data) t.data = out;
}

function attrNode(el, name) {
  if (skip(el) || !el.hasAttribute(name)) return;
  const value = el.getAttribute(name);
  const out = fn(value);
  if (out !== value) el.setAttribute(name, out);
}

function walk(node) {
  if (node.nodeType === Node.TEXT_NODE) return textNode(node);
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  ATTRS.forEach((name) => attrNode(node, name));
  const it = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = it.nextNode(); n; n = it.nextNode()) {
    if (n.nodeType === Node.TEXT_NODE) textNode(n);
    else ATTRS.forEach((name) => attrNode(n, name));
  }
}

/** til: "kr" yoki "eski" bölsa, sahifa va keyin qöşiladigan matn öşa yozuvga ögiriladi; boşqasida heç narsa qilmaydi. */
export function applyScript(root, til) {
  fn = CONVERT[til] ?? null;
  if (!fn) return;
  walk(root);
  // Ögiriş ikki marta işlatilsa ham natija özgarmaydi, şuning uçun özimiz yozgan özgariş tsikl bermaydi.
  observer ??= new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "characterData") textNode(m.target);
      else if (m.type === "attributes") attrNode(m.target, m.attributeName);
      else m.addedNodes.forEach(walk);
    }
  });
  observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
}
