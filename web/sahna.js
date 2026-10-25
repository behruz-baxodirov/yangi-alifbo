// Hero sahnasi: tugmalar bosiladi, juftlik (o + ') bitta yangi harfga birlaşadi.
// wordSteps — sof funksiya (testlanadi); DOM bilan işlaydigan qism keyingi qadamda qöşiladi.
export const WORDS = [
  { k: ["o", "'", "z", "b", "e", "k"], at: 0, to: "ö" },
  { k: ["c", "h", "o", "y"], at: 0, to: "ç" },
  { k: ["t", "o", "g", "'"], at: 2, to: "ğ" },
  { k: ["s", "h", "a", "h", "a", "r"], at: 0, to: "ş" },
];

export function wordSteps({ k, at, to }) {
  const steps = [];
  let text = "", mark = -1;
  k.forEach((ch, i) => {
    steps.push({ type: "press", i });
    if (i === at + 1) {
      steps.push({ type: "old", text: k[at] + ch, before: text });
      steps.push({ type: "merge", i: at, to });
      mark = text.length;
      text += to;
    } else if (i === at) {
      steps.push({ type: "screen", text: text + ch, mark });
      return;
    } else {
      text += ch;
    }
    steps.push({ type: "screen", text, mark });
  });
  return steps;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Konverterda yozilgan harf nonda tursin: pauza davomida sahna nonga tegmaydi. Uzunroq pauza ustun.
export function createPause() {
  let until = 0;
  return {
    pause: (ms, now = Date.now()) => { until = Math.max(until, now + ms); },
    active: (now = Date.now()) => now < until,
  };
}

// Sahnani aylantiradi. onPair(to, stamped): juftlik xira köringanda (false) va birlaşganda (true) — non şu harfni tamğalaydi.
// pause(ms): konverterda yozilgan harf nonda tursin deb aylaniş vaqtinça töxtaydi.
export function mountSahna(root, { onPair = () => {}, reduce = false } = {}) {
  const gate = createPause();
  const keys = root.querySelector("#keys"), typed = root.querySelector("#typed");
  // Pauza: so'z yarmida bölsa ham nonga tamğalaş töxtaydi, tugmalar qatori körinib turadi.
  const api = { pause: (ms) => { gate.pause(ms); keys.classList.remove("fade"); } };
  if (reduce) return api; // markupdagi yakuniy holat qoladi
  const stamp = (to, stamped) => { if (!gate.active()) onPair(to, stamped); };
  const shifts = [...root.querySelectorAll(".shift kbd")];
  const render = (text, mark) => {
    typed.replaceChildren();
    [...text].forEach((ch, i) => {
      if (i !== mark) return typed.append(ch);
      const s = document.createElement("span");
      s.className = "new";
      s.textContent = ch;
      typed.append(s);
    });
  };
  async function idle() {
    while (document.hidden || gate.active()) await sleep(400);
  }
  async function play(word) {
    keys.classList.remove("fade");
    const caps = word.k.map((ch) => Object.assign(document.createElement("span"), { className: "kc", textContent: ch }));
    keys.replaceChildren(...caps);
    typed.replaceChildren();
    await sleep(500);
    for (const step of wordSteps(word)) {
      if (step.type === "press") {
        caps[step.i].classList.add("down");
        await sleep(110);
        caps[step.i].classList.remove("down");
      } else if (step.type === "screen") {
        render(step.text, step.mark);
        await sleep(200);
      } else if (step.type === "old") {
        typed.replaceChildren(step.before, Object.assign(document.createElement("span"), { className: "old", textContent: step.text }));
        stamp(word.to, false);
        await sleep(320);
      } else if (step.type === "merge") {
        caps[step.i].textContent = step.to;
        caps[step.i].classList.add("merged");
        caps[step.i + 1].classList.add("gone");
        stamp(step.to, true);
      }
    }
    await sleep(1500);
    keys.classList.add("fade");
    await sleep(350);
  }
  async function tapShift() {
    for (const k of shifts) { k.classList.add("tap"); await sleep(320); k.classList.remove("tap"); }
  }
  (async () => {
    await sleep(1800); // birinçi kadr: markupdagi tayyor "özbek" bir oz körinib tursin
    for (let n = 0; ; n++) {
      await idle();
      await play(WORDS[n % WORDS.length]);
      if (n % 2 === 1) await tapShift();
    }
  })();
  return api;
}
