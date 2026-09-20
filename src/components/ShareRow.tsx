export function ShareRow() {
  return (
    <div>
      <div className="text-center text-[15px] tracking-[2px] text-[#9ca3af] pb-2">
        친구와 함께하기 ▼
      </div>
      <div className="flex justify-center items-center gap-3 flex-wrap text-sm tracking-wide text-[#6b7280] pb-4">
        <a href="#" className="hover:text-[#ef4444]">
          링크 공유
        </a>
        <span>|</span>
        <a href="#" className="hover:text-[#ef4444]">
          카카오톡 공유
        </a>
        <span>|</span>
        <a href="#" className="hover:text-[#ef4444]">
          인스타그램 공유
        </a>
      </div>
    </div>
  );
}
