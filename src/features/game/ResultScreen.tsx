import type { GameState } from "./types/game";
import {
  describeMultiplier,
  describeRoundResult,
  formatEndReason,
  formatRoundLog,
} from "./utils/logMessages";

type ResultScreenProps = {
  state: GameState;
  onRestart: () => void;
  record: {
    wins: number;
    losses: number;
  };
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

export function ResultScreen({ state, onRestart, record }: ResultScreenProps) {
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
            <span>진행 라운드</span>
            <strong>{state.round}</strong>
            <p>종료 시점 라운드</p>
          </article>
          <article className="heroRuleCard">
            <span>최종 체력</span>
            <strong>{state.computerHp}</strong>
            <p>컴퓨터</p>
          </article>
        </div>
        <div className="resultSummary">
          <span>
            현재 전적 {record.wins}승 {record.losses}패
          </span>
          {/* {state.latestRoundResult ? (
            <>
              <span>마지막 라운드</span>
              <strong>
                플레이어 {state.latestRoundResult.playerChoice ?? "-"} / 컴퓨터{" "}
                {state.latestRoundResult.computerChoice ?? "-"}
              </strong>
            </>
          ) : null} */}
        </div>
        {state.roundLogs.length > 0 ? (
          <section className="resultLogPanel">
            <p className="sectionLabel">전체 라운드 로그</p>
            <ol className="logList resultLogList">
              {state.roundLogs.map((result) => (
                <li key={`${result.round}-${result.logKey}`}>
                  <strong>{formatRoundLog(result)}</strong>
                  <span>{describeRoundResult(result)}</span>
                  <span>{describeMultiplier(result)}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
        <button className="primaryButton" onClick={onRestart} type="button">
          다시 시작
        </button>
      </section>
    </main>
  );
}
