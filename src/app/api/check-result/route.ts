import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getOrCreateParticipantId } from "@/lib/participant-cookie";
import { getRoundWindow, isRevealed } from "@/lib/round";
import type { Choice } from "@/lib/types";

type Outcome =
  | { status: "not_played" }
  | { status: "mismatch" }
  | { status: "ok"; choice: Choice; revealed: boolean };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const rawName = (body as { name?: unknown })?.name;
  const rawCode = (body as { code?: unknown })?.code;
  const name = typeof rawName === "string" ? rawName.trim() : "";
  const code = typeof rawCode === "string" ? rawCode : "";

  if (!name || code.length !== 4 || !/^\d{4}$/.test(code)) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const roundWindow = getRoundWindow();
  const revealed = isRevealed(roundWindow);
  const participantId = await getOrCreateParticipantId();

  // This device's own row for the round, if any, tells us whether it has
  // played at all and whether it already claimed a name+code.
  const { data: ownData, error: ownError } = await supabase.rpc("get_my_claim", {
    p_round_id: roundWindow.roundId,
    p_participant_id: participantId,
  });
  if (ownError) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
  const own = ownData?.[0] as { choice: Choice; name: string | null; code: string | null } | undefined;

  if (!own) {
    // Never voted on this device. After reveal, still allow a cross-device
    // lookup by name+code; before reveal there is nothing to claim.
    if (!revealed) {
      return NextResponse.json({ status: "not_played" } satisfies Outcome);
    }
    const { data, error } = await supabase.rpc("lookup_result", {
      p_round_id: roundWindow.roundId,
      p_name: name,
      p_code: code,
    });
    if (error) return NextResponse.json({ error: "server_error" }, { status: 500 });
    const row = data?.[0];
    if (!row) return NextResponse.json({ status: "not_played" } satisfies Outcome);
    return NextResponse.json({
      status: "ok",
      choice: row.choice as Choice,
      revealed,
    } satisfies Outcome);
  }

  if (own.name !== null && own.code !== null) {
    // Already claimed on this device: the submitted name+code must match.
    if (own.name === name && own.code === code) {
      return NextResponse.json({
        status: "ok",
        choice: own.choice,
        revealed,
      } satisfies Outcome);
    }
    return NextResponse.json({ status: "mismatch" } satisfies Outcome);
  }

  // Unclaimed on this device: try to claim the given name+code now.
  const { data, error } = await supabase.rpc("claim_result", {
    p_round_id: roundWindow.roundId,
    p_participant_id: participantId,
    p_name: name,
    p_code: code,
  });
  if (error) {
    if (error.message === "code_taken") {
      return NextResponse.json({ status: "mismatch" } satisfies Outcome);
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
  const row = data?.[0];
  if (!row) return NextResponse.json({ status: "not_played" } satisfies Outcome);
  return NextResponse.json({
    status: "ok",
    choice: row.choice as Choice,
    revealed,
  } satisfies Outcome);
}
