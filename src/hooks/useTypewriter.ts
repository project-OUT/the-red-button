"use client";

import { useEffect, useRef, useState } from "react";
import { playBlip } from "@/lib/sound";

/** Reveals `text` one character at a time, playing a blip per character. */
export function useTypewriter(text: string, tickMs = 45) {
  const [renderedText, setRenderedText] = useState(text);
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset display state during render when the target text changes
  // (React's documented pattern for adjusting state on a prop change).
  if (text !== renderedText) {
    setRenderedText(text);
    setShown("");
    setDone(false);
  }

  useEffect(() => {
    let i = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      i += 1;
      if (i > text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDone(true);
        return;
      }
      const ch = text[i - 1];
      if (ch && ch.trim().length > 0) playBlip();
      setShown(text.slice(0, i));
    }, tickMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, tickMs]);

  const skip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShown(text);
    setDone(true);
  };

  return { shown, done, skip };
}
