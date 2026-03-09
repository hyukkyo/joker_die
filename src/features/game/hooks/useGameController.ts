import { useEffect, useEffectEvent, useReducer, useRef } from "react";
import { weightedAi } from "../ai/weightedAi";
import { resolveRound } from "../engine/resolveRound";
import { useRoundTimer } from "./useRoundTimer";
import { gameReducer } from "../state/gameReducer";
import { createInitialGameState } from "../state/initialGameState";
import type { Choice } from "../types/round";

const COMPUTER_THINK_DELAY_MS = 500;
const RESULT_REVEAL_DELAY_MS = 500;
const ROUND_RESULT_VISIBLE_MS = 5000;

export function useGameController() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const isResolvingRef = useRef(false);
  const thinkTimeoutRef = useRef<number | null>(null);
  const revealTimeoutRef = useRef<number | null>(null);
  const resultTimeoutRef = useRef<number | null>(null);

  function startGame() {
    dispatch({ type: "startGame" });
  }

  function restartGame() {
    isResolvingRef.current = false;
    if (thinkTimeoutRef.current !== null) {
      window.clearTimeout(thinkTimeoutRef.current);
      thinkTimeoutRef.current = null;
    }
    if (revealTimeoutRef.current !== null) {
      window.clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
    if (resultTimeoutRef.current !== null) {
      window.clearTimeout(resultTimeoutRef.current);
      resultTimeoutRef.current = null;
    }
    dispatch({ type: "restartGame" });
  }

  function dismissRoundResult() {
    if (!state.isRoundResultVisible || state.phase !== "playing") {
      return;
    }

    if (resultTimeoutRef.current !== null) {
      window.clearTimeout(resultTimeoutRef.current);
      resultTimeoutRef.current = null;
    }

    dispatch({ type: "finishRoundPresentation" });
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
      dispatch({
        type: "revealComputerChoice",
        payload: {
          playerChoice,
          computerChoice,
        },
      });

      revealTimeoutRef.current = window.setTimeout(() => {
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
        if (!result.matchEnd) {
          resultTimeoutRef.current = window.setTimeout(() => {
            dispatch({ type: "finishRoundPresentation" });
            resultTimeoutRef.current = null;
          }, ROUND_RESULT_VISIBLE_MS);
        }
        revealTimeoutRef.current = null;
        isResolvingRef.current = false;
      }, RESULT_REVEAL_DELAY_MS);

      thinkTimeoutRef.current = null;
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
    if (!result.matchEnd) {
      resultTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: "finishRoundPresentation" });
        resultTimeoutRef.current = null;
      }, ROUND_RESULT_VISIBLE_MS);
    }
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
      if (revealTimeoutRef.current !== null) {
        window.clearTimeout(revealTimeoutRef.current);
      }
      if (resultTimeoutRef.current !== null) {
        window.clearTimeout(resultTimeoutRef.current);
      }
    };
  }, []);

  return {
    state,
    timer,
    startGame,
    restartGame,
    playRound,
    dismissRoundResult,
  };
}
