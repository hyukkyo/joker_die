import type { GameState } from "./types/game";
import type { Choice } from "./types/round";
import { PLAYER_CHOICES } from "./utils/constants";
import {
  describeMultiplier,
  describeRoundResult,
  formatRoundLog,
} from "./utils/logMessages";

type GameScreenProps = {
  state: GameState;
  timer: {
    remainingTime: number;
    isDanger: boolean;
  };
  onSelectChoice: (choice: Choice) => void;
  onRestart: () => void;
};

export function GameScreen({
  state,
  timer,
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
            <strong className={timer.isDanger ? "dangerText" : undefined}>
              {timer.remainingTime}초
            </strong>
          </article>
        </section>

        <section className="battleMetaGrid">
          <article className="metaCard">
            <span>활성 상태</span>
            <div className="badgeRow">
              <span className="statusBadge">{state.doubleDamageActive ? "다음 피해 2x 준비" : "기본 배율"}</span>
              <span className="statusBadge">{state.drawStreak > 0 ? `연속 무승부 ${state.drawStreak}` : "무승부 누적 없음"}</span>
              <span className="statusBadge">{state.isComputerThinking ? "컴퓨터 생각 중" : "입력 가능"}</span>
            </div>
          </article>
          <article className="metaCard">
            <span>현재 라운드 안내</span>
            <p className="metaCopy">
              {state.isComputerThinking
                ? "플레이어 선택이 제출되었습니다. 잠시 후 컴퓨터 선택과 결과가 공개됩니다."
                : timer.isDanger
                  ? "남은 시간이 거의 없습니다. 지금 선택하지 않으면 시간 초과 패널티를 받습니다."
                  : "라운드마다 카드 1장을 선택해 상대보다 먼저 체력을 0으로 만들면 됩니다."}
            </p>
          </article>
        </section>

        <section className="choiceSection">
          <p className="sectionLabel">카드를 선택하세요</p>
          <p className="muted">
            {state.isComputerThinking
              ? "컴퓨터가 선택 중입니다..."
              : state.isChoiceLocked
                ? "현재 라운드를 정리 중입니다."
              : timer.isDanger
                ? "5초 이하입니다. 선택을 서두르세요."
                : "30초 안에 한 장을 선택해야 합니다."}
          </p>
          {(state.playerChoice !== null || state.isComputerThinking) && (
            <div className="revealRow">
              <div className="revealCard">
                <span>플레이어 선택</span>
                <strong>{state.playerChoice ?? "-"}</strong>
              </div>
              <div className="revealCard">
                <span>컴퓨터 선택</span>
                <strong>{state.isComputerThinking ? "..." : state.computerChoice ?? "-"}</strong>
              </div>
            </div>
          )}
          <div className="choiceGrid">
            {PLAYER_CHOICES.map((choice) => (
              <button
                key={choice}
                className="choiceButton"
                disabled={state.isChoiceLocked}
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
                플레이어: {state.latestRoundResult.playerChoice ?? "-"} / 컴퓨터:{" "}
                {state.latestRoundResult.computerChoice ?? "-"}
              </span>
              <strong>{formatRoundLog(state.latestRoundResult)}</strong>
              <p className="detailCopy">
                {describeRoundResult(state.latestRoundResult)}
              </p>
              <p className="detailCopy">
                {describeMultiplier(state.latestRoundResult)}
              </p>
              {state.latestRoundResult.instantFinish ? (
                <span className="impactBanner">즉시 승리 규칙 발동</span>
              ) : state.latestRoundResult.nextRoundDoubleDamage ? (
                <span className="impactBanner">다음 라운드 2배 피해 활성</span>
              ) : null}
            </div>
          ) : (
            <p className="muted">아직 진행된 라운드가 없습니다.</p>
          )}

          <ul className="logList">
            {state.roundLogs.map((log) => (
              <li key={`${log.round}-${log.resultType}-${log.logKey}`}>
                <strong>{formatRoundLog(log)}</strong>
                <span>{describeRoundResult(log)}</span>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
