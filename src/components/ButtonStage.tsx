"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DialogBox } from "./DialogBox";
import { PixelButton } from "./PixelButton";
import { useTypewriter } from "@/hooks/useTypewriter";
import { getRoundWindow } from "@/lib/round";
import { recordChoice } from "@/lib/participation";
import type { Choice } from "@/lib/types";

function dialogFor(timeLeft: number): string {
  if (timeLeft <= 20) return "당신이 누르지 않아도\n다른 누군가가 누를것입니다.";
  if (timeLeft <= 30) return "당신은 다른 사람을 믿습니까?";
  if (timeLeft <= 45) return "누군가는 이미 선택했습니다.";
  return "당신의 선택은 기록됩니다.";
}

const CONFIRM_MESSAGE: Record<Choice, string> = {
  PRESS: "당신은 버튼을 눌렀습니다.",
  DONT_PRESS: "당신은 버튼을 누르지 않았습니다.",
};
const CONFIRM_DISPLAY_MS = 5000;

export function ButtonStage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(60);
  const [pressed, setPressed] = useState(false);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const finishedRef = useRef(false);

  const { shown } = useTypewriter(dialogFor(timeLeft));

  const finish = (choice: Choice) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const { roundId } = getRoundWindow();
    recordChoice(roundId, choice);
    if (choice === "PRESS") {
      setShake(true);
      setFlash(true);
    }
    setConfirmMessage(CONFIRM_MESSAGE[choice]);
    setTimeout(() => router.push("/result"), CONFIRM_DISPLAY_MS);
  };

  useEffect(() => {
    if (pressed || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, pressed]);

  useEffect(() => {
    if (pressed || timeLeft > 0) return;
    // Deferred so the timeout branch calls finish() from a callback rather
    // than synchronously during the effect body.
    const id = setTimeout(() => finish("DONT_PRESS"), 0);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, pressed]);

  const handlePress = () => {
    setPressed(true);
    finish("PRESS");
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return (
    <div
      className={`relative min-h-dvh flex flex-col bg-[#08080f] ${shake ? "rb-shake" : ""}`}
      style={{
        backgroundImage:
          "radial-gradient(ellipse 340px 380px at 50% 62%, rgba(120,20,20,0.22) 0%, rgba(10,10,16,0) 70%)",
      }}
    >
      <div
        aria-hidden
        className={`absolute inset-0 pointer-events-none z-50 bg-[#ff2b2b] ${
          flash ? "rb-flash" : "opacity-0"
        }`}
      />

      <div className="flex flex-col items-center pt-5 pb-1.5">
        <div className="text-sm tracking-[3px] text-[#6b7280]">
          TIME REMAINING
        </div>
        <div className="font-display text-4xl text-[#ff3b3b] mt-1.5 [text-shadow:0_0_16px_rgba(255,59,59,0.6)]">
          {mm}:{ss}
        </div>
      </div>

      <DialogBox className="mx-5 mt-3.5 min-h-[78px]">
        {shown}
        <span className="rb-cursor">_</span>
      </DialogBox>

      <div className="flex-1" />

      <div className="flex justify-center items-center pb-2">
        <PixelButton onPress={handlePress} disabled={pressed} />
      </div>

      <div className="flex-1" />

      <div
        className="text-center px-5 pb-7 text-base tracking-wide"
        style={{ color: pressed ? "#ff8a8a" : "#6b7280" }}
      >
        {pressed
          ? "선택이 기록되었습니다. 되돌릴 수 없습니다."
          : "누르거나, 아무것도 하지 마세요"}
      </div>

      {confirmMessage && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/75 px-8">
          <DialogBox className="text-center text-xl">
            {confirmMessage}
          </DialogBox>
        </div>
      )}
    </div>
  );
}
