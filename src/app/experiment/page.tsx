"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StoryStage } from "@/components/StoryStage";
import { ButtonStage } from "@/components/ButtonStage";

type Stage = "checking" | "story" | "button";

export default function ExperimentPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("checking");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vote")
      .then((res) => res.json())
      .then((data: { played?: boolean }) => {
        if (cancelled) return;
        if (data.played) {
          router.replace("/result");
        } else {
          setStage("story");
        }
      })
      .catch(() => {
        if (!cancelled) setStage("story");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (stage === "checking") {
    return <div className="h-full overflow-hidden bg-[#08080f]" />;
  }

  return stage === "story" ? (
    <StoryStage onDone={() => setStage("button")} />
  ) : (
    <ButtonStage />
  );
}
