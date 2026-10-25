// Qurilma va "Nusxa oliş" tugmalari: boş sahifa va qoidalar sahifasi uçun umumiy.
import { t } from "./i18n.js";

export function deviceOf(ua, touchPoints = 0) {
  return /iPhone|iPad|iPod|Android/i.test(ua) || (/Macintosh/.test(ua) && touchPoints > 1)
    ? "phone"
    : /Windows/i.test(ua) ? "windows" : "mac";
}
export const DEVICE = deviceOf(globalThis.navigator?.userAgent ?? "", globalThis.navigator?.maxTouchPoints ?? 0);

// Har [data-copy] tugma data-copy dagi id li elementning matnini nusxalaydi.
export function setupCopy(root, device = DEVICE) {
  root.querySelectorAll("[data-copy]").forEach((button) => {
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
}
