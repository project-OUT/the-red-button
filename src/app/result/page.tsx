"use client";

import { useState } from "react";
import Link from "next/link";
import { DialogBox } from "@/components/DialogBox";
import { NameCodeFields } from "@/components/NameCodeFields";
import { ShareRow } from "@/components/ShareRow";
import { getRoundWindow, isRevealed, formatRoundPeriod } from "@/lib/round";
import { checkResult } from "@/lib/participation";
import { getMockStats, pressPercent, getVerdict } from "@/lib/mock-data";
import type { Participation } from "@/lib/types";

type Phase = "gate" | "not_played" | "locked" | "revealed";

export default function ResultPage() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [participation, setParticipation] = useState<Participation | null>(
    null,
  );

  const roundWindow = getRoundWindow();
  const revealed = isRevealed(roundWindow);
  const period = formatRoundPeriod(roundWindow);

  const handleSubmit = () => {
    if (!name.trim() || code.length !== 4) {
      setError("이름과 4자리 코드를 모두 입력해주세요.");
      return;
    }
    const result = checkResult(roundWindow.roundId, name.trim(), code);
    if (result.status === "not_played") {
      setPhase("not_played");
      return;
    }
    if (result.status === "mismatch") {
      setError("이름 또는 코드가 일치하지 않습니다.");
      return;
    }
    setError("");
    setParticipation(result.participation);
    setPhase(revealed ? "revealed" : "locked");
  };

  return (
    <div className="relative min-h-dvh flex flex-col bg-[radial-gradient(ellipse_at_50%_25%,#14141f_0%,#08080f_70%)]">
      <div className="flex justify-between items-center px-6 pt-5 text-sm tracking-wide text-[#6b7280]">
        <span>EXP. NO. 001</span>
        <span>RESULT</span>
      </div>

      <div className="flex-1" />

      <div className="px-6">
        {phase === "gate" && (
          <div className="bg-[#12121c] border-[3px] border-[#e5e5e5] shadow-[4px_4px_0_rgba(0,0,0,0.6)] px-4.5 py-4">
            <p className="text-lg leading-snug text-center mb-4">
              {revealed
                ? "결과가 나왔습니다! 등록한 이름과 코드를 입력해주세요."
                : "본인 결과를 확인하려면 등록한 이름과 코드를 입력하세요."}
            </p>
            <NameCodeFields
              idPrefix="result"
              name={name}
              code={code}
              onNameChange={setName}
              onCodeChange={setCode}
            />
            {error && (
              <p className="text-sm text-[#ff8a8a] mt-3 text-center">{error}</p>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full box-border bg-[#1f2937] border-[3px] border-[#6b7280] text-[#e5e5e5] font-display text-xs tracking-[2px] py-3 cursor-pointer"
            >
              확인
            </button>
          </div>
        )}

        {phase === "not_played" && (
          <DialogBox className="text-center">
            아직 이번 라운드에 참여하지 않았습니다.
            <br />
            <Link href="/experiment" className="text-[#ef4444] underline">
              실험에 참여하러 가기
            </Link>
          </DialogBox>
        )}

        {phase === "locked" && (
          <div className="text-center">
            <div className="font-display text-sm tracking-[2px] mb-3.5">
              RESULTS LOCKED
            </div>
            <DialogBox>
              결과는 매주 일요일 20:00에 공개됩니다.
              <br />
              집계 기간: {period}
            </DialogBox>
          </div>
        )}

        {phase === "revealed" && participation && (
          <RevealedResult name={participation.name} choice={participation.choice} period={period} />
        )}
      </div>

      <div className="flex-1" />

      {(phase === "locked" || phase === "revealed") && <ShareRow />}

      <div className="text-center pb-8">
        <Link href="/" className="text-sm tracking-[2px] text-[#6b7280] hover:text-[#ef4444]">
          ← BACK TO HOME
        </Link>
      </div>
    </div>
  );
}

function RevealedResult({
  name,
  choice,
  period,
}: {
  name: string;
  choice: Participation["choice"];
  period: string;
}) {
  const stats = getMockStats();
  const pct = pressPercent(stats);
  const verdict = getVerdict(choice, stats);
  const isLived = verdict === "LIVED";

  return (
    <div>
      <div className="text-center text-sm text-[#4b5058] tracking-wide mb-4">
        집계 기간: {period}
      </div>

      <div className="bg-[#12121c] border-[3px] border-[#e5e5e5] shadow-[4px_4px_0_rgba(0,0,0,0.6)] px-4.5 py-4 mb-5">
        <div className="text-base text-[#9ca3af] tracking-wide">
          TOTAL PARTICIPANTS
        </div>
        <div className="font-display text-xl mt-1.5 mb-3.5">
          {stats.totalParticipants.toLocaleString()}
        </div>

        <div className="flex justify-between text-base mb-1">
          <span>PRESS</span>
          <span>{pct}%</span>
        </div>
        <div className="h-3.5 bg-[#1f1f2b] border-2 border-[#3f3f4f] mb-3">
          <div className="h-full bg-[#ef4444]" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex justify-between text-base mb-1">
          <span>DON&apos;T PRESS</span>
          <span>{100 - pct}%</span>
        </div>
        <div className="h-3.5 bg-[#1f1f2b] border-2 border-[#3f3f4f]">
          <div
            className="h-full bg-[#6b7280]"
            style={{ width: `${100 - pct}%` }}
          />
        </div>
      </div>

      <div className="text-center text-base text-[#9ca3af] tracking-wide">
        YOUR CHOICE
      </div>
      <div className="text-center font-display text-base tracking-[2px] py-2 mb-4">
        {choice === "PRESS" ? "PRESS" : "DON'T PRESS"}
      </div>

      <div className="text-center">
        <div className="text-[15px] text-[#9ca3af] tracking-wide mb-2.5">
          {name || "참가자"}님의 결과
        </div>
        <div
          className={`rb-glow font-display text-[34px] tracking-[2px] ${
            isLived ? "text-[#22c55e]" : "text-[#ef4444]"
          }`}
          style={{
            textShadow: isLived
              ? "0 0 22px rgba(34,197,94,0.6)"
              : "0 0 22px rgba(239,68,68,0.7)",
          }}
        >
          YOU {isLived ? "LIVED" : "DIED"}
        </div>
        <div className="text-base text-[#6b7280] tracking-wide mt-2.5">
          {pct >= 50
            ? "50% 이상이 눌렀기에 모두 생존했습니다"
            : isLived
              ? "50% 미만이 눌렀지만, 당신은 누르지 않아 생존했습니다"
              : "50% 미만이 눌렀기에 버튼을 누른 사람만 사망했습니다"}
        </div>
      </div>
    </div>
  );
}
