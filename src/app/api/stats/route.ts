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

  // Aggregate counts don't need per-request freshness: let Vercel's edge
  // cache absorb repeated hits (e.g. everyone opening /result at once)
  // instead of re-querying Supabase for each one.
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
    },
  });
}
