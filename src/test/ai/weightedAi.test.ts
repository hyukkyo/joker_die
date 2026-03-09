import { describe, expect, it, vi, afterEach } from "vitest";
import { weightedAi } from "../../features/game/ai/weightedAi";
import { createInitialGameState } from "../../features/game/state/initialGameState";

describe("weightedAi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("strongly prefers 0 against Joker", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const choice = weightedAi({
      state: createInitialGameState(),
      playerChoice: "Joker",
    });

    expect(choice).toBe(0);
  });
});
