import { describe, expect, it } from "vitest";
import { resolveRound } from "../../features/game/engine/resolveRound";

describe("resolveRound", () => {
  it("difference greater than 1 damages the smaller number", () => {
    const result = resolveRound({
      round: 1,
      playerHp: 21,
      computerHp: 21,
      playerChoice: 2,
      computerChoice: 5,
      drawStreak: 0,
      doubleDamageActive: false,
    });

    expect(result.damageTarget).toBe("player");
    expect(result.finalDamage).toBe(3);
    expect(result.matchEnd).toBe(false);
  });

  it("difference 1 damages the larger number by the sum", () => {
    const result = resolveRound({
      round: 1,
      playerHp: 21,
      computerHp: 21,
      playerChoice: 4,
      computerChoice: 5,
      drawStreak: 0,
      doubleDamageActive: false,
    });

    expect(result.damageTarget).toBe("computer");
    expect(result.finalDamage).toBe(9);
  });

  it("0 beats Joker with instant finish", () => {
    const result = resolveRound({
      round: 1,
      playerHp: 21,
      computerHp: 21,
      playerChoice: 0,
      computerChoice: "Joker",
      drawStreak: 0,
      doubleDamageActive: false,
    });

    expect(result.instantFinish).toBe(true);
    expect(result.matchWinner).toBe("player");
    expect(result.endReason).toBe("instant_finish_zero_beats_joker");
  });

  it("0 vs 0 activates next round double damage", () => {
    const result = resolveRound({
      round: 4,
      playerHp: 21,
      computerHp: 21,
      playerChoice: 0,
      computerChoice: 0,
      drawStreak: 0,
      doubleDamageActive: false,
    });

    expect(result.resultType).toBe("same_number_draw");
    expect(result.nextRoundDoubleDamage).toBe(true);
  });

  it("third draw activates next round double damage", () => {
    const result = resolveRound({
      round: 3,
      playerHp: 21,
      computerHp: 21,
      playerChoice: 2,
      computerChoice: 2,
      drawStreak: 2,
      doubleDamageActive: false,
    });

    expect(result.drawCountAfterRound).toBe(3);
    expect(result.nextRoundDoubleDamage).toBe(true);
  });
});
