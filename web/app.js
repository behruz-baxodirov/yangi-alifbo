import { convert, detectScript } from "./converter.js";
import { PAIRS, PAIR_OF, layout } from "./glyphs.js";
import { daysLeft, dayDots, lawPhase } from "./sanoq.js";
import { explain, RULE_TEXT } from "./soz.js";

// Qurilma: Mac'da macOS tabi, Windows'da Windows tabi, telefonda konverter birinçi.
const ua = navigator.userAgent;
const touch = navigator.maxTouchPoints > 1;
const device = /iPhone|iPad|iPod|Android/i.test(ua) || (/Macintosh/.test(ua) && touch)
  ? "phone"
  : /Windows/i.test(ua) ? "windows" : "mac";
document.documentElement.dataset.device = device;

// Non markazi: çekiç halqalari va sedana (doimiy naqş, tasodifiy emas).
const center = document.getElementById("non-center");
function addAt(cls, x, y, extra = "") {
  const el = document.createElement("i");
  el.className = cls;
  el.style.cssText = `left:${x}%;top:${y}%;${extra}`;
  center.appendChild(el);
}
[[36, 56], [40.5, 64]].forEach(([r, n], ring) => {
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + ring * 0.07;
    addAt("pip", 50 + r * Math.cos(a), 50 + r * Math.sin(a));
  }
});
// Sedana halqalar orasida: harf maydoniga tegmaydi.
for (let k = 0; k < 18; k++) {
  const a = k * 2.399963, r = 38.25;
  addAt("seed", 50 + r * Math.cos(a), 50 + r * Math.sin(a), `--r:${(k * 47) % 180}deg`);
}

// Havola yopiq savolga olib borsa, uni oçib qöyamiz.
function openTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id && document.getElementById(id);
  if (target instanceof HTMLDetailsElement) target.open = true;
}
addEventListener("hashchange", openTarget);
openTarget();

// Çekiç: eski juftlikning nuqtalari yangi harfga köçadi.
const COLS = 13, ROWS = 10, POOL = 40;
const stamp = document.getElementById("stamp");
const pairLabel = document.getElementById("pair");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const dots = Array.from({ length: POOL }, () => {
  const d = document.createElement("i");
  d.className = "dot";
  return stamp.appendChild(d);
});

function place(coords) {
  dots.forEach((d, i) => {
    const c = coords[i] ?? coords[coords.length - 1];
    d.style.left = `${(c[0] / COLS) * 100}%`;
    d.style.top = `${(c[1] / ROWS) * 100}%`;
    d.style.opacity = i < coords.length ? 1 : 0;
  });
}

function showPair([from, to], stamped) {
  place(layout(stamped ? to : from, COLS));
  pairLabel.textContent = `${from.toLowerCase()} → ${to.toLowerCase()}`;
}

let step = reduceMotion ? 1 : 0;
let idleUntil = 0;
function tick() {
  if (Date.now() < idleUntil) return;
  showPair(PAIRS[Math.floor(step / 2) % PAIRS.length], step % 2 === 1);
  step++;
}
tick();
setInterval(tick, reduceMotion ? 4000 : 1600);

// Bosilgan oxirgi yangi harf nonga qayta tamğalanadi.
let lastStamped = "";
function restamp(text) {
  const letters = text.toLowerCase().match(/[öğşç]/g);
  const last = letters ? letters[letters.length - 1] : "";
  if (!last || last === lastStamped) return;
  lastStamped = last;
  idleUntil = Date.now() + 6000;
  const pair = PAIR_OF[last];
  showPair(pair, false);
  setTimeout(() => showPair(pair, true), reduceMotion ? 0 : 450);
}

// Tablar (yuklab oliş va telefon yöriqnomasi): ARIA tablist, strelkalar bilan boşqariladi.
// Har röyxat faqat öz panellarini almaştiradi.
function setupTabs(list, initialId) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
  select(document.getElementById(initialId));
}
setupTabs(document.querySelector(".dl .tabs"), device === "windows" ? "tab-win" : "tab-mac");
setupTabs(document.querySelector(".phone .tabs"), /Android/i.test(ua) ? "tab-and" : "tab-ios");

