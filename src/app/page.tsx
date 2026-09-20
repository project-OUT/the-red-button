import Link from "next/link";
import { DialogBox } from "@/components/DialogBox";

export default function HomePage() {
  return (
    <div className="relative h-full overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_50%_30%,#14141f_0%,#0a0a12_70%)]">
      <div className="flex justify-between items-center px-6 pt-5 text-sm tracking-wide text-[#6b7280]">
        <span>EXP. NO. 001</span>
        <span>SUN 20:00</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-[18px] px-8 text-center">
        <div className="rb-glow font-display text-[13px] text-[#ef4444] tracking-[4px] [text-shadow:0_0_12px_rgba(239,68,68,0.65)]">
          THE
        </div>
        <div className="rb-glow font-display text-[28px] leading-[1.4] text-[#ff3b3b] tracking-[2px] [text-shadow:0_0_20px_rgba(255,59,59,0.55)]">
          RED
          <br />
          BUTTON
        </div>
        <div className="text-lg text-[#9ca3af] tracking-[2px] mt-1.5">
          A WEEKLY SOCIAL EXPERIMENT
        </div>
      </div>

      <DialogBox className="mx-5">
        당신에게 하나의 선택이 주어집니다.
        {"\n"}누를 것인가, 누르지 않을 것인가.
      </DialogBox>

      <div className="text-center pt-3.5 pb-1 text-[15px] text-[#9ca3af] tracking-[2px]">
        탭하여 시작
      </div>

      <div className="relative flex justify-center gap-6 pt-2.5 pb-6 text-sm tracking-wide text-[#6b7280]">
        <Link href="/about" className="hover:text-[#ef4444]">
          ABOUT
        </Link>
        <span>·</span>
        <Link href="/archive" className="hover:text-[#ef4444]">
          ARCHIVE
        </Link>
      </div>

      <Link
        href="/experiment"
        aria-label="실험 시작"
        className="absolute inset-x-0 top-0"
        style={{ height: "calc(100% - 70px)" }}
      />
    </div>
  );
}
