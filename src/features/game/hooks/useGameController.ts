import { useEffect, useEffectEvent, useReducer, useRef } from "react";
import { weightedAi } from "../ai/weightedAi";
import { resolveRound } from "../engine/resolveRound";
import { useRoundTimer } from "./useRoundTimer";
import { gameReducer } from "../state/gameReducer";
import { createInitialGameState } from "../state/initialGameState";
import type { Choice } from "../types/round";

const COMPUTER_THINK_DELAY_MS = 700;

export function useGameController() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const isResolvingRef = useRef(false);
  const thinkTimeoutRef = useRef<number | null>(null);

  function startGame() {
    dispatch({ type: "startGame" });
  }

  function restartGame() {
    isResolvingRef.current = false;
    if (thinkTimeoutRef.current !== null) {
      window.clearTimeout(thinkTimeoutRef.current);
      thinkTimeoutRef.current = null;
    }
    dispatch({ type: "restartGame" });
  }

  function playRound(playerChoice: Choice) {
    if (state.phase !== "playing" || state.isChoiceLocked || isResolvingRef.current) {
      return;
    }

    isResolvingRef.current = true;
    dispatch({
      type: "startComputerThinking",
      payload: {
        playerChoice,
      },
    });

    thinkTimeoutRef.current = window.setTimeout(() => {
      const computerChoice = weightedAi({
        state,
        playerChoice,
      });
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
      thinkTimeoutRef.current = null;
      isResolvingRef.current = false;
    }, COMPUTER_THINK_DELAY_MS);
  }

  const handleTimeout = useEffectEvent(() => {
    if (state.phase !== "playing" || state.isChoiceLocked || isResolvingRef.current) {
      return;
    }

    isResolvingRef.current = true;
    dispatch({ type: "setChoiceLocked", payload: true });

    const result = resolveRound({
      round: state.round,
      playerHp: state.playerHp,
      computerHp: state.computerHp,
      playerChoice: null,
      computerChoice: null,
      drawStreak: state.drawStreak,
      doubleDamageActive: state.doubleDamageActive,
    });

    dispatch({ type: "applyRound", payload: result });
    isResolvingRef.current = false;
  });

  const timer = useRoundTimer({
    isActive: state.phase === "playing" && !state.isChoiceLocked,
    remainingTime: state.remainingTime,
    onTick: () => dispatch({ type: "tickTimer" }),
  });

  useEffect(() => {
    if (
      state.phase === "playing" &&
      !state.isChoiceLocked &&
      state.remainingTime === 0
    ) {
      handleTimeout();
    }
  }, [handleTimeout, state.isChoiceLocked, state.phase, state.remainingTime]);

  useEffect(() => {
    return () => {
      if (thinkTimeoutRef.current !== null) {
        window.clearTimeout(thinkTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    timer,
    startGame,
    restartGame,
    playRound,
  };
}
