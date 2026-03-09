import type { GameState } from "../types/game";
import type { Choice } from "../types/round";
import { PLAYER_CHOICES } from "../utils/constants";

type WeightedOption = {
  choice: Choice;
  weight: number;
};

function clampWeight(weight: number) {
  return Math.max(1, weight);
}

export function weightedAi(params: {
  state: GameState;
  playerChoice: Choice;
}): Choice {
  const { playerChoice, state } = params;

  const options: WeightedOption[] = PLAYER_CHOICES.map((choice) => ({
    choice,
    weight: 10,
  }));

  for (const option of options) {
    if (option.choice === 0) {
      option.weight -= 5;
    }

    if (playerChoice === "Joker" && option.choice === 0) {
      option.weight += 40;
    }

    if (playerChoice === 0 && option.choice === "Joker") {
      option.weight -= 8;
    }

    if (state.doubleDamageActive && option.choice === "Joker") {
      option.weight += 8;
    }

    if (
      state.playerHp <= 7 &&
      typeof playerChoice === "number" &&
      option.choice === playerChoice + 1
    ) {
      option.weight += 18;
    }

    if (
      state.computerHp <= 7 &&
      typeof playerChoice === "number" &&
      option.choice === playerChoice - 1
    ) {
      option.weight += 6;
    }

    if (
      typeof playerChoice === "number" &&
      typeof option.choice === "number" &&
      playerChoice !== 0 &&
      option.choice !== 0
    ) {
      if (Math.abs(playerChoice - option.choice) === 1) {
        option.weight += 10;
      }

      if (option.choice < playerChoice && playerChoice - option.choice > 1) {
        option.weight += 4;
      }
    }

    option.weight = clampWeight(option.weight);
  }

  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const option of options) {
    roll -= option.weight;
    if (roll <= 0) {
      return option.choice;
    }
  }

  return options[options.length - 1].choice;
}
