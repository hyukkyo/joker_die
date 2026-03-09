import type { GameState } from "./types/game";
import {
  describeMultiplier,
  describeRoundResult,
  formatRoundLog,
} from "./utils/logMessages";

type BattleTableProps = {
  state: GameState;
  timer: {
    remainingTime: number;
    isDanger: boolean;
  };
};

function impactLabel(state: GameState) {
  if (!state.latestRoundResult) {
    return null;
  }

  if (state.latestRoundResult.instantFinish) {
    return "즉시 승리 규칙 발동";
  }

  if (state.latestRoundResult.nextRoundDoubleDamage) {
    return "다음 라운드 2배 피해 활성";
  }

  return null;
}

export function BattleTable({ state, timer }: BattleTableProps) {
  const latestImpactLabel = impactLabel(state);
  const isChoiceRevealPhase =
    !state.isComputerThinking &&
    !state.isRoundResultVisible &&
    state.playerChoice !== null &&
    state.computerChoice !== null;
  const opponentCard = state.isComputerThinking
    ? "..."
    : state.isRoundResultVisible && state.latestRoundResult
      ? state.latestRoundResult.computerChoice ?? "-"
      : isChoiceRevealPhase
        ? state.computerChoice ?? "-"
        : "-";
  const playerCard = state.isRoundResultVisible && state.latestRoundResult
    ? state.latestRoundResult.playerChoice ?? "-"
    : state.playerChoice ?? "-";

  return (
    <section className="battleTable">
      <div className="tableSurface">
        <header className="tableTopBar">
          <div>
            <p className="eyebrow">Round {state.round}</p>
          </div>
          <div className="tableStatusPills">
            <span className="statusBadge">
              {state.doubleDamageActive ? "다음 피해 2x 준비" : "기본 배율"}
            </span>
            <span className="statusBadge">
              {state.drawStreak > 0
                ? `연속 무승부 ${state.drawStreak}`
                : "무승부 누적 없음"}
            </span>
            <span className={`statusBadge${timer.isDanger ? " dangerBadge" : ""}`}>
              타이머 {timer.remainingTime}초
            </span>
          </div>
        </header>

        <div className="tableArena">
          <article className="revealStage">
            <span>상대 공개 카드</span>
            <strong>{opponentCard}</strong>
          </article>

          <article className="revealStage playerStage">
            <span>플레이어 공개 카드</span>
            <strong>{playerCard}</strong>
          </article>
        </div>
      </div>
      {state.isRoundResultVisible && state.latestRoundResult ? (
        <div className="resultModalBackdrop">
          <section className="resultModal">
            <p className="sectionLabel">라운드 결과</p>
            <span>
              플레이어: {state.latestRoundResult.playerChoice ?? "-"} / 컴퓨터:{" "}
              {state.latestRoundResult.computerChoice ?? "-"}
            </span>
            <strong>{formatRoundLog(state.latestRoundResult)}</strong>
            <p className="detailCopy">{describeRoundResult(state.latestRoundResult)}</p>
            <p className="detailCopy">{describeMultiplier(state.latestRoundResult)}</p>
            {latestImpactLabel ? (
              <span className="impactBanner">{latestImpactLabel}</span>
            ) : null}
          </section>
        </div>
      ) : null}
    </section>
  );
}
