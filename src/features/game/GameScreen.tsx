import type { GameState } from "./types/game";
import type { Choice } from "./types/round";
import { PLAYER_CHOICES } from "./utils/constants";
import { formatRoundLog } from "./utils/logMessages";

type GameScreenProps = {
  state: GameState;
  onSelectChoice: (choice: Choice) => void;
  onRestart: () => void;
};

export function GameScreen({
  state,
  onRestart,
  onSelectChoice,
}: GameScreenProps) {
  return (
    <main className="shell">
      <section className="panel gameBoard">
        <header className="gameHeader">
          <div>
            <p className="eyebrow">Round {state.round}</p>
            <h1>대전 화면</h1>
          </div>
          <button className="secondaryButton" onClick={onRestart} type="button">
            처음으로
          </button>
        </header>

        <section className="statusGrid">
          <article className="statusCard">
            <span>플레이어 체력</span>
            <strong>{state.playerHp}</strong>
          </article>
          <article className="statusCard">
            <span>컴퓨터 체력</span>
            <strong>{state.computerHp}</strong>
          </article>
          <article className="statusCard">
            <span>현재 배율</span>
            <strong>{state.doubleDamageActive ? "2x" : "1x"}</strong>
          </article>
          <article className="statusCard">
            <span>타이머</span>
            <strong>다음 단계 구현</strong>
          </article>
        </section>

        <section className="choiceSection">
          <p className="sectionLabel">카드를 선택하세요</p>
          <div className="choiceGrid">
            {PLAYER_CHOICES.map((choice) => (
              <button
                key={choice}
                className="choiceButton"
                onClick={() => onSelectChoice(choice)}
                type="button"
              >
                {choice}
              </button>
            ))}
          </div>
        </section>

        <section className="logPanel">
          <p className="sectionLabel">최근 결과</p>
          {state.latestRoundResult ? (
            <div className="latestResult">
              <span>
                플레이어: {String(state.latestRoundResult.playerChoice)} / 컴퓨터:{" "}
                {String(state.latestRoundResult.computerChoice)}
              </span>
              <strong>{formatRoundLog(state.latestRoundResult)}</strong>
            </div>
          ) : (
            <p className="muted">아직 진행된 라운드가 없습니다.</p>
          )}

          <ul className="logList">
            {state.roundLogs.map((log) => (
              <li key={`${log.round}-${log.resultType}-${log.logKey}`}>
                {formatRoundLog(log)}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}

