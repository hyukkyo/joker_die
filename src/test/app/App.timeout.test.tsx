import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../../app/App";

describe("App timeout flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("applies timeout damage after 30 seconds", async () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "게임 시작" }));
    expect(screen.getByText("30초")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(30000);
    });

    expect(
      screen.getAllByText("라운드 1: 시간 초과로 플레이어가 5 피해를 받았습니다."),
    ).toHaveLength(2);
    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getByText("Round 2")).toBeInTheDocument();
  });
});
