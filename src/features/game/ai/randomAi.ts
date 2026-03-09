import type { Choice } from "../types/round";
import { PLAYER_CHOICES } from "../utils/constants";

export function randomAi(): Choice {
  const index = Math.floor(Math.random() * PLAYER_CHOICES.length);
  return PLAYER_CHOICES[index];
}

