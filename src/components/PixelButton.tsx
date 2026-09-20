"use client";

import Image from "next/image";
import { useState } from "react";
import { playClick } from "@/lib/sound";

export function PixelButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (pressed || disabled) return;
    playClick();
    setPressed(true);
    onPress();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="빨간 버튼"
      disabled={pressed || disabled}
      className="relative w-[220px] h-[236px]"
      style={{ cursor: pressed ? "default" : "pointer" }}
    >
      <span
        className="rb-ring absolute left-1/2 top-[44%] w-[170px] h-[170px] rounded-full -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute left-1/2 bottom-1.5 -translate-x-1/2 rounded-full transition-all duration-100"
        style={{
          width: pressed ? 150 : 110,
          height: 20,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 72%)",
          opacity: pressed ? 1 : 0.7,
        }}
      />
      <Image
        src="/button.png"
        alt="빨간 버튼"
        width={220}
        height={220}
        priority
        className="absolute left-0 top-0 transition-transform duration-[130ms] ease-out"
        style={{
          transformOrigin: "50% 92%",
          transform: pressed
            ? "scaleY(0.8) scaleX(1.07) translateY(3px)"
            : "scaleY(1) scaleX(1) translateY(0)",
          filter: pressed ? "brightness(0.66)" : "brightness(1)",
        }}
      />
    </button>
  );
}
