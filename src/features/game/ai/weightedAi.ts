import type { GameState } from "../types/game";
import type { Choice } from "../types/round";
import { PLAYER_CHOICES } from "../utils/constants";

type WeightedOption = {
  choice: Choice;
  weight: number;
};

type PlayerTendency = {
  sampleSize: number;
  jokerScore: number;
  zeroScore: number;
  lowNumberScore: number;
  highNumberScore: number;
  repeatedChoice: Choice | null;
  likelyChoice: Choice | null;
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

function analyzePlayerTendency(state: GameState): PlayerTendency {
  const recentPlayerChoices = state.roundLogs
    .slice(-5)
    .map((round) => round.playerChoice)
    .filter((choice): choice is Choice => choice !== null);

  if (recentPlayerChoices.length === 0) {
    return {
      sampleSize: 0,
      jokerScore: 0,
      zeroScore: 0,
      lowNumberScore: 0,
      highNumberScore: 0,
      repeatedChoice: null,
      likelyChoice: null,
    };
  }

  const weightedChoices = recentPlayerChoices.map((choice, index) => ({
    choice,
    weight: index + 1,
  }));

  let jokerScore = 0;
  let zeroScore = 0;
  let lowNumberScore = 0;
  let highNumberScore = 0;
  const choiceScores = new Map<Choice, number>();

  for (const entry of weightedChoices) {
    choiceScores.set(
      entry.choice,
      (choiceScores.get(entry.choice) ?? 0) + entry.weight,
    );

    if (entry.choice === "Joker") {
      jokerScore += entry.weight;
    } else if (entry.choice === 0) {
      zeroScore += entry.weight;
    } else if (entry.choice <= 3) {
      lowNumberScore += entry.weight;
    } else {
      highNumberScore += entry.weight;
    }
  }

  const lastChoice = recentPlayerChoices[recentPlayerChoices.length - 1];
  const previousChoice = recentPlayerChoices[recentPlayerChoices.length - 2];
  const repeatedChoice =
    previousChoice !== undefined && lastChoice === previousChoice
      ? lastChoice
      : null;

  let likelyChoice: Choice | null = null;
  let highestScore = 0;
  for (const [choice, score] of choiceScores) {
    if (score > highestScore) {
      likelyChoice = choice;
      highestScore = score;
    }
  }

  return {
    sampleSize: recentPlayerChoices.length,
    jokerScore,
    zeroScore,
    lowNumberScore,
    highNumberScore,
    repeatedChoice,
    likelyChoice,
  };
}

function applyPredictionWeights(
  option: WeightedOption,
  tendency: PlayerTendency,
  state: GameState,
) {
  if (tendency.sampleSize === 0) {
    return;
  }

  const confidenceBonus = tendency.sampleSize >= 4 ? 1.2 : 1;
  const jokerHeavy = tendency.jokerScore >= 5 * confidenceBonus;
  const zeroHeavy = tendency.zeroScore >= 5 * confidenceBonus;
  const highNumberHeavy =
    tendency.highNumberScore > tendency.lowNumberScore + 2 * confidenceBonus;
  const lowNumberHeavy =
    tendency.lowNumberScore > tendency.highNumberScore + 2 * confidenceBonus;

  if (jokerHeavy && option.choice === 0) {
    option.weight += 8;
  }

  if (zeroHeavy && option.choice === "Joker") {
    option.weight -= 7;
  }

  if (highNumberHeavy) {
    if (option.choice === 2 || option.choice === 3) {
      option.weight += 4;
    } else if (option.choice === 5) {
      option.weight -= 2;
    }
  } else if (lowNumberHeavy) {
    if (option.choice === 4 || option.choice === 5) {
      option.weight += 4;
    } else if (option.choice === 2) {
      option.weight -= 2;
    }
  }

  if (tendency.repeatedChoice === "Joker" && option.choice === 0) {
    option.weight += 10;
  } else if (tendency.repeatedChoice === 0 && option.choice === "Joker") {
    option.weight -= 8;
  } else if (tendency.repeatedChoice === 5 && option.choice === 3) {
    option.weight += 3;
  } else if (tendency.repeatedChoice === 4 && option.choice === 2) {
    option.weight += 3;
  } else if (tendency.repeatedChoice === 2 && option.choice === 4) {
    option.weight += 3;
  } else if (tendency.repeatedChoice === 3 && option.choice === 5) {
    option.weight += 3;
  }

  if (state.playerHp <= 7 && tendency.likelyChoice === "Joker" && option.choice === 0) {
    option.weight += 8;
  }

  if (state.computerHp <= 7 && tendency.likelyChoice === 0 && option.choice === "Joker") {
    option.weight -= 6;
  }
}

export function weightedAi(params: { state: GameState }): Choice {
  const { state } = params;
  const tendency = analyzePlayerTendency(state);

  const options: WeightedOption[] = PLAYER_CHOICES.map((choice) => ({
    choice,
    weight: 10,
  }));

  for (const option of options) {
    applyBaseWeights(option);
    applyHealthWeights(option, state);
    applyMultiplierWeights(option, state);
    applyDrawStreakWeights(option, state);
    applyPredictionWeights(option, tendency, state);
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
