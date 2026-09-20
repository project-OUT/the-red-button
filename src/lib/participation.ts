import type { Choice, Participation } from "./types";

const STORAGE_PREFIX = "trb:participation:";
const COOKIE_PREFIX = "trb_played_";

function key(roundId: string): string {
  return `${STORAGE_PREFIX}${roundId}`;
}

function setCookie(name: string, value: string) {
  const maxAgeSeconds = 60 * 60 * 24 * 30;
  document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; samesite=lax`;
}

function hasCookie(name: string): boolean {
  return document.cookie.split("; ").some((row) => row.startsWith(`${name}=`));
}

/** Records a choice for the round. One choice per round per browser. */
export function recordChoice(roundId: string, choice: Choice): Participation {
  const participation: Participation = {
    name: "",
    code: "",
    choice,
    roundId,
    choiceAt: new Date().toISOString(),
  };
  localStorage.setItem(key(roundId), JSON.stringify(participation));
  setCookie(`${COOKIE_PREFIX}${roundId}`, "1");
  return participation;
}

export function hasPlayedRound(roundId: string): boolean {
  if (localStorage.getItem(key(roundId)) !== null) return true;
  return hasCookie(`${COOKIE_PREFIX}${roundId}`);
}

export function getParticipation(roundId: string): Participation | null {
  const raw = localStorage.getItem(key(roundId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Participation;
  } catch {
    return null;
  }
}

export type CheckResultOutcome =
  | { status: "not_played" }
  | { status: "mismatch" }
  | { status: "ok"; participation: Participation };

/**
 * Verifies name+code for a round. The first check after playing saves the
 * name+code as the participant's record; later checks must match it.
 * This is a client-only stand-in for a real Supabase-backed lookup.
 */
export function checkResult(
  roundId: string,
  name: string,
  code: string,
): CheckResultOutcome {
  const existing = getParticipation(roundId);
  if (!existing) return { status: "not_played" };

  if (!existing.name && !existing.code) {
    const updated: Participation = { ...existing, name, code };
    localStorage.setItem(key(roundId), JSON.stringify(updated));
    return { status: "ok", participation: updated };
  }

  if (existing.name === name && existing.code === code) {
    return { status: "ok", participation: existing };
  }

  return { status: "mismatch" };
}
