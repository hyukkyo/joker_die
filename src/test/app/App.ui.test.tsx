import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../../app/App";

describe("App UI copy", () => {
  it("shows start screen rule summary", () => {
    render(<App />);

    expect(screen.getByText("기본 체력")).toBeInTheDocument();
    expect(screen.getByText("선택 제한")).toBeInTheDocument();
    expect(screen.getByText("핵심 특수 규칙")).toBeInTheDocument();
  });

  it("shows expanded result explanation after a finished game", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "게임 시작" }));
    expect(screen.getByText("활성 상태")).toBeInTheDocument();
    expect(screen.getByText("현재 라운드 안내")).toBeInTheDocument();
  });
});
