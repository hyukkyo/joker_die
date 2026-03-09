import { useReducer } from "react";
import { randomAi } from "../ai/randomAi";
import { resolveRound } from "../engine/resolveRound";
import { gameReducer } from "../state/gameReducer";
import { createInitialGameState } from "../state/initialGameState";
import type { Choice } from "../types/round";

export function useGameController() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);

  function startGame() {
    dispatch({ type: "startGame" });
  }

  function restartGame() {
    dispatch({ type: "restartGame" });
  }

  function playRound(playerChoice: Choice) {
    if (state.phase !== "playing") {
      return;
    }

    const computerChoice = randomAi();
    const result = resolveRound({
      round: state.round,
      playerHp: state.playerHp,
      computerHp: state.computerHp,
      playerChoice,
      computerChoice,
      drawStreak: state.drawStreak,
      doubleDamageActive: state.doubleDamageActive,
    });

    dispatch({ type: "applyRound", payload: result });
  }

  return {
    state,
    startGame,
    restartGame,
    playRound,
  };
}

