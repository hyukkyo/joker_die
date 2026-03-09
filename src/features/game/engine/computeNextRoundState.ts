import type { GameState } from "../types/game";
import type { RoundResult } from "../types/round";

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
    playerChoice: null,
    computerChoice: null,
    drawStreak: result.drawCountAfterRound,
    doubleDamageActive: result.nextRoundDoubleDamage,
    latestRoundResult: result,
    roundLogs: [result, ...state.roundLogs].slice(0, 8),
    winner: result.matchWinner === "none" ? null : result.matchWinner,
    endReason: result.endReason,
  };
}

