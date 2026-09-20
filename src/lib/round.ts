import type { RoundWindow } from "./types";

function atTime(date: Date, h: number, m: number, s: number, ms = 0): Date {
  const d = new Date(date);
  d.setHours(h, m, s, ms);
  return d;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Monday 00:00 -> Sunday 19:59, results reveal Sunday 20:00. */
export function getRoundWindow(now: Date = new Date()): RoundWindow {
  const day = now.getDay(); // 0 = Sun .. 6 = Sat
  const diffToMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  const periodStart = atTime(monday, 0, 0, 0);

  const sunday = new Date(periodStart);
  sunday.setDate(periodStart.getDate() + 6);

  const periodEnd = atTime(sunday, 19, 59, 59, 999);
  const revealAt = atTime(sunday, 20, 0, 0);

  const roundId = `${periodStart.getFullYear()}${pad(periodStart.getMonth() + 1)}${pad(periodStart.getDate())}`;

  return { roundId, periodStart, periodEnd, revealAt };
}

export function isRevealed(window: RoundWindow, now: Date = new Date()): boolean {
  return now.getTime() >= window.revealAt.getTime();
}

function formatDateTime(d: Date): string {
  const yy = pad(d.getFullYear() % 100);
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yy}/${mm}/${dd} ${hh}:${min}`;
}

export function formatRoundPeriod(window: RoundWindow): string {
  const endDisplay = new Date(window.periodEnd);
  endDisplay.setMilliseconds(0);
  endDisplay.setSeconds(0);
  return `${formatDateTime(window.periodStart)} - ${formatDateTime(endDisplay)}`;
}
