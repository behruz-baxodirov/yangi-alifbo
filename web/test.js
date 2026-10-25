// 10 savollik test: savollar bittadan, javobdan keyin tuşuntiriş, oxirida ball va story rasm.
import { QUESTIONS, grade, shuffle } from "./test-savollar.js";
import { storyBlob } from "./story.js";
import { t } from "./i18n.js";

const TOTAL = QUESTIONS.length;
const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
// « » içidagi eski yozuv misoli va yolğiz yangi harflar (ö, sʼh) kirill rejimida ham lotinda qoladi.
const withExamples = (s) => esc(s)
  .replace(/«([^»]*)»/g, "«<span data-lotin>$1</span>»")
  .replace(/(?<![\p{L}ʼ])(sʼh|[öğşçÖĞŞÇʼ])(?![\p{L}ʼ])/gu, "<span data-lotin>$1</span>");

export function mountTest(section, track = () => {}) {
  const $ = (id) => section.querySelector(`#${id}`);
  const prog = $("prog"), qn = $("q-n"), q = $("q"), opts = $("opts"), why = $("why"), next = $("next");
  const quiz = $("quiz-q"), result = $("result"), live = $("quiz-live");
  const preview = $("story-prev"), img = $("story-img"), err = $("story-err");
  prog.innerHTML = "<i></i>".repeat(TOTAL);
  const dots = [...prog.children];

  let index = 0, score = 0;

  function showQuestion(focus) {
    const item = QUESTIONS[index];
    dots.forEach((d, k) => d.classList.toggle("now", k === index));
    prog.setAttribute("aria-label", t("{total} dan {n}-savol", { total: TOTAL, n: index + 1 }));
    qn.textContent = `${index + 1} / ${TOTAL}`;
    q.innerHTML = withExamples(t(item.q));
    opts.replaceChildren(...shuffle(item.options).map((text) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      // Variant imlo misoli: kirill rejimida ham lotinda qoladi, "Töğri" belgisi esa ögiriladi.
      b.innerHTML = `<span class="opt-text" data-lotin lang="uz">${esc(text)}</span>`;
      if (text === item.options[0]) b.dataset.ok = "";
      b.addEventListener("click", (e) => answer(b, e.detail === 0));
      return b;
    }));
    why.hidden = true;
    next.hidden = true;
    if (focus) opts.firstChild.focus();
  }

  function answer(button, keyboard) {
    const ok = "ok" in button.dataset;
    const right = opts.querySelector("[data-ok]");
    opts.querySelectorAll(".opt").forEach((b) => { b.disabled = true; });
    right.classList.add("right");
    right.insertAdjacentHTML("beforeend", ` <span class="tag tag-hot">${t("Töğri")}</span>`);
    if (!ok) button.classList.add("wrong");
    if (ok) score++;
    dots[index].classList.add(ok ? "ok" : "no");
    live.innerHTML = ok ? t("Töğri") : t("Xato. Töğri javob: {javob}", { javob: `<span data-lotin lang="uz">${esc(right.querySelector(".opt-text").textContent)}</span>` });
    why.innerHTML = withExamples(t(QUESTIONS[index].why));
    why.hidden = false;
    next.textContent = index === TOTAL - 1 ? t("Natijani körsatiş") : t("Keyingi savol");
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
    $("grade").textContent = `${t(grade(score))} ${t("Döstlaringiz ham sinab körsin.")}`;
    live.textContent = t("Natija: {total} dan {score}", { total: TOTAL, score });
    if (e.detail === 0) result.focus();
    track("test_tugadi", { ball: score });
    prepareStory();
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

  // Rasm natija çiqişi bilan tayyorlanadi: iOS ulaşiş oynasi bosişning özida çaqirilişi kerak,
  // uzoq çiziş kutilsa, brauzer bosişni "eskirgan" deb ulaşişni rad etadi.
  let story = null; // { score, file, url }
  function prepareStory() {
    const forScore = score;
    storyBlob(forScore).then((blob) => {
      if (!blob || forScore !== score) return;
      if (story) URL.revokeObjectURL(story.url);
      story = { score: forScore, file: new File([blob], "yozgich-test.png", { type: "image/png" }), url: URL.createObjectURL(blob) };
    }).catch(() => {});
  }
  // Instagram va Facebook ilova brauzerida yuklab oliş sahifani rasm bilan almaştirib yuboradi.
  const inApp = /Instagram|FBAN|FBAV/.test(navigator.userAgent);

  $("story").addEventListener("click", async () => {
    err.hidden = true;
    if (!story || story.score !== score) {
      const blob = await storyBlob(score).catch(() => null);
      if (!blob) { err.hidden = false; return; }
      story = { score, file: new File([blob], "yozgich-test.png", { type: "image/png" }), url: URL.createObjectURL(blob) };
    }
    img.src = story.url;
    preview.hidden = false;
    if (navigator.canShare?.({ files: [story.file] })) {
      try {
        await navigator.share({ files: [story.file] });
        track("story_ulashildi", { usul: "share" });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return; // foydalanuvçi bekor qildi
      }
    }
    if (inApp) return; // rasm körinib turibdi: bosib turib saqlaş mumkin
    const a = document.createElement("a");
    a.href = story.url;
    a.download = "yozgich-test.png";
    a.click();
    track("story_ulashildi", { usul: "yuklab" });
  });

  showQuestion(false);
  section.hidden = false;
  // Boş sahifadagi eski bölim (2-bosqiçda olib taşlanadi) bölsa, uning ajratgiçini ham oçamiz.
  document.getElementById("test-rule")?.removeAttribute("hidden");
}
