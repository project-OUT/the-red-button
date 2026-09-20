import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getOrCreateParticipantId, readParticipantId } from "@/lib/participant-cookie";
import { getRoundWindow, isRevealed } from "@/lib/round";
import type { Choice } from "@/lib/types";

/** Whether this device has already voted in the current round. */
export async function GET() {
  const { roundId } = getRoundWindow();
  const participantId = await readParticipantId();

  if (!participantId) {
    return NextResponse.json({ played: false });
  }

  const { data, error } = await supabase.rpc("get_my_claim", {
    p_round_id: roundId,
    p_participant_id: participantId,
  });

  if (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const row = data?.[0];
  if (!row) return NextResponse.json({ played: false });
  return NextResponse.json({ played: true, choice: row.choice as Choice });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const choice = (body as { choice?: unknown })?.choice;
  if (choice !== "PRESS" && choice !== "DONT_PRESS") {
    return NextResponse.json({ error: "invalid_choice" }, { status: 400 });
  }

  const roundWindow = getRoundWindow();
  if (isRevealed(roundWindow)) {
    return NextResponse.json({ error: "round_closed" }, { status: 409 });
  }

  const participantId = await getOrCreateParticipantId();

  const { error } = await supabase.rpc("cast_vote", {
    p_round_id: roundWindow.roundId,
    p_participant_id: participantId,
    p_choice: choice,
    p_ip_hash: null,
  });

  if (error) {
    if (error.message === "already_voted") {
      return NextResponse.json({ error: "already_voted" }, { status: 409 });
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, roundId: roundWindow.roundId });
}
