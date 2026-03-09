import type { GameState } from "../types/game";
import {
  INITIAL_HP,
  INITIAL_ROUND,
  INITIAL_TIME_LIMIT,
} from "../utils/constants";

export function createInitialGameState(): GameState {
  return {
    phase: "start",
    round: INITIAL_ROUND,
    playerHp: INITIAL_HP,
    computerHp: INITIAL_HP,
    remainingTime: INITIAL_TIME_LIMIT,
    playerChoice: null,
    computerChoice: null,
    drawStreak: 0,
    doubleDamageActive: false,
    latestRoundResult: null,
    roundLogs: [],
    winner: null,
    endReason: "none",
  };
}

