// 10 savollik test: savollar bittadan, javobdan keyin tuşuntiriş, oxirida ball va story rasm.
import { QUESTIONS, grade, shuffle } from "./test-savollar.js";
import { storyBlob } from "./story.js";

const TOTAL = QUESTIONS.length;
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
// « » içidagi eski yozuv misoli kirill rejimida ham lotinda qoladi.
const withExamples = (s) => esc(s).replace(/«([^»]*)»/g, "«<span data-lotin>$1</span>»");

export function mountTest(section, track = () => {}) {
  const $ = (id) => section.querySelector(`#${id}`);
  const prog = $("prog"), qn = $("q-n"), q = $("q"), opts = $("opts"), why = $("why"), next = $("next");
  const quiz = $("quiz-q"), result = $("result"), live = $("quiz-live");
  const preview = $("story-prev"), img = $("story-img"), err = $("story-err");
  prog.innerHTML = "<i></i>".repeat(TOTAL);
  const dots = [...prog.children];

  let index = 0, score = 0, started = false, imageUrl = "";

  function showQuestion(focus) {
    const item = QUESTIONS[index];
    dots.forEach((d, k) => d.classList.toggle("now", k === index));
    prog.setAttribute("aria-label", `${TOTAL} dan ${index + 1}-savol`);
    qn.textContent = `${index + 1} / ${TOTAL}`;
    q.innerHTML = withExamples(item.q);
    opts.replaceChildren(...shuffle(item.options).map((text) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = text;
      if (text === item.options[0]) b.dataset.ok = "";
      b.addEventListener("click", (e) => answer(b, e.detail === 0));
      return b;
    }));
    why.hidden = true;
    next.hidden = true;
    if (focus) opts.firstChild.focus();
  }

  function answer(button, keyboard) {
    if (!started) { started = true; track("test_boshlandi"); }
    const ok = "ok" in button.dataset;
    const right = opts.querySelector("[data-ok]");
    opts.querySelectorAll(".opt").forEach((b) => { b.disabled = true; });
    right.classList.add("right");
    right.insertAdjacentHTML("beforeend", ' <span class="tag tag-hot">Töğri</span>');
    if (!ok) button.classList.add("wrong");
    if (ok) score++;
    dots[index].classList.add(ok ? "ok" : "no");
    live.textContent = ok ? "Töğri" : `Xato. Töğri javob: ${right.firstChild.textContent}`;
    why.innerHTML = withExamples(QUESTIONS[index].why);
    why.hidden = false;
    next.textContent = index === TOTAL - 1 ? "Natijani körsatiş" : "Keyingi savol";
    next.hidden = false;
    // Fokus faqat klaviatura bilan işlaganda köçadi: telefonda ortiqça ramka çiqmasin.
    if (keyboard) next.focus();
  }

  next.addEventListener("click", (e) => {
    index++;
    if (index < TOTAL) return showQuestion(e.detail === 0);
    dots.forEach((d) => d.classList.remove("now"));
    quiz.hidden = true;
    result.hidden = false;
    $("score").textContent = score;
    $("grade").textContent = `${grade(score)} Döstlaringiz ham sinab körsin.`;
    live.textContent = `Natija: ${TOTAL} dan ${score}`;
    track("test_tugadi", { ball: score });
  });

  $("restart").addEventListener("click", (e) => {
    index = 0;
    score = 0;
    dots.forEach((d) => d.classList.remove("ok", "no"));
    result.hidden = true;
    preview.hidden = true;
    err.hidden = true;
    quiz.hidden = false;
    showQuestion(e.detail === 0);
    track("test_qayta");
  });

  $("story").addEventListener("click", async () => {
    err.hidden = true;
    const blob = await storyBlob(score).catch(() => null);
    if (!blob) { err.hidden = false; return; }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = URL.createObjectURL(blob);
    img.src = imageUrl;
    preview.hidden = false;
    const file = new File([blob], "yozgich-test.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        track("story_ulashildi", { usul: "share" });
      } catch { /* foydalanuvçi bekor qildi */ }
      return;
    }
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "yozgich-test.png";
    a.click();
    track("story_ulashildi", { usul: "yuklab" });
  });

  showQuestion(false);
  section.hidden = false;
  document.getElementById("test-rule").hidden = false;
}
