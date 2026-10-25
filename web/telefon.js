// /telefon/: iPhone | Android almaştirgiç; usullar native <details>, JSʼsiz ham oçiladi.
import "./sahifa.js";
import { setupTabs } from "./tablar.js";

setupTabs(document.querySelector(".seg"), /Android/i.test(navigator.userAgent) ? "tab-and" : "tab-ios");
document.querySelectorAll(".seg-tab").forEach((tab) => {
  tab.addEventListener("click", () => window.track?.("telefon_tab", { os: tab.id === "tab-ios" ? "iphone" : "android" }));
});
