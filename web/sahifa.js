// Har sahifada: JS qöşgan matnni joriy yozuvga ögiriş va til tanlagiç.
import { til, placeIn } from "./i18n.js";
import { applyScript } from "./yozuv.js";

applyScript(document.body, til);

// Boşqa versiyaga ötganda sahifadagi joy (?n=… va #konverter) saqlanadi; tanlov eslab qolinadi, lekin avtomatik yönaltiriş yöq.
document.querySelectorAll(".tillar a, .tillar-m a, .close-tillar a").forEach((a) => {
  a.addEventListener("click", () => {
    a.setAttribute("href", placeIn(a.getAttribute("href"), location.search, location.hash));
    try { localStorage.setItem("yozgich-til", a.dataset.til); } catch { /* saqlab bölmasa ham ötadi */ }
    window.track?.("til_almashtirildi", { til: a.dataset.til });
  });
});
