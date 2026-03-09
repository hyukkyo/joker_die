import { GameScreen } from "../features/game/GameScreen";
import { ResultScreen } from "../features/game/ResultScreen";
import { StartScreen } from "../features/game/StartScreen";
import { useGameController } from "../features/game/hooks/useGameController";

export function App() {
  const controller = useGameController();

  if (controller.state.phase === "start") {
    return <StartScreen onStart={controller.startGame} />;
  }

  if (controller.state.phase === "result") {
    return (
      <ResultScreen
        state={controller.state}
        onRestart={controller.restartGame}
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
