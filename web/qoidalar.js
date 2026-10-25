// /qoidalar/: söz tekşiruv (jadvalning mos qatori yonadi), qonun sanoği va nusxa tugmasi.
import "./sahifa.js";
import { renderExplain } from "./soz-izoh.js";
import { daysLeft, dayDots, lawPhase } from "./sanoq.js";
import { t } from "./i18n.js";
import { setupCopy } from "./nusxa.js";

const track = (name, params) => window.track?.(name, params);

// "Bu söz qanday yoziladi?": natija, qoidalar va jadvalning mos qatori.
{
  const field = document.getElementById("soz");
  const box = document.getElementById("soz-natija");
  const word = document.getElementById("soz-word");
  const why = document.getElementById("soz-why");
  const rows = document.querySelectorAll(".rule-table tr[data-rule]");
  let timer;
  let tracked = false;

  const show = () => {
    const r = renderExplain(field.value);
    rows.forEach((tr) => tr.classList.toggle("lit", r.rules.includes(tr.dataset.rule)));
    box.hidden = !r.result;
    if (!r.result) return;
    word.innerHTML = r.wordHtml;
    why.innerHTML = r.whyHtml;
    if (!tracked) { track("soz_tekshirildi"); tracked = true; }
  };
  field.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(show, 150); });
  document.getElementById("soz-tekshir").hidden = false;
}

// Sanoq: qonun kuçga kirişiga qolgan kunlar va har kun uçun nuqta.
{
  const today = new Date();
  const left = daysLeft(today);
  const { total, passed } = dayDots(today);
  document.getElementById("kun").textContent = left;
  document.getElementById("kunlar").innerHTML = Array.from({ length: total }, (_, k) =>
    `<i class="${k < passed ? "past" : k === passed ? "today" : ""}"></i>`).join("");
  const phase = lawPhase(today);
  if (phase !== "oldin") {
    const law = { qonun: "<b>ЎРҚ-1184</b>" };
    document.getElementById("sanoq-matn").innerHTML = phase === "bugun"
      ? t("{qonun}-son Qonun bugun kuçga kirdi.", law)
      : t("{qonun}-son Qonun 22.04.2027 dan kuçda.", law);
    document.getElementById("sanoq").classList.add("done");
  }
  document.getElementById("sanoq").hidden = false;
}

setupCopy(document);
