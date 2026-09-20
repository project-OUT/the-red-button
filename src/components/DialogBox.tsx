import type { ReactNode } from "react";

export function DialogBox({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#12121c] border-[3px] border-[#e5e5e5] shadow-[4px_4px_0_rgba(0,0,0,0.6)] px-4 py-3.5 text-lg leading-relaxed whitespace-pre-line ${className}`}
    >
      {children}
    </div>
  );
}
