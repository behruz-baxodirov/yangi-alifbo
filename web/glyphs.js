// 5×10 nuqta-harflar: 0–1 — ustki belgi, 2 — oraliq, 3–7 — harf tanasi, 8–9 — sedil.
export const GLYPHS = {
  O: [".....", ".....", ".....", ".XXX.", "X...X", "X...X", "X...X", ".XXX.", ".....", "....."],
  G: [".....", ".....", ".....", ".XXXX", "X....", "X.XXX", "X...X", ".XXX.", ".....", "....."],
  S: [".....", ".....", ".....", ".XXXX", "X....", ".XXX.", "....X", "XXXX.", ".....", "....."],
  C: [".....", ".....", ".....", ".XXXX", "X....", "X....", "X....", ".XXXX", ".....", "....."],
  H: [".....", ".....", ".....", "X...X", "X...X", "XXXXX", "X...X", "X...X", ".....", "....."],
  "'": ["..", "..", "XX", ".X", "X.", "..", "..", "..", "..", ".."],
  Ö: [".....", ".X.X.", ".....", ".XXX.", "X...X", "X...X", "X...X", ".XXX.", ".....", "....."],
  Ğ: ["X...X", ".XXX.", ".....", ".XXXX", "X....", "X.XXX", "X...X", ".XXX.", ".....", "....."],
  Ş: [".....", ".....", ".....", ".XXXX", "X....", ".XXX.", "....X", "XXXX.", "..X..", ".XX.."],
  Ç: [".....", ".....", ".....", ".XXXX", "X....", "X....", "X....", ".XXXX", "..X..", ".XX.."],
};

export const PAIRS = [
  ["O'", "Ö"],
  ["G'", "Ğ"],
  ["SH", "Ş"],
  ["CH", "Ç"],
];

/** Söz uçun nuqta koordinatalari, `cols` kenglikdagi katakda markazlangan. */
export function layout(word, cols) {
  const glyphs = [...word].map((ch) => GLYPHS[ch]);
  const width = glyphs.reduce((w, g) => w + g[0].length, 0) + glyphs.length - 1;
  let x = Math.floor((cols - width) / 2);
  const dots = [];
  for (const g of glyphs) {
    g.forEach((row, y) => [...row].forEach((c, dx) => c === "X" && dots.push([x + dx, y])));
    x += g[0].length + 1;
  }
  return dots;
}

/** Yangi harf → uni beradigan eski juftlik (tamğa animatsiyasi uçun). */
export const PAIR_OF = { ö: PAIRS[0], ğ: PAIRS[1], ş: PAIRS[2], ç: PAIRS[3] };
