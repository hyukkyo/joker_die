import type { GameAction, GameState } from "../types/game";
import { INITIAL_TIME_LIMIT } from "../utils/constants";
import { createInitialGameState } from "./initialGameState";
import { computeNextRoundState } from "../engine/computeNextRoundState";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "startGame":
      return {
        ...createInitialGameState(),
        phase: "playing",
        isChoiceLocked: false,
      };
    case "restartGame":
      return createInitialGameState();
    case "tickTimer":
      if (state.phase !== "playing" || state.isChoiceLocked) {
        return state;
      }

      return {
        ...state,
        remainingTime: Math.max(0, state.remainingTime - 1),
      };
    case "setChoiceLocked":
      return {
        ...state,
        isChoiceLocked: action.payload,
      };
    case "startComputerThinking":
      return {
        ...state,
        isChoiceLocked: true,
        isComputerThinking: true,
        playerChoice: action.payload.playerChoice,
        computerChoice: null,
      };
    case "applyRound":
      return computeNextRoundState(state, action.payload);
    default:
      return state;
  }
}
