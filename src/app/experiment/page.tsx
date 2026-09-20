"use client";

import { useState } from "react";
import { StoryStage } from "@/components/StoryStage";
import { ButtonStage } from "@/components/ButtonStage";

export default function ExperimentPage() {
  const [stage, setStage] = useState<"story" | "button">("story");

  return stage === "story" ? (
    <StoryStage onDone={() => setStage("button")} />
  ) : (
    <ButtonStage />
  );
}
