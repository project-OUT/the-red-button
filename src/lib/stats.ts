import type { Choice, RoundStats } from "./types";

export function pressPercent(stats: RoundStats): number {
  if (stats.totalParticipants === 0) return 0;
  return Math.round((stats.pressCount / stats.totalParticipants) * 100);
}

/** Rule: press ratio >= 50% -> everyone lives; below 50% -> only pressers die. */
export function getVerdict(choice: Choice, stats: RoundStats): "LIVED" | "DIED" {
  if (stats.totalParticipants === 0) return "LIVED";
  const ratio = (stats.pressCount / stats.totalParticipants) * 100;
  if (ratio >= 50) return "LIVED";
  return choice === "PRESS" ? "DIED" : "LIVED";
}
