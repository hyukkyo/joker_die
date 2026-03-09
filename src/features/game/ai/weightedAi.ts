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

function isNumberChoice(choice: Choice): choice is Exclude<Choice, "Joker"> {
  return typeof choice === "number";
}

function applyBaseWeights(option: WeightedOption) {
  if (option.choice === 0) {
    option.weight -= 3;
    return;
  }

  if (option.choice === "Joker") {
    option.weight -= 1;
    return;
  }

  if (option.choice === 3 || option.choice === 4) {
    option.weight += 3;
    return;
  }

  if (option.choice === 2 || option.choice === 5) {
    option.weight += 1;
  }
}

function applyHealthWeights(option: WeightedOption, state: GameState) {
  const hpGap = state.computerHp - state.playerHp;

  if (state.computerHp <= 7) {
    if (option.choice === 0) {
      option.weight -= 4;
    } else if (option.choice === "Joker") {
      option.weight -= 5;
    } else if (option.choice === 3 || option.choice === 4) {
      option.weight += 8;
    } else {
      option.weight += 3;
    }
  }

  if (state.playerHp <= 7) {
    if (option.choice === "Joker") {
      option.weight += 7;
    } else if (option.choice === 5) {
      option.weight += 6;
    } else if (option.choice === 4) {
      option.weight += 3;
    }
  }

  if (hpGap >= 6) {
    if (option.choice === "Joker") {
      option.weight -= 4;
    } else if (option.choice === 0) {
      option.weight -= 2;
    } else if (option.choice === 3 || option.choice === 4) {
      option.weight += 4;
    }
  } else if (hpGap <= -6) {
    if (option.choice === "Joker") {
      option.weight += 6;
    } else if (option.choice === 5) {
      option.weight += 4;
    } else if (option.choice === 0) {
      option.weight += 2;
    }
  }
}

function applyMultiplierWeights(option: WeightedOption, state: GameState) {
  if (!state.doubleDamageActive) {
    return;
  }

  if (state.computerHp <= state.playerHp) {
    if (option.choice === "Joker") {
      option.weight += 8;
    } else if (option.choice === 5) {
      option.weight += 5;
    } else if (option.choice === 4) {
      option.weight += 2;
    }
    return;
  }

  if (option.choice === "Joker") {
    option.weight -= 6;
  } else if (option.choice === 0) {
    option.weight -= 2;
  } else if (option.choice === 3 || option.choice === 4) {
    option.weight += 5;
  }
}

function applyDrawStreakWeights(option: WeightedOption, state: GameState) {
  if (state.drawStreak < 2) {
    return;
  }

  if (option.choice === "Joker") {
    option.weight += 4;
  } else if (option.choice === 5) {
    option.weight += 3;
  } else if (option.choice === 0) {
    option.weight += 1;
  }
}

function applyHistoryWeights(option: WeightedOption, state: GameState) {
  const recentPlayerChoices = state.roundLogs
    .slice(-5)
    .map((round) => round.playerChoice)
    .filter((choice): choice is Choice => choice !== null);

  if (recentPlayerChoices.length === 0) {
    return;
  }

  const jokerCount = recentPlayerChoices.filter(
    (choice) => choice === "Joker",
  ).length;
  const zeroCount = recentPlayerChoices.filter((choice) => choice === 0).length;
  const numbers = recentPlayerChoices.filter(isNumberChoice);
  const lowNumberCount = numbers.filter((choice) => choice <= 3).length;
  const highNumberCount = numbers.filter((choice) => choice >= 4).length;

  if (jokerCount >= 2 && option.choice === 0) {
    option.weight += 8;
  }

  if (zeroCount >= 2 && option.choice === "Joker") {
    option.weight -= 6;
  }

  if (highNumberCount > lowNumberCount) {
    if (option.choice === 2 || option.choice === 3) {
      option.weight += 4;
    } else if (option.choice === 5) {
      option.weight -= 2;
    }
  } else if (lowNumberCount > highNumberCount) {
    if (option.choice === 4 || option.choice === 5) {
      option.weight += 4;
    } else if (option.choice === 2) {
      option.weight -= 2;
    }
  }
}

export function weightedAi(params: { state: GameState }): Choice {
  const { state } = params;

  const options: WeightedOption[] = PLAYER_CHOICES.map((choice) => ({
    choice,
    weight: 10,
  }));

  for (const option of options) {
    applyBaseWeights(option);
    applyHealthWeights(option, state);
    applyMultiplierWeights(option, state);
    applyDrawStreakWeights(option, state);
    applyHistoryWeights(option, state);
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
