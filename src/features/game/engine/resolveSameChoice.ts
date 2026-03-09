import { SPECIAL_TIE_DAMAGE } from "../utils/constants";
import type { Choice, RoundResultType, Side, Winner } from "../types/round";

type SameChoiceOutcome = {
  resultType: RoundResultType;
  winner: Winner;
  loser: Side | "none";
  damageTarget: Side | "none";
  baseDamage: number;
  logKey: "round.draw" | "round.playerDamaged" | "round.computerDamaged";
  drawIncrement: boolean;
  zeroZeroTriggered: boolean;
};

export function resolveSameChoice(params: {
  choice: Choice;
  playerHp: number;
  computerHp: number;
}): SameChoiceOutcome {
  const { choice, playerHp, computerHp } = params;

  if (choice === 0) {
    if (playerHp === computerHp) {
      return {
        resultType: "same_number_draw",
        winner: "draw",
        loser: "none",
        damageTarget: "none",
        baseDamage: 0,
        logKey: "round.draw",
        drawIncrement: true,
        zeroZeroTriggered: true,
      };
    }

    const damageTarget = playerHp > computerHp ? "player" : "computer";
    return {
      resultType: "zero_zero_hp_penalty",
      winner: damageTarget === "player" ? "computer" : "player",
      loser: damageTarget,
      damageTarget,
      baseDamage: SPECIAL_TIE_DAMAGE,
      logKey:
        damageTarget === "player"
          ? "round.playerDamaged"
          : "round.computerDamaged",
      drawIncrement: false,
      zeroZeroTriggered: true,
    };
  }

  if (choice === "Joker") {
    if (playerHp === computerHp) {
      return {
        resultType: "same_number_draw",
        winner: "draw",
        loser: "none",
        damageTarget: "none",
        baseDamage: 0,
        logKey: "round.draw",
        drawIncrement: true,
        zeroZeroTriggered: false,
      };
    }

    const damageTarget = playerHp < computerHp ? "player" : "computer";
    return {
      resultType: "joker_joker_hp_penalty",
      winner: damageTarget === "player" ? "computer" : "player",
      loser: damageTarget,
      damageTarget,
      baseDamage: SPECIAL_TIE_DAMAGE,
      logKey:
        damageTarget === "player"
          ? "round.playerDamaged"
          : "round.computerDamaged",
      drawIncrement: false,
      zeroZeroTriggered: false,
    };
  }

  return {
    resultType: "same_number_draw",
    winner: "draw",
    loser: "none",
    damageTarget: "none",
    baseDamage: 0,
    logKey: "round.draw",
    drawIncrement: true,
    zeroZeroTriggered: false,
  };
}

