import type { Choice, RoundStats } from "./types";

/**
 * Mock aggregate results, standing in for a Supabase query until the
 * backend is wired up. Press ratio >= 50 -> everyone lives; below 50 ->
 * only PRESS voters die. Flip PRESS_RATIO below 0.5 to preview the DIED
 * branch during development.
 */
const TOTAL_PARTICIPANTS = 128402;
const PRESS_RATIO = 0.61;

export function getMockStats(): RoundStats {
  const pressCount = Math.round(TOTAL_PARTICIPANTS * PRESS_RATIO);
  return {
    totalParticipants: TOTAL_PARTICIPANTS,
    pressCount,
    dontPressCount: TOTAL_PARTICIPANTS - pressCount,
  };
}

export function pressPercent(stats: RoundStats): number {
  return Math.round((stats.pressCount / stats.totalParticipants) * 100);
}

/** Rule: press ratio >= 50% -> everyone lives; below 50% -> only pressers die. */
export function getVerdict(choice: Choice, stats: RoundStats): "LIVED" | "DIED" {
  const ratio = (stats.pressCount / stats.totalParticipants) * 100;
  if (ratio >= 50) return "LIVED";
  return choice === "PRESS" ? "DIED" : "LIVED";
}