// Konverter
const input = document.getElementById("in");
const output = document.getElementById("out");
const tutuq = document.getElementById("tutuq");
const count = document.getElementById("count");
const changed = document.getElementById("changed");
const scriptTag = document.getElementById("script");
const NEW_LETTERS = /[öğşçÖĞŞÇʼ]/u;
const SCRIPT_NAMES = { latin: "Lotin", cyrillic: "Kirill", mixed: "Aralaş" };
const SAMPLES = {
  latin: "O'zbekiston go'zal yurt. Toshkentning choyxonalari mashhur, odamlari mehmondo'st. Ma'naviyat bizning g'ururimiz.",
  cyrillic: "Ўзбекистон гўзал юрт. Тошкентнинг чойхоналари машҳур, одамлари меҳмондўст. Исҳоқ ака эртага келади.",
  post: "Assalomu alaykum! Bugun soat 18:00 da Chorsu yonidagi choyxonada uchrashamiz. Kechikmang, osh mendan. To'y haqida ham gaplashib olamiz.",
};

function render(fromUser) {
  const opts = { tutuq: tutuq.checked };
  const parts = input.value.split(/(\s+)/);
  const frag = document.createDocumentFragment();
  let marks = 0;
  let plain = "";
  for (const part of parts) {
    const out = convert(part, opts);
    plain += out;
    if (out === part || !NEW_LETTERS.test(out)) {
      frag.append(out);
      continue;
    }
    // Faqat yangi harflar ajratiladi; qolgani oddiy matn bölib qoladi.
    for (const ch of out) {
      if (NEW_LETTERS.test(ch)) {
        const m = document.createElement("mark");
        m.textContent = ch;
        frag.append(m);
        if (ch !== "ʼ") marks++; // tutuq belgi, harf emas
      } else {
        frag.append(ch);
      }
    }
  }
  output.replaceChildren(frag);

  const script = detectScript(input.value);
  scriptTag.textContent = input.value.trim() ? SCRIPT_NAMES[script] : "Boş";
  count.textContent = `${[...input.value].length} belgi`;
  changed.textContent = script === "cyrillic" && input.value.trim()
    ? "Kirilldan ögirildi"
    : `${marks} ta harf özgardi`;
  if (fromUser) restamp(plain);
}
input.addEventListener("input", () => render(true));
tutuq.addEventListener("change", () => render(false));
render(false);

document.querySelectorAll("[data-sample]").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = SAMPLES[chip.dataset.sample];
    document.querySelectorAll("[data-sample]").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
    render(true);
  });
});
document.getElementById("clear").addEventListener("click", () => {
  input.value = "";
  document.querySelectorAll("[data-sample]").forEach((c) => c.removeAttribute("aria-pressed"));
  render(false);
  input.focus();
});

// "Bu söz qanday yoziladi?": natija, qoidalar va jadvalning mos qatori.
{
  const field = document.getElementById("soz");
  const box = document.getElementById("soz-natija");
  const word = document.getElementById("soz-word");
  const why = document.getElementById("soz-why");
  const rows = document.querySelectorAll(".rule-table tr[data-rule]");
  const li = (html, cls = "") => `<li${cls ? ` class="${cls}"` : ""}>${html}</li>`;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  let timer;
  let tracked = false;

  const show = () => {
    const r = explain(field.value);
    rows.forEach((tr) => tr.classList.toggle("lit", r.rules.includes(tr.dataset.rule)));
    box.hidden = !r.result;
    if (!r.result) return;
    const changed = r.result !== field.value.trim();
    word.innerHTML = [...r.result].map((ch) => (changed && NEW_LETTERS.test(ch) ? `<mark>${ch}</mark>` : esc(ch))).join("");
    why.innerHTML = [
      r.cyrillic ? li("Kirill harflari lotinga ögirildi") : "",
      ...r.rules.map((id) => {
        const { ex, note } = RULE_TEXT[id];
        return li(`<b data-lotin>${esc(ex)}</b>${note ? `: ${note}` : ""}`);
      }),
      ...r.lookalikes.map((l) => li(`<b>${l.bad}</b> özbekça harf emas. Töğrisi <b>${l.good}</b> (${l.note}).`, "bad")),
      r.ok ? li("Bu söz yangi alifboda töğri yozilgan.") : "",
      r.ng ? li("ng özgarmaydi.") : "",
    ].join("");
    if (!tracked) { track("soz_tekshirildi"); tracked = true; }
  };
  field.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(show, 150); });
  document.getElementById("soz-tekshir").hidden = false;
}

