import type { GameState } from "../types/game";
import type { RoundResult } from "../types/round";
import { INITIAL_TIME_LIMIT } from "../utils/constants";

export function computeNextRoundState(
  state: GameState,
  result: RoundResult,
): GameState {
  const playerHp =
    result.damageTarget === "player"
      ? state.playerHp - result.finalDamage
      : state.playerHp;
  const computerHp =
    result.damageTarget === "computer"
      ? state.computerHp - result.finalDamage
      : state.computerHp;

  return {
    ...state,
    phase: result.matchEnd ? "result" : "playing",
    round: result.matchEnd ? state.round : state.round + 1,
    playerHp,
    computerHp,
    remainingTime: result.matchEnd ? 0 : INITIAL_TIME_LIMIT,
    isChoiceLocked: !result.matchEnd,
    isComputerThinking: false,
    isRoundResultVisible: !result.matchEnd,
    playerChoice: result.playerChoice,
    computerChoice: result.computerChoice,
    drawStreak: result.drawCountAfterRound,
    doubleDamageActive: result.nextRoundDoubleDamage,
    latestRoundResult: result,
    roundLogs: [result, ...state.roundLogs].slice(0, 8),
    winner: result.matchWinner === "none" ? null : result.matchWinner,
    endReason: result.endReason,
  };
}
