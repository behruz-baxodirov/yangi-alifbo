// Örnatgandan keyingi tekşiruv: maydonga yozilgan matnda yangi harflar çiqdimi yoki eski şakl qoldimi.
export const NEW = ["ö", "ğ", "ş", "ç", "ʼ"];

// Yozgiç ögiradigan eski şakllar. s'h va ma'no kabi tutuqlar bu yerga kirmaydi.
const OLD = [["o'", /o['`‘’ʻ´]/], ["g'", /g['`‘’ʻ´]/], ["sh", /sh/], ["ch", /ch/]];

/**
 * verdict: "kutish" — hali hukm yöq, "ishlayapti" — kamida bitta yangi harf,
 * "tayyor" — ö ğ ş ç törttalasi (tutuq ixtiyoriy), "ishlamadi" — yangi harf yöq, eski şakl bor.
 */
export function checkTyping(text) {
  const t = text.normalize("NFC").toLowerCase();
  const found = NEW.filter((ch) => t.includes(ch));
  const old = OLD.filter(([, re]) => re.test(t)).map(([name]) => name);
  const verdict = ["ö", "ğ", "ş", "ç"].every((ch) => found.includes(ch)) ? "tayyor"
    : found.length ? "ishlayapti"
    : old.length ? "ishlamadi"
    : "kutish";
  return { found, old, verdict };
}
