import { convert, detectScript } from "./converter.js";
import { PAIRS, PAIR_OF, layout } from "./glyphs.js";
import { daysLeft, dayDots, lawPhase } from "./sanoq.js";
import { renderExplain } from "./soz-izoh.js";
import { mountTest } from "./test.js";
import "./sahifa.js";
import { t, tx } from "./i18n.js";
import { NEW, checkTyping } from "./tekshir.js";

// Qurilma: Mac'da macOS tabi, Windows'da Windows tabi, telefonda konverter birinçi.
const ua = navigator.userAgent;
const touch = navigator.maxTouchPoints > 1;
const device = /iPhone|iPad|iPod|Android/i.test(ua) || (/Macintosh/.test(ua) && touch)
  ? "phone"
  : /Windows/i.test(ua) ? "windows" : "mac";
document.documentElement.dataset.device = device;
// Kompyuter yöriqnomasi telefondagi asosiy vazifani berkitmasin; JSʼsiz u oçiq qoladi.
document.getElementById("install-details").open = device !== "phone";

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
const SCRIPT_NAMES = { latin: t("Lotin"), cyrillic: t("Kirill"), mixed: t("Aralaş") };
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
  scriptTag.textContent = input.value.trim() ? SCRIPT_NAMES[script] : t("Boş");
  count.textContent = t("{n} belgi", { n: [...input.value].length });
  changed.textContent = script === "cyrillic" && input.value.trim()
    ? t("Kirilldan ögirildi")
    : t("{n} ta harf özgardi", { n: marks });
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
      button.textContent = t("Nusxa olindi");
      button.dataset.state = "done";
    } else {
      button.textContent = { mac: t("Belgilandi, ⌘C bosing"), windows: t("Belgilandi, Ctrl+C bosing"), phone: t("Bosib turib nusxa oling") }[device];
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
  const data = { title: "Yozgiç", text: tx("o' → ö, sh → ş: yangi alifboda odatdagidek yozing"), url: location.href.split("#")[0] };
  if (navigator.share) {
    try { await navigator.share(data); } catch { /* foydalanuvçi bekor qildi */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(data.url);
    share.textContent = t("Havola olindi");
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
    const law = { qonun: "<b>ЎРҚ-1184</b>" };
    document.getElementById("sanoq-matn").innerHTML = phase === "bugun"
      ? t("{qonun}-son Qonun bugun kuçga kirdi.", law)
      : t("{qonun}-son Qonun 22.04.2027 dan kuçda.", law);
    document.getElementById("sanoq").classList.add("done");
  }
  document.getElementById("sanoq").hidden = false;
}


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
  else if (href.includes("taps.uz")) track("donat", { joy: el.closest("footer") ? "pastki" : el.closest(".panel") ? "yuklash" : "savollar" });
  else if (href.startsWith("http") && !href.includes("yozgich.uz")) {
    const where = el.closest("#asoschi") ? "asoschi" : el.closest("footer") ? "pastki" : "boshqa";
    track(href.includes("t.me/behruz_baxodirov") ? "aloqa_telegram" : "tashqi_havola", { havola: href, joy: where });
  }
});

input.addEventListener("input", () => track("konverter_yozdi"), { once: true });

// Örnatgandan keyingi tekşiruv: yangi harf çiqsa çiroq yonadi. Eski şakl qolsa, Yozgiç ögirib ulgurişini
// kutib turamiz: u avval o' ni yozib, keyin öçirib ö qöyadi.
const SINOV = {
  kutish: () => t("Yozgiç yoqiq bölsa, {old} özi {new} ga aylanadi.", { old: "<b data-lotin>o'</b>", new: "<b data-lotin>ö</b>" }),
  ishlayapti: () => t("Işlayapti! Davom eting, qolgan harflar ham yonadi."),
  tayyor: () => t("Hammasi joyida: Yozgiç işlayapti."),
  ishlamadi: (os) => os === "mac"
    ? t("Harflar ögirilmadi. Menyu-barda {o} turibdimi? Yoqiş: {shift} ni ikki marta bosing. 3-qadamdagi ruxsatni ham tekşiring.", { o: "<b data-lotin>ö</b>", shift: "<kbd>⇧ Shift</kbd>" })
    : t("Harflar ögirilmadi. Soat yonida ikonka bormi? Yoqiş: {keys}.", { keys: "<kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Space</kbd>" }),
};
document.querySelectorAll(".sinov").forEach((box) => {
  const os = box.dataset.os;
  const field = box.querySelector(".sinov-field");
  const lamps = [...box.querySelectorAll(".lamps i")];
  const status = box.querySelector(".sinov-status");
  const sent = new Set();
  let wait;
  const show = (verdict) => {
    if (box.dataset.verdict === verdict) return;
    box.dataset.verdict = verdict;
    status.innerHTML = SINOV[verdict](os);
  };
  // Har biri bir marta; nusxa olib qöyilgan matn hisobga olinmaydi.
  const once = (name, typed) => {
    if (!typed || sent.has(name)) return;
    sent.add(name);
    track(name, { os });
  };
  field.addEventListener("input", (e) => {
    const typed = !/^insertFrom(Paste|Drop)/.test(e.inputType ?? "");
    const { found, verdict } = checkTyping(field.value);
    lamps.forEach((lamp, k) => lamp.classList.toggle("on", found.includes(NEW[k])));
    clearTimeout(wait);
    if (verdict !== "ishlamadi") {
      show(verdict);
      if (verdict === "ishlayapti" || verdict === "tayyor") once("yozgich_ishladi", typed);
      return;
    }
    wait = setTimeout(() => { show(verdict); once("yozgich_ishlamadi", typed); }, 900);
  });
});

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
["konverter", "telefonda", "qoidalar", "test", "savollar", "asoschi"].forEach((id) => seen.observe(document.getElementById(id)));

// Test: savollar, natija va story rasm (test.js).
mountTest(document.getElementById("test"), track);
