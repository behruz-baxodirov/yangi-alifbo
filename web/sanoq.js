// ЎРҚ-1184-son Qonun: imzolangan va kuçga kiradigan kun. Sanoq qurilmaning mahalliy sanasidan.
export const SIGNED = "2026-10-21";
export const IN_FORCE = "2027-04-22";

const DAY = 864e5;
const utc = (iso) => Date.parse(`${iso}T00:00:00Z`);
// Faqat kalendar sanasi olinadi: soat va yozgi vaqt bir kunni surib yubormaydi.
const dayOf = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

export function daysLeft(today) {
  return Math.max(0, Math.round((utc(IN_FORCE) - dayOf(today)) / DAY));
}

export function dayDots(today) {
  const total = Math.round((utc(IN_FORCE) - utc(SIGNED)) / DAY);
  const passed = Math.round((dayOf(today) - utc(SIGNED)) / DAY);
  return { total, passed: Math.min(total, Math.max(0, passed)) };
}

/** "oldin" — kuçga kirişdan oldin, "bugun" — kuçga kiradigan kun, "keyin" — undan keyin. */
export function lawPhase(today) {
  const diff = dayOf(today) - utc(IN_FORCE);
  return diff < 0 ? "oldin" : diff === 0 ? "bugun" : "keyin";
}
