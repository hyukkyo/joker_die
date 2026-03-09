import { useEffect, useRef, useState } from "react";
import { GameScreen } from "../features/game/GameScreen";
import { ResultScreen } from "../features/game/ResultScreen";
import { StartScreen } from "../features/game/StartScreen";
import { useGameController } from "../features/game/hooks/useGameController";

const SESSION_RECORD_KEY = "joker-die-session-record";

type SessionRecord = {
  wins: number;
  losses: number;
};

function loadSessionRecord(): SessionRecord {
  if (typeof window === "undefined") {
    return { wins: 0, losses: 0 };
  }

  const saved = window.sessionStorage.getItem(SESSION_RECORD_KEY);
  if (!saved) {
    return { wins: 0, losses: 0 };
  }

  try {
    const parsed = JSON.parse(saved) as Partial<SessionRecord>;
    return {
      wins: typeof parsed.wins === "number" ? parsed.wins : 0,
      losses: typeof parsed.losses === "number" ? parsed.losses : 0,
    };
  } catch {
    return { wins: 0, losses: 0 };
  }
}

export function App() {
  const controller = useGameController();
  const [sessionRecord, setSessionRecord] = useState<SessionRecord>(() =>
    loadSessionRecord(),
  );
  const hasRecordedResultRef = useRef(false);

  useEffect(() => {
    if (controller.state.phase !== "result") {
      hasRecordedResultRef.current = false;
      return;
    }

    if (hasRecordedResultRef.current) {
      return;
    }

    hasRecordedResultRef.current = true;
    setSessionRecord((current) => {
      const next = { ...current };
      if (controller.state.winner === "player") {
        next.wins += 1;
      } else if (controller.state.winner === "computer") {
        next.losses += 1;
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(SESSION_RECORD_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, [controller.state.phase, controller.state.winner]);

  if (controller.state.phase === "start") {
    return <StartScreen onStart={controller.startGame} record={sessionRecord} />;
  }

  if (controller.state.phase === "result") {
    return (
      <ResultScreen
        state={controller.state}
        onRestart={controller.restartGame}
        record={sessionRecord}
      />
    );
  }

  return (
    <GameScreen
      state={controller.state}
      timer={controller.timer}
      onDismissRoundResult={controller.dismissRoundResult}
      onRestart={controller.restartGame}
      onSelectChoice={controller.playRound}
    />
  );
}
