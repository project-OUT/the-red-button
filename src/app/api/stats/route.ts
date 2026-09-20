import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getRoundWindow } from "@/lib/round";
import type { RoundStats } from "@/lib/types";

export async function GET() {
  const { roundId } = getRoundWindow();

  const { data, error } = await supabase.rpc("get_round_stats", {
    p_round_id: roundId,
  });

  if (error) {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  const row = data?.[0] ?? { press_count: 0, dont_press_count: 0, total: 0 };
  const stats: RoundStats = {
    totalParticipants: Number(row.total),
    pressCount: Number(row.press_count),
    dontPressCount: Number(row.dont_press_count),
  };

  return NextResponse.json(stats);
}
