// /vidjet/ sahifasi: kodni nusxa oliş tugmasi (vidjetning özi /vidjet.js da).
import "./sahifa.js";
import { t } from "./i18n.js";

const button = document.getElementById("vidjet-copy");
const label = button.textContent;
button.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("vidjet-kod").textContent);
    button.textContent = t("Nusxa olindi");
  } catch {
    getSelection().selectAllChildren(document.getElementById("vidjet-kod"));
    button.textContent = t("Belgilandi, Ctrl+C bosing");
  }
  window.track?.("vidjet_kod_nusxa");
  setTimeout(() => { button.textContent = label; }, 1800);
});
