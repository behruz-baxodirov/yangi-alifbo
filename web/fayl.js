// /fayl/: fayllarni yangi alifboga ögiriş sahifasi (mantiq fayl-ogir.js da).
import "./sahifa.js";
import { t } from "./i18n.js";
import { convertFile } from "./fayl-ogir.js";
import { objectUrls } from "./object-url.js";

const drop = document.getElementById("fayl-drop");
const input = document.getElementById("fayl-in");
const list = document.getElementById("fayl-list");
const tutuq = document.getElementById("fayl-tutuq");
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const streams = typeof DecompressionStream === "function" && typeof CompressionStream === "function";

function message(error, name) {
  if (error?.message === "format") return t("Bu format qöllanmaydi. .doc, .pdf yoki .xlsx faylni Word (.docx) yoki matn sifatida saqlab, qayta taşlang.");
  if (error?.message === "hajm") return t("Fayl 20 MB dan katta.");
  if (error?.message === "zip-hajm") return t("Word faylining oçilgandagi hajmi juda katta.");
  if (!streams && /\.docx$/i.test(name)) return t("Brauzeringiz eski: docx uçun Chrome, Edge, Safari 16.4 yoki Firefoxʼning yangi versiyasi kerak.");
  return t("Faylni ögirib bölmadi. Asl fayl özgarmadi.");
}

async function handle(file) {
  const li = document.createElement("li");
  li.className = "fayl-item";
  li.innerHTML = `<b class="fayl-name" data-lotin>${esc(file.name)}</b> <span class="fayl-st">${t("Ögirilmoqda…")}</span>`;
  list.prepend(li);
  const tur = (file.name.split(".").pop() || "").toLowerCase();
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const out = await convertFile({ name: file.name, bytes }, { tutuq: tutuq.checked });
    const url = objectUrls.replace(li, new Blob([out.bytes], { type: file.type || "application/octet-stream" }));
    li.innerHTML = `<b class="fayl-name" data-lotin>${esc(out.name)}</b> <span class="fayl-st">${t("{n} ta harf özgardi", { n: out.changed })}</span>`
      + ` <a class="btn btn-ink" href="${url}" download="${esc(out.name)}">${t("Yuklab oliş")}</a>`;
    window.track?.("fayl_ogirildi", { tur });
  } catch (error) {
    li.classList.add("fayl-xato");
    li.querySelector(".fayl-st").textContent = message(error, file.name);
    window.track?.("fayl_xato", { sabab: ["format", "hajm"].includes(error?.message) ? error.message : streams ? "boshqa" : "brauzer" });
  }
}

const take = (files) => [...files].forEach(handle);
input.addEventListener("change", () => { take(input.files); input.value = ""; });
drop.addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
drop.addEventListener("dragleave", () => drop.classList.remove("over"));
drop.addEventListener("drop", (e) => { e.preventDefault(); drop.classList.remove("over"); take(e.dataTransfer.files); });
