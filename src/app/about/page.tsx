import Link from "next/link";
import { DialogBox } from "@/components/DialogBox";

export default function AboutPage() {
  return (
    <div className="h-full overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_50%_25%,#14141f_0%,#08080f_70%)]">
      <div className="flex justify-between items-center px-6 pt-5 text-sm tracking-wide text-[#6b7280]">
        <span>ABOUT</span>
        <Link href="/" className="hover:text-[#ef4444]">
          HOME
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5 px-6">
        <div className="font-display text-lg text-[#ff3b3b] tracking-[2px] text-center [text-shadow:0_0_16px_rgba(255,59,59,0.5)]">
          THE RED BUTTON
        </div>

        <DialogBox>
          THE RED BUTTON은 매주 하나의 딜레마를 던지는 사회 실험형 웹
          게임입니다.
          {"\n\n"}
          전 세계 참가자가 같은 순간 같은 선택 앞에 서고, 그 결과는 모두가
          함께 만듭니다.
          {"\n\n"}
          결과는 실시간으로 공개되지 않고, 매주 일요일 20:00에 한 번에
          공개됩니다.
        </DialogBox>

        <div className="text-center text-sm text-[#6b7280] tracking-wide">
          제작: (여기에 포트폴리오/제작자 링크가 들어갑니다)
        </div>
      </div>

      <div className="text-center pb-8">
        <Link
          href="/"
          className="text-sm tracking-[2px] text-[#6b7280] hover:text-[#ef4444]"
        >
          ← BACK TO HOME
        </Link>
      </div>
    </div>
  );
}