// Nusxa oliş tugmalari
document.querySelectorAll("[data-copy]").forEach((button) => {
  const label = button.textContent;
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    let copied = false;
    try {
      await navigator.clipboard.writeText(source.textContent);
      copied = true;
    } catch {
      // Ruxsat bölmasa: matnni özimiz belgilaymiz va eski usulda nusxa olamiz.
      const range = document.createRange();
      range.selectNodeContents(source);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
      try { copied = document.execCommand("copy"); } catch { copied = false; }
      if (copied) getSelection().removeAllRanges();
    }
    if (copied) {
      button.textContent = "Nusxa olindi";
      button.dataset.state = "done";
    } else {
      button.textContent = { mac: "Belgilandi, ⌘C bosing", windows: "Belgilandi, Ctrl+C bosing", phone: "Bosib turib nusxa oling" }[device];
    }
    setTimeout(() => {
      button.textContent = label;
      delete button.dataset.state;
    }, 1800);
  });
});

// Buyruqning özini bosganda ham nusxa olinadi.
document.getElementById("cmd").addEventListener("click", () => document.querySelector('[data-copy="cmd"]').click());

// Telefonda havolani ulaşiş
const share = document.getElementById("share");
share?.addEventListener("click", async () => {
  const data = { title: "Yozgiç", text: "o' → ö, sh → ş: yangi alifboda odatdagidek yozing", url: location.href.split("#")[0] };
  if (navigator.share) {
    try { await navigator.share(data); } catch { /* foydalanuvçi bekor qildi */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(data.url);
    share.textContent = "Havola olindi";
  } catch {
    share.textContent = data.url;
  }
});

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
    document.getElementById("sanoq-matn").innerHTML = "<b>ЎРҚ-1184</b>-son Qonun " +
      (phase === "bugun" ? "bugun kuçga kirdi." : "22.04.2027 dan kuçda.");
    document.getElementById("sanoq").classList.add("done");
  }
  document.getElementById("sanoq").hidden = false;
}

// Nuqta çiziqlarini sahifaning 12px çekiç töriga tekislaymiz.
function alignDotRows() {
  document.querySelectorAll(".rule-table, .faq, .sec-rule").forEach((el) => {
    const left = el.getBoundingClientRect().left + scrollX;
    el.style.setProperty("--phase", `${(12 - (left % 12)) % 12}px`);
  });
}
addEventListener("resize", alignDotRows);
alignDotRows();

// Statistika: nimani bosişdi, qaysi bölimgaça yetib borişdi (index.html'dagi track).
const track = (name, params) => window.track?.(name, params);

document.addEventListener("click", (e) => {
  const el = e.target.closest("a, button");
  if (!el) return;
  const href = el.getAttribute("href") ?? "";
  if (href.endsWith(".exe")) track("windows_yuklash");
  else if (el.matches('[data-copy="cmd"]')) track("mac_buyruq");
  else if (el.matches('[data-copy="out"]')) track("konverter_nusxa");
  else if (el.matches("[data-sample]")) track("konverter_namuna", { namuna: el.dataset.sample });
  else if (el.id === "share") track("havola_ulashish");
  else if (el.id === "tab-ios" || el.id === "tab-and") track("telefon_tab", { os: el.id === "tab-ios" ? "iphone" : "android" });
  else if (el.matches(".nav-founder")) track("asoschi_menyu");
  else if (href.includes("taps.uz")) track("donat", { joy: el.closest("footer") ? "pastki" : el.closest(".panel") ? "yuklash" : "savollar" });
  else if (href.startsWith("http") && !href.includes("yozgich.uz")) {
    const where = el.closest("#asoschi") ? "asoschi" : el.closest("footer") ? "pastki" : "boshqa";
    track(href.includes("t.me/behruz_baxodirov") ? "aloqa_telegram" : "tashqi_havola", { havola: href, joy: where });
  }
});

input.addEventListener("input", () => track("konverter_yozdi"), { once: true });

document.querySelectorAll(".faq details").forEach((d) => {
  d.addEventListener("toggle", () => d.open && track("savol_ochildi", { savol: d.id }));
});

// Bölim ekran örtasiga yetsa, bir marta sanaladi.
const seen = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    track(`kordi_${entry.target.id}`);
    seen.unobserve(entry.target);
  });
}, { rootMargin: "0px 0px -50% 0px" });
["konverter", "qoidalar", "savollar", "asoschi"].forEach((id) => seen.observe(document.getElementById(id)));
