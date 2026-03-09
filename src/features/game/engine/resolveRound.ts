import type { RoundContext, RoundResult } from "../types/round";
import { resolveChoiceBattle } from "./resolveChoiceBattle";
import { resolveSameChoice } from "./resolveSameChoice";
import { resolveTimeout } from "./resolveTimeout";

export function resolveRound(context: RoundContext): RoundResult {
  if (context.playerChoice === null) {
    return resolveTimeout(context);
  }

  if (context.computerChoice === null) {
    throw new Error("computerChoice is required when playerChoice exists.");
  }

  if (context.playerChoice === context.computerChoice) {
    const outcome = resolveSameChoice({
      choice: context.playerChoice,
      playerHp: context.playerHp,
      computerHp: context.computerHp,
    });

    const finalDamage =
      outcome.baseDamage === 0
        ? 0
        : outcome.baseDamage * (context.doubleDamageActive ? 2 : 1);
    const playerHpAfter =
      outcome.damageTarget === "player"
        ? context.playerHp - finalDamage
        : context.playerHp;
    const computerHpAfter =
      outcome.damageTarget === "computer"
        ? context.computerHp - finalDamage
        : context.computerHp;
    const matchWinner =
      playerHpAfter <= 0
        ? "computer"
        : computerHpAfter <= 0
          ? "player"
          : "none";
    const matchEnd = matchWinner !== "none";
    const drawCountAfterRound = outcome.drawIncrement ? context.drawStreak + 1 : 0;
    const nextRoundDoubleDamage =
      outcome.zeroZeroTriggered ||
      drawCountAfterRound >= 3 ||
      context.round + 1 >= 16;

    return {
      round: context.round,
      playerChoice: context.playerChoice,
      computerChoice: context.computerChoice,
      resultType: outcome.resultType,
      winner: outcome.winner,
      loser: outcome.loser,
      damageTarget: outcome.damageTarget,
      baseDamage: outcome.baseDamage,
      finalDamage,
      multiplierApplied:
        outcome.baseDamage === 0 ? 1 : context.doubleDamageActive ? 2 : 1,
      instantFinish: false,
      matchEnd,
      matchWinner,
      endReason:
        matchWinner === "computer"
          ? "hp_zero_player"
          : matchWinner === "player"
            ? "hp_zero_computer"
            : "none",
      drawCountAfterRound,
      nextRoundDoubleDamage,
      logKey: outcome.logKey,
    };
  }

  const outcome = resolveChoiceBattle({
    playerChoice: context.playerChoice,
    computerChoice: context.computerChoice,
  });

  const multiplierApplied =
    outcome.baseDamage === 0 || outcome.instantFinish
      ? 1
      : context.doubleDamageActive
        ? 2
        : 1;
  const finalDamage = outcome.baseDamage * multiplierApplied;
  const playerHpAfter =
    outcome.damageTarget === "player"
      ? context.playerHp - finalDamage
      : context.playerHp;
  const computerHpAfter =
    outcome.damageTarget === "computer"
      ? context.computerHp - finalDamage
      : context.computerHp;
  const hpMatchWinner =
    playerHpAfter <= 0
      ? "computer"
      : computerHpAfter <= 0
        ? "player"
        : "none";
  const matchWinner = outcome.instantFinish ? outcome.matchWinner : hpMatchWinner;
  const matchEnd = outcome.instantFinish || matchWinner !== "none";

  return {
    round: context.round,
    playerChoice: context.playerChoice,
    computerChoice: context.computerChoice,
    resultType: outcome.resultType,
    winner: outcome.winner,
    loser: outcome.loser,
    damageTarget: outcome.damageTarget,
    baseDamage: outcome.baseDamage,
    finalDamage,
    multiplierApplied,
    instantFinish: outcome.instantFinish,
    matchEnd,
    matchWinner,
    endReason:
      outcome.instantFinish
        ? outcome.endReason
        : matchWinner === "computer"
          ? "hp_zero_player"
          : matchWinner === "player"
            ? "hp_zero_computer"
            : "none",
    drawCountAfterRound: 0,
    nextRoundDoubleDamage: context.round + 1 >= 16,
    logKey: outcome.logKey,
  };
}

