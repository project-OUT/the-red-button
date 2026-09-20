import "server-only";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "trb_pid";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

/** Reads the device's participant id cookie, creating one if missing. */
export async function getOrCreateParticipantId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return id;
}

/** Reads the participant id cookie without creating one. */
export async function readParticipantId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}
