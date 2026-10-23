// Har sahifada: JS qöşgan matnni joriy yozuvga ögiriş va til tanlagiç.
import { til } from "./i18n.js";
import { applyScript } from "./yozuv.js";

applyScript(document.body, til);

// Boşqa versiyaga ötganda sahifadagi joy (#konverter) saqlanadi; tanlov eslab qolinadi, lekin avtomatik yönaltiriş yöq.
document.querySelectorAll(".tillar a, .tillar-m a").forEach((a) => {
  a.addEventListener("click", () => {
    if (location.hash) a.setAttribute("href", a.getAttribute("href").split("#")[0] + location.hash);
    try { localStorage.setItem("yozgich-til", a.dataset.til); } catch { /* saqlab bölmasa ham ötadi */ }
    window.track?.("til_almashtirildi", { til: a.dataset.til });
  });
});
