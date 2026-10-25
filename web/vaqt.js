// Vaqt poygasi: "Yozgiçsiz" (qidiriş, nusxalaş, qaytiş, qöyiş) va "Yozgiç bilan" bir vaqtda yuradi.
// raceAt va savings — sof funksiyalar (testlanadi), mountVaqt — DOM.
export const SLOW = 6.4, FAST = 0.4, SCALE = 8;
const STEPS = [[0.5, 2.3], [2.3, 3.6], [3.6, 4.8], [4.8, 6.4]];
const SAVED = 6; // har harfda tejaladigan soniya (taxmin)
const fmt = (t) => `${t.toFixed(1).replace(".", ",")} s`;

export function raceAt(t) {
  const t1 = Math.min(t, SLOW), t2 = Math.min(t, FAST);
  const step = t >= SLOW ? -1 : STEPS.findIndex(([a, b]) => t1 >= a && t1 < b);
  return {
    slow: {
      clock: fmt(t1),
      text: t1 < 0.25 ? "" : t < SLOW ? "K" : "Kö",
      step,
      search: t1 >= 0.5 && t1 < 3.6,
      fill: t1 / SCALE,
    },
    fast: {
      clock: fmt(t2),
      text: t2 < 0.12 ? "K" : t2 < 0.26 ? "Ko" : t < FAST ? "Ko'" : "Kö",
      chip: t2 >= 0.12 && t2 < 0.26 ? 0 : t2 >= 0.26 && t < FAST ? 1 : -1,
      done: t >= FAST,
      fill: t2 / SCALE,
    },
    finished: t >= SLOW,
  };
}

export function savings(n) {
  return {
    week: Math.round((n * SAVED * 7) / 60),
    year: Math.round((n * SAVED * 365) / 3600),
    count: n * 365,
  };
}

const group = (x) => String(x).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export function mountVaqt(root, track = () => {}, reduce = false) {
  const $ = (id) => root.querySelector(`#${id}`);
  const slowChips = [...$("vaqt-ch1").children], fastChips = [...$("vaqt-ch2").children];
  function paint(t) {
    const r = raceAt(t);
    $("vaqt-c1").textContent = r.slow.clock;
    $("vaqt-c2").textContent = r.fast.clock;
    $("vaqt-t1").textContent = r.slow.text;
    $("vaqt-t2").textContent = r.fast.text;
    $("vaqt-s1").hidden = !r.slow.search;
    $("vaqt-b1").style.width = `${r.slow.fill * 100}%`;
    $("vaqt-b2").style.width = `${r.fast.fill * 100}%`;
    slowChips.forEach((c, i) => c.classList.toggle("on", i === r.slow.step));
    fastChips.slice(0, 2).forEach((c, i) => c.classList.toggle("on", i === r.fast.chip));
    $("vaqt-ok").hidden = !r.fast.done;
    $("vaqt-res").classList.toggle("shown", r.finished);
  }
  let raf = 0;
  function run() {
    cancelAnimationFrame(raf);
    if (reduce) return paint(SLOW);
    const start = performance.now();
    const step = (now) => {
      const t = (now - start) / 1000;
      paint(t);
      if (t < SLOW + 0.1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  // Harakat kamaytirilganda qayta körsatadigan narsa yöq: tugma yaşiriladi.
  if (reduce) $("vaqt-replay").hidden = true;
  else $("vaqt-replay").addEventListener("click", () => { track("vaqt_qayta"); run(); });
  let started = false;
  new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    track("vaqt_korsatildi");
    run();
  }, { threshold: 0.4 }).observe($("vaqt-race"));

  const n = $("vaqt-n");
  let tracked = false;
  n.addEventListener("input", () => {
    const v = Number(n.value), s = savings(v);
    $("vaqt-nout").textContent = v;
    $("vaqt-wk").textContent = s.week;
    $("vaqt-yr").textContent = s.year;
    $("vaqt-cnt").textContent = group(s.count);
    if (!tracked) { tracked = true; track("vaqt_hisob", { harf: v }); }
  });
}
