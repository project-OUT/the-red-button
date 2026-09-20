export type Choice = "PRESS" | "DONT_PRESS";

export interface RoundWindow {
  roundId: string;
  periodStart: Date;
  periodEnd: Date;
  revealAt: Date;
}

export interface RoundStats {
  totalParticipants: number;
  pressCount: number;
  dontPressCount: number;
}

export interface Participation {
  name: string;
  code: string;
  choice: Choice;
  roundId: string;
  choiceAt: string;
}
