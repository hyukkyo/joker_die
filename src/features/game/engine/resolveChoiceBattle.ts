import type { Choice, RoundResultType, Side, Winner } from "../types/round";

type ChoiceBattleOutcome = {
  resultType: RoundResultType;
  winner: Winner;
  loser: Side | "none";
  damageTarget: Side | "none";
  baseDamage: number;
  instantFinish: boolean;
  matchWinner: Side | "none";
  endReason: "instant_finish_zero_beats_joker" | "none";
  logKey:
    | "round.playerDamaged"
    | "round.computerDamaged"
    | "round.instantFinish";
};

function numericValue(choice: Exclude<Choice, "Joker">): number {
  return choice;
}

export function resolveChoiceBattle(params: {
  playerChoice: Choice;
  computerChoice: Choice;
}): ChoiceBattleOutcome {
  const { playerChoice, computerChoice } = params;

  if (
    (playerChoice === 0 && computerChoice === "Joker") ||
    (playerChoice === "Joker" && computerChoice === 0)
  ) {
    const matchWinner = playerChoice === 0 ? "player" : "computer";
    return {
      resultType: "zero_vs_joker_instant_finish",
      winner: matchWinner,
      loser: matchWinner === "player" ? "computer" : "player",
      damageTarget: "none",
      baseDamage: 0,
      instantFinish: true,
      matchWinner,
      endReason: "instant_finish_zero_beats_joker",
      logKey: "round.instantFinish",
    };
  }

  if (playerChoice === 0 || computerChoice === 0) {
    const damageTarget = playerChoice === 0 ? "player" : "computer";
    const otherChoice = damageTarget === "player" ? computerChoice : playerChoice;
    return {
      resultType: "number_battle",
      winner: damageTarget === "player" ? "computer" : "player",
      loser: damageTarget,
      damageTarget,
      baseDamage: numericValue(otherChoice as Exclude<Choice, "Joker">),
      instantFinish: false,
      matchWinner: "none",
      endReason: "none",
      logKey:
        damageTarget === "player"
          ? "round.playerDamaged"
          : "round.computerDamaged",
    };
  }

  if (playerChoice === "Joker" || computerChoice === "Joker") {
    const damageTarget = playerChoice === "Joker" ? "computer" : "player";
    const numberChoice =
      damageTarget === "player" ? playerChoice : computerChoice;
    return {
      resultType: "joker_vs_number",
      winner: damageTarget === "player" ? "computer" : "player",
      loser: damageTarget,
      damageTarget,
      baseDamage: numericValue(numberChoice as Exclude<Choice, "Joker">),
      instantFinish: false,
      matchWinner: "none",
      endReason: "none",
      logKey:
        damageTarget === "player"
          ? "round.playerDamaged"
          : "round.computerDamaged",
    };
  }

  const playerNumber = numericValue(playerChoice);
  const computerNumber = numericValue(computerChoice);
  const diff = Math.abs(playerNumber - computerNumber);

  if (diff === 1) {
    const damageTarget = playerNumber > computerNumber ? "player" : "computer";
    return {
      resultType: "number_battle",
      winner: damageTarget === "player" ? "computer" : "player",
      loser: damageTarget,
      damageTarget,
      baseDamage: playerNumber + computerNumber,
      instantFinish: false,
      matchWinner: "none",
      endReason: "none",
      logKey:
        damageTarget === "player"
          ? "round.playerDamaged"
          : "round.computerDamaged",
    };
  }

  const damageTarget = playerNumber < computerNumber ? "player" : "computer";
  return {
    resultType: "number_battle",
    winner: damageTarget === "player" ? "computer" : "player",
    loser: damageTarget,
    damageTarget,
    baseDamage: diff,
    instantFinish: false,
    matchWinner: "none",
    endReason: "none",
    logKey:
      damageTarget === "player"
        ? "round.playerDamaged"
        : "round.computerDamaged",
  };
}

