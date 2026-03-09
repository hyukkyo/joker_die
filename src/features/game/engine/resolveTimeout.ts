import { TIMEOUT_DAMAGE } from "../utils/constants";
import type { RoundContext, RoundResult } from "../types/round";

export function resolveTimeout(context: RoundContext): RoundResult {
  const nextPlayerHp = context.playerHp - TIMEOUT_DAMAGE;
  const matchEnd = nextPlayerHp <= 0;

  return {
    round: context.round,
    playerChoice: null,
    computerChoice: null,
    resultType: "timeout_penalty",
    winner: "computer",
    loser: "player",
    damageTarget: "player",
    baseDamage: TIMEOUT_DAMAGE,
    finalDamage: TIMEOUT_DAMAGE,
    multiplierApplied: 1,
    instantFinish: false,
    matchEnd,
    matchWinner: matchEnd ? "computer" : "none",
    endReason: matchEnd ? "hp_zero_player" : "none",
    drawCountAfterRound: 0,
    nextRoundDoubleDamage: context.round + 1 >= 16,
    logKey: "round.timeout",
  };
}

