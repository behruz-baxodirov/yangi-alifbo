// Story rasmlari uçun umumiy çizgiçlar (test natijasi, ism kartasi, maşq): 1080×1920, "Non va çekiç" ranglari.
export const C = {
  crust: "#cf8a33", rim: "#a85d1b", rimEdge: "#7d4210", dough: "#f0cf97", pip: "#6b3510", char: "#17110d",
};
export const W = 1080, H = 1920;

/** Doto va Onest yuklanguncha kutadi; sample — rasmga tuşadigan matn (kerakli harf bölaklari uçun). */
export function loadFonts(sample = "") {
  return Promise.all([
    document.fonts.load("900 100px Doto", `yozgiç 0123456789/ ${sample}`),
    document.fonts.load("500 40px Onest", sample),
    document.fonts.load("700 40px Onest", sample),
    document.fonts.load("800 40px Onest", sample),
  ]).catch(() => {});
}

export function dot(g, x, y, r) {
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

// Logo: char disk, dough markaz, ö nuqta harfi (favicon çizmasi), yonida "yozgiç".
export function logo(g, x, y) {
  g.fillStyle = C.char; dot(g, x + 40, y + 40, 40);
  g.fillStyle = C.dough; dot(g, x + 40, y + 40, 33);
  g.fillStyle = C.char;
  [[13, 9], [19, 9], [13, 14], [16, 14], [19, 14], [10.5, 17.5], [21.5, 17.5], [10.5, 21], [21.5, 21], [13, 24.5], [16, 24.5], [19, 24.5]]
    .forEach(([px, py]) => dot(g, x + px * 2.5, y + py * 2.5, 4.3));
  g.font = "900 72px Doto, monospace";
  g.textBaseline = "middle";
  g.fillText("yozgiç", x + 104, y + 44);
}

// Non: tekis halqalar, ikki çekiç pip halqasi (saytdagi non kabi 56 va 64 ta).
export function non(g, cx, cy, R) {
  [[R, C.rimEdge], [R * 0.97, C.rim], [R * 0.885, C.rimEdge], [R * 0.86, C.dough]].forEach(([r, color]) => {
    g.fillStyle = color; dot(g, cx, cy, r);
  });
  g.fillStyle = C.pip;
  [[0.72, 56], [0.81, 64]].forEach(([k, n], ring) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.07;
      dot(g, cx + R * k * Math.cos(a), cy + R * k * Math.sin(a), 5.5);
    }
  });
}

/** Crust fon va nuqta törı. */
export function background(g) {
  g.fillStyle = C.crust;
  g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(23,17,13,.15)";
  for (let y = 18; y < H; y += 36) for (let x = 18; x < W; x += 36) dot(g, x, y, 4.2);
}

/** canvas → PNG Blob */
export function toPng(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
