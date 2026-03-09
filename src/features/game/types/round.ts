export const CHOICES = [0, 2, 3, 4, 5, "Joker"] as const;

export type Choice = (typeof CHOICES)[number];
export type Side = "player" | "computer";
export type Winner = Side | "draw" | "none";
export type DamageTarget = Side | "none";
export type RoundResultType =
  | "number_battle"
  | "joker_vs_number"
  | "zero_vs_joker_instant_finish"
  | "same_number_draw"
  | "zero_zero_hp_penalty"
  | "joker_joker_hp_penalty"
  | "timeout_penalty";
export type EndReason =
  | "hp_zero_player"
  | "hp_zero_computer"
  | "instant_finish_zero_beats_joker"
  | "manual_restart"
  | "none";

export type RoundResult = {
  round: number;
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  resultType: RoundResultType;
  winner: Winner;
  loser: Side | "none";
  damageTarget: DamageTarget;
  baseDamage: number;
  finalDamage: number;
  multiplierApplied: 1 | 2;
  instantFinish: boolean;
  matchEnd: boolean;
  matchWinner: Side | "none";
  endReason: EndReason;
  drawCountAfterRound: number;
  nextRoundDoubleDamage: boolean;
  logKey:
    | "round.draw"
    | "round.playerDamaged"
    | "round.computerDamaged"
    | "round.timeout"
    | "round.instantFinish";
};

export type RoundContext = {
  round: number;
  playerHp: number;
  computerHp: number;
  playerChoice: Choice | null;
  computerChoice: Choice | null;
  drawStreak: number;
  doubleDamageActive: boolean;
};

