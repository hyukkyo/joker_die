import type { GameState } from "./types/game";

type ResultScreenProps = {
  state: GameState;
  onRestart: () => void;
};

function titleForWinner(state: GameState) {
  if (state.winner === "player") {
    return "플레이어 승리";
  }

  if (state.winner === "computer") {
    return "컴퓨터 승리";
  }

  return "게임 종료";
}

export function ResultScreen({ state, onRestart }: ResultScreenProps) {
  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">결과 화면</p>
        <h1>{titleForWinner(state)}</h1>
        <p className="muted">종료 사유: {state.endReason}</p>
        <p className="muted">
          플레이어 {state.playerHp} / 컴퓨터 {state.computerHp}
        </p>
        <button className="primaryButton" onClick={onRestart} type="button">
          다시 시작
        </button>
      </section>
    </main>
  );
}

