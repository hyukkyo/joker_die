import type { Choice, EndReason, RoundResult } from "./round";

export type GamePhase = "start" | "playing" | "result";

export type GameState = {
  phase: GamePhase;
  round: number;
  playerHp: number;
  computerHp: number;
  remainingTime: number;
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  drawStreak: number;
  doubleDamageActive: boolean;
  latestRoundResult: RoundResult | null;
  roundLogs: RoundResult[];
  winner: "player" | "computer" | null;
  endReason: EndReason;
};

export type GameAction =
  | { type: "startGame" }
  | { type: "restartGame" }
  | { type: "applyRound"; payload: RoundResult };

