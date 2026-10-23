// data-yozgich bölgan element ustida "Yangi alifboda" tugmasi: bosilsa matn yangi alifboga ögiriladi, qayta bosilsa asli qaytadi.
// Bu fayl bundle içida işlaydi (site/lib/bundle.mjs): convert() yuqorida, converter.js dan.
const SKIP = "script, style, textarea, input, select, code, pre, [contenteditable], .yozgich-btn";
const STYLE = "font:600 14px/1.2 system-ui,sans-serif;padding:8px 14px;margin:8px 0;border:2px solid #17110d;"
  + "border-radius:3px;background:#f0cf97;color:#17110d;cursor:pointer";

function textNodes(root) {
  const out = [];
  const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = it.nextNode(); n; n = it.nextNode()) {
    if (n.data.trim() && !n.parentElement.closest(SKIP)) out.push(n);
  }
  return out;
}

function mount(el) {
  const [on, off] = (el.getAttribute("data-yozgich-label") || "Yangi alifboda|Eski yozuvda").split("|");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "yozgich-btn";
  button.textContent = on;
  button.setAttribute("style", STYLE);
  button.setAttribute("aria-pressed", "false");
  const original = new WeakMap();
  let converted = false;
  button.addEventListener("click", () => {
    for (const node of textNodes(el)) {
      if (!converted) {
        original.set(node, node.data);
        node.data = convert(node.data);
      } else if (original.has(node)) {
        node.data = original.get(node);
      }
    }
    converted = !converted;
    button.textContent = converted ? off || on : on;
    button.setAttribute("aria-pressed", String(converted));
  });
  if (el.getAttribute("data-yozgich-button") === "bottom") el.after(button);
  else el.before(button);
}

function start() {
  document.querySelectorAll("[data-yozgich]").forEach(mount);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
else start();
