import type { RoundWindow } from "./types";

/** All round boundaries are defined in KST (UTC+9), regardless of the
 * client or server's own local timezone, so the browser and the server
 * always agree on which round a given instant belongs to. */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Shifts a Date so its UTC getters read as KST wall-clock components. */
function toKstShifted(date: Date): Date {
  return new Date(date.getTime() + KST_OFFSET_MS);
}

function fromKstShifted(kstShifted: Date): Date {
  return new Date(kstShifted.getTime() - KST_OFFSET_MS);
}

/** Monday 00:00 -> Sunday 19:59 KST, results reveal Sunday 20:00 KST. */
export function getRoundWindow(now: Date = new Date()): RoundWindow {
  const kstNow = toKstShifted(now);
  const day = kstNow.getUTCDay(); // 0 = Sun .. 6 = Sat, in KST

  const kstMonday = new Date(kstNow);
  const diffToMonday = day === 0 ? 6 : day - 1;
  kstMonday.setUTCDate(kstNow.getUTCDate() - diffToMonday);
  kstMonday.setUTCHours(0, 0, 0, 0);

  const kstSunday = new Date(kstMonday);
  kstSunday.setUTCDate(kstMonday.getUTCDate() + 6);

  const kstPeriodEnd = new Date(kstSunday);
  kstPeriodEnd.setUTCHours(19, 59, 59, 999);

  const kstRevealAt = new Date(kstSunday);
  kstRevealAt.setUTCHours(20, 0, 0, 0);

  const roundId = `${kstMonday.getUTCFullYear()}${pad(kstMonday.getUTCMonth() + 1)}${pad(kstMonday.getUTCDate())}`;

  return {
    roundId,
    periodStart: fromKstShifted(kstMonday),
    periodEnd: fromKstShifted(kstPeriodEnd),
    revealAt: fromKstShifted(kstRevealAt),
  };
}

export function isRevealed(window: RoundWindow, now: Date = new Date()): boolean {
  return now.getTime() >= window.revealAt.getTime();
}

function formatKstDateTime(instant: Date): string {
  const k = toKstShifted(instant);
  const yy = pad(k.getUTCFullYear() % 100);
  const mm = pad(k.getUTCMonth() + 1);
  const dd = pad(k.getUTCDate());
  const hh = pad(k.getUTCHours());
  const min = pad(k.getUTCMinutes());
  return `${yy}/${mm}/${dd} ${hh}:${min}`;
}

export function formatRoundPeriod(window: RoundWindow): string {
  const endDisplay = new Date(window.periodEnd);
  endDisplay.setMilliseconds(0);
  endDisplay.setSeconds(0);
  return `${formatKstDateTime(window.periodStart)} - ${formatKstDateTime(endDisplay)}`;
}
