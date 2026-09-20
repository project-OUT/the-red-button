import Link from "next/link";
import { DialogBox } from "@/components/DialogBox";

export default function ArchivePage() {
  return (
    <div className="h-full overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_50%_25%,#14141f_0%,#08080f_70%)]">
      <div className="flex justify-between items-center px-6 pt-5 text-sm tracking-wide text-[#6b7280]">
        <span>ARCHIVE</span>
        <Link href="/" className="hover:text-[#ef4444]">
          HOME
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6">
        <DialogBox className="text-center">
          아직 지난 실험 기록이 없습니다.
          <br />
          첫 번째 실험이 끝나면 여기에 쌓이기 시작합니다.
        </DialogBox>
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
