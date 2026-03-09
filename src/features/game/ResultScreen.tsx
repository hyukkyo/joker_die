import type { GameState } from "./types/game";
import { formatEndReason } from "./utils/logMessages";

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
        <p className="muted">{formatEndReason(state.endReason)}</p>
        <div className="resultGrid">
          <article className="heroRuleCard">
            <span>최종 체력</span>
            <strong>{state.playerHp}</strong>
            <p>플레이어</p>
          </article>
          <article className="heroRuleCard">
            <span>최종 체력</span>
            <strong>{state.computerHp}</strong>
            <p>컴퓨터</p>
          </article>
          <article className="heroRuleCard">
            <span>진행 라운드</span>
            <strong>{state.round}</strong>
            <p>종료 시점 라운드</p>
          </article>
        </div>
        {state.latestRoundResult ? (
          <div className="resultSummary">
            <span>마지막 라운드</span>
            <strong>
              플레이어 {state.latestRoundResult.playerChoice ?? "-"} / 컴퓨터{" "}
              {state.latestRoundResult.computerChoice ?? "-"}
            </strong>
          </div>
        ) : null}
        <button className="primaryButton" onClick={onRestart} type="button">
          다시 시작
        </button>
      </section>
    </main>
  );
}
