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

    expect(screen.getByText("컴퓨터가 선택 중입니다...")).toBeInTheDocument();
    expect(screen.getByText("플레이어 선택")).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700);
    });

    expect(screen.queryByText("컴퓨터가 선택 중입니다...")).not.toBeInTheDocument();
    expect(screen.getAllByText("라운드 1: 컴퓨터가 2 피해를 받았습니다.")).toHaveLength(2);
    expect(screen.getByText("Round 2")).toBeInTheDocument();
  });
});
