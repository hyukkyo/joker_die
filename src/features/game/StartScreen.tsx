type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">사람 vs 컴퓨터 MVP</p>
        <h1>조커를 내고 지는 게임</h1>
        {/* <p className="muted">
          숫자, 0, Joker 규칙이 섞인 심리전 카드 게임입니다. 지금 버전은 싱글 플레이
          MVP로, 전투 엔진과 타이머, 컴퓨터 AI까지 연결되어 있습니다.
        </p> */}
        <div className="heroGrid">
          <article className="heroRuleCard">
            <span>기본 체력</span>
            <strong>21 vs 21</strong>
            <p>플레이어와 컴퓨터가 같은 조건으로 시작합니다.</p>
          </article>
          <article className="heroRuleCard">
            <span>선택 제한</span>
            <strong>30초</strong>
            <p>시간 초과 시 플레이어가 5 피해를 받습니다.</p>
          </article>
          <article className="heroRuleCard">
            <span>핵심 특수 규칙</span>
            <strong>0 vs Joker</strong>
            <p>0이 Joker를 만나면 체력 계산 없이 즉시 승리합니다.</p>
          </article>
        </div>
        <div className="ruleStrip">
          <span>선택지: 0, 2, 3, 4, 5, Joker</span>
          <span>무승부 3연속 또는 16라운드부터 2배 피해</span>
        </div>
        <button className="primaryButton" onClick={onStart} type="button">
          게임 시작
        </button>
      </section>
    </main>
  );
}
