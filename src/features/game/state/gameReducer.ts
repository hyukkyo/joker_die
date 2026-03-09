import type { GameAction, GameState } from "../types/game";
import { createInitialGameState } from "./initialGameState";
import { computeNextRoundState } from "../engine/computeNextRoundState";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "startGame":
      return {
        ...createInitialGameState(),
        phase: "playing",
      };
    case "restartGame":
      return createInitialGameState();
    case "applyRound":
      return computeNextRoundState(state, action.payload);
    default:
      return state;
  }
}

