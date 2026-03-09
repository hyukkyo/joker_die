import type { Choice, EndReason, RoundResult } from "./round";

export type GamePhase = "start" | "playing" | "result";

export type GameState = {
  phase: GamePhase;
  round: number;
  playerHp: number;
  computerHp: number;
  remainingTime: number;
  isChoiceLocked: boolean;
  isComputerThinking: boolean;
  isRoundResultVisible: boolean;
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
  | { type: "tickTimer" }
  | { type: "setChoiceLocked"; payload: boolean }
  | { type: "finishRoundPresentation" }
  | {
      type: "revealComputerChoice";
      payload: {
        playerChoice: Choice;
        computerChoice: Choice;
      };
    }
  | {
      type: "startComputerThinking";
      payload: {
        playerChoice: Choice;
      };
    }
  | { type: "applyRound"; payload: RoundResult };
