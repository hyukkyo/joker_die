type StartScreenProps = {
  onStart: () => void;
};

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="shell">
      <section className="panel hero">
        <p className="eyebrow">사람 vs 컴퓨터 MVP</p>
        <h1>조커를 내고 지는 게임</h1>
        <p className="muted">
          첫 단계 구현입니다. 전투 엔진과 기본 라운드 흐름을 먼저 연결했습니다.
        </p>
        <button className="primaryButton" onClick={onStart} type="button">
          게임 시작
        </button>
      </section>
    </main>
  );
}

