"use client";

import { useState } from "react";
import { DialogBox } from "./DialogBox";
import { useTypewriter } from "@/hooks/useTypewriter";

const PAGES = [
  "어느 날,\n당신의 앞에 빨간 버튼 하나가 나타났습니다.",
  "버튼을 누른 사람이 '절반 이상'이라면 '모두' 살아남습니다.",
  "하지만 절반에 미치지 못한다면 '버튼을 누른 사람만 죽습니다.'",
  "당신은 다른 사람을 믿을 수 있습니까?",
];

export function StoryStage({ onDone }: { onDone: () => void }) {
  const [pageIndex, setPageIndex] = useState(0);
  const { shown, done, skip } = useTypewriter(PAGES[pageIndex]);
  const isLastPage = pageIndex === PAGES.length - 1;

  const handleTap = () => {
    if (!done) {
      skip();
      return;
    }
    if (isLastPage) {
      onDone();
    } else {
      setPageIndex((i) => i + 1);
    }
  };

  return (
    <div className="relative h-full overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_50%_22%,#14141f_0%,#08080f_70%)]">
      <div className="flex justify-between items-center px-6 pt-5 text-sm tracking-wide text-[#6b7280]">
        <span>EXP. NO. 001</span>
        <span>
          STORY {pageIndex + 1}/{PAGES.length}
        </span>
      </div>

      <div className="flex-1" />

      <DialogBox className="mx-5 min-h-[150px] text-xl leading-[1.85]">
        {shown}
        <span className="rb-cursor">_</span>
      </DialogBox>

      <div
        className="h-7 text-center pt-2.5 text-[15px] text-[#9ca3af] tracking-[2px]"
        style={{ opacity: done ? 1 : 0 }}
      >
        {done ? (isLastPage ? "탭하여 시작" : "탭하여 계속") : ""}{" "}
        <span className="rb-bounce">▼</span>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={handleTap}
        aria-label="탭하여 계속"
        className="absolute inset-0 cursor-pointer"
      />
    </div>
  );
}
