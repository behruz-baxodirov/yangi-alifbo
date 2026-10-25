// /test/: avval kiriş ekrani (bu test ekani, neçta savol), "Testni boşlaş" bosilganda savollar.
import "./sahifa.js";
import { mountTest } from "./test.js";

const track = (name, params) => window.track?.(name, params);
const intro = document.getElementById("test-intro");
const quiz = document.getElementById("test");

document.getElementById("test-start").addEventListener("click", () => {
  intro.hidden = true;
  track("test_boshlandi");
  mountTest(quiz, track);
  document.getElementById("q").setAttribute("tabindex", "-1");
  document.getElementById("q").focus();
});
