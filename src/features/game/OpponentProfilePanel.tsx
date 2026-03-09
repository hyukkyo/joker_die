type OpponentProfilePanelProps = {
  hp: number;
  isThinking: boolean;
  lastChoice: string;
};

export function OpponentProfilePanel({
  hp,
  isThinking,
  lastChoice,
}: OpponentProfilePanelProps) {
  return (
    <section className="opponentPanel">
      <div className="opponentPortraitWrap">
        <img
          alt="컴퓨터 프로필"
          className="opponentPortrait"
          src="/images/ai.jpg"
        />
      </div>
      <div className="opponentInfo">
        <div className="opponentTitleRow">
          <p className="eyebrow">Opponent</p>
          <h2>컴퓨터</h2>
        </div>
      </div>
      <div className="opponentMeta opponentMetaSide">
        <span className="statusBadge">체력 {hp}</span>
        <span className="statusBadge">
          {isThinking ? "선택 중..." : "대기 중"}
        </span>
        {/* <span className="statusBadge">상단 카드 {lastChoice}</span> */}
      </div>
    </section>
  );
}
