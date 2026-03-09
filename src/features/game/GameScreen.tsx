import type { GameState } from "./types/game";
import type { Choice } from "./types/round";
import { PLAYER_CHOICES } from "./utils/constants";
import { BattleTable } from "./BattleTable";
import { ChoiceCardButton } from "./ChoiceCardButton";
import { OpponentProfilePanel } from "./OpponentProfilePanel";

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
        <OpponentProfilePanel
          hp={state.computerHp}
          isThinking={state.isComputerThinking}
          lastChoice={String(
            state.isComputerThinking ? "..." : state.computerChoice ?? "-",
          )}
        />

        <BattleTable state={state} timer={timer} />

        <section className="playerHandSection">
          <div className="playerHandHeader">
            <div className="playerTitleRow">
              <p className="eyebrow">Player</p>
              <h2>플레이어</h2>
            </div>
            <div className="playerStatusChips">
              <span className="statusBadge">체력 {state.playerHp}</span>
              <span className="statusBadge">
                {state.isComputerThinking
                  ? "컴퓨터가 선택 중입니다..."
                  : state.isRoundResultVisible
                    ? "결과를 확인하세요"
                  : state.isChoiceLocked
                    ? "현재 라운드를 정리 중입니다."
                    : timer.isDanger
                    ? "5초 이하입니다. 선택을 서두르세요."
                      : "카드를 선택하세요"}
              </span>
            </div>
          </div>

          <div className="cardHandFan">
            {PLAYER_CHOICES.map((choice) => (
              <ChoiceCardButton
                key={choice}
                choice={choice}
                disabled={state.isChoiceLocked}
                isSelected={
                  (state.isComputerThinking || state.isRoundResultVisible) &&
                  state.playerChoice === choice
                }
                onSelect={onSelectChoice}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
