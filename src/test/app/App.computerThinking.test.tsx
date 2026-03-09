import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../../app/App";

describe("App computer thinking flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("shows computer thinking before revealing the result", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);

    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "게임 시작" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));

    expect(screen.getAllByText("컴퓨터가 선택 중입니다...").length).toBeGreaterThan(0);
    expect(screen.getByText("플레이어 공개 카드")).toBeInTheDocument();
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(screen.queryAllByText("컴퓨터가 선택 중입니다...")).toHaveLength(0);
    expect(screen.getAllByText("라운드 1: 컴퓨터가 2 피해를 받았습니다.")).toHaveLength(1);
    expect(screen.getAllByText("Round 2").length).toBeGreaterThan(0);
  });
});
