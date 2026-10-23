// 10 savollik test: birinçi variant töğri, ekranda aralaşadi. « » içida eski yozuv ataylab.
export const QUESTIONS = [
  { q: "«o'zbek» yangi alifboda qanday yoziladi?", options: ["özbek", "ozbek", "uzbek"], why: "«o'» bitta harf böladi: ö." },
  { q: "«choy» qanday yoziladi?", options: ["çoy", "şoy", "coy"], why: "«ch» bitta harf: ç." },
  { q: "«shahar» qanday yoziladi?", options: ["şahar", "sahar", "çahar"], why: "«sh» bitta harf: ş." },
  { q: "«tog'» qanday yoziladi?", options: ["toğ", "tog", "toq"], why: "«g'» bitta harf böladi: ğ." },
  { q: "«Is'hoq» qanday yoziladi?", options: ["Isʼhoq", "Işoq", "Isxoq"], why: "Bu sözda s va h alohida öqiladi, şuning uçun tutuq qoladi: sʼh." },
  { q: "«ma'no» qanday yoziladi?", options: ["maʼno", "mano", "mağno"], why: "Tutuq belgisi qoladi, faqat şakli ʼ böladi." },
  { q: "«tong» qanday yoziladi?", options: ["tong", "toñ", "tonğ"], why: "ng özgarmaydi." },
  { q: "Qaysi biri özbekça ş?", options: ["ş", "ș", "š"], why: "Özbekça ş ostida ilmoq bor. ș (ostida vergul) va š (tepasida qalpoqça) boşqa tillarning harfi." },
  { q: "Kirilldagi «Ўзбекистон» yangi alifboda qanday yoziladi?", options: ["Özbekiston", "Uzbekiston", "Oʼzbekiston"], why: "Kirilldagi «ў» ham ö böladi." },
  { q: "Yangi alifbo haqidagi qonun qaçon kuçga kiradi?", options: ["22.04.2027", "01.01.2027", "21.10.2026"], why: "ЎРҚ-1184-son Qonun 21.10.2026 da imzolangan, 22.04.2027 dan kuçga kiradi." },
];

export function grade(score) {
  if (score >= 10) return "Aʼlo! Yangi alifboni töliq bilasiz.";
  if (score >= 7) return "Zör! Yangi alifboga deyarli tayyorsiz.";
  if (score >= 4) return "Yomon emas. Qoidalarni bir körib çiqing.";
  return "Boşlaniş şunday böladi. Qoidalarni öqib, qaytadan urinib köring.";
}

/** Fisher–Yates; kiriş massivini özgartirmaydi. */
export function shuffle(items, rand = Math.random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
