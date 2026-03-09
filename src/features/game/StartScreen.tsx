type StartScreenProps = {
  onStart: () => void;
  record: {
    wins: number;
    losses: number;
  };
};

export function StartScreen({ onStart, record }: StartScreenProps) {
  return (
    <main className="shell">
      <section className="panel hero">
        {/* <p className="eyebrow">사람 vs 컴퓨터 MVP</p> */}
        <h1>JOKER DIE</h1>
        <div className="resultSummary">
          <span>현재 전적 {record.wins}승 {record.losses}패</span>
        </div>
        {/* <p className="muted">
          숫자, 0, Joker 규칙이 섞인 심리전 카드 게임입니다. 지금 버전은 싱글 플레이
          MVP로, 전투 엔진과 타이머, 컴퓨터 AI까지 연결되어 있습니다.
        </p> */}
        <div className="heroGrid">
          <article className="heroRuleCard">
            <span>규칙 1</span>
            <strong>2 vs 5</strong>
            <p>숫자가 더 큰 5가 승리합니다.</p>
          </article>
          <article className="heroRuleCard">
            <span>규칙 2</span>
            <strong>3 vs 4</strong>
            <p>차이가 1이라면 작은 쪽이 이깁니다.</p>
          </article>
          <article className="heroRuleCard">
            <span>규칙 3</span>
            <strong>5 vs 조커</strong>
            <p>조커는 모든 숫자를 이깁니다.</p>
          </article>
          <article className="heroRuleCard">
            <span>규칙 4</span>
            <strong>0 vs 0</strong>
            <p>0끼리 붙으면 체력이 적은 쪽이 승리합니다.</p>
          </article>
          <article className="heroRuleCard">
            <span>규칙 5</span>
            <strong>조커 vs 조커</strong>
            <p>조커끼리 붙으면 체력이 많은 쪽이 승리합니다.</p>
          </article>
          <article className="heroRuleCard">
            <span>규칙 6</span>
            <strong>0 vs 조커</strong>
            <p>조커는 0을 만나면 게임에서 패배합니다.</p>
          </article>
        </div>
        <div className="ruleStrip">
          {/* <span>선택지: 0, 2, 3, 4, 5, Joker</span> */}
          <span>무승부 3연속 또는 16라운드부터 피해량 2배</span>
        </div>
        <button className="primaryButton" onClick={onStart} type="button">
          게임 시작
        </button>
      </section>
    </main>
  );
}
