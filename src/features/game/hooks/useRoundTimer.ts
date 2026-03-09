import { useEffect, useEffectEvent } from "react";

type UseRoundTimerParams = {
  isActive: boolean;
  remainingTime: number;
  onTick: () => void;
};

export function useRoundTimer({
  isActive,
  remainingTime,
  onTick,
}: UseRoundTimerParams) {
  const handleTick = useEffectEvent(onTick);

  useEffect(() => {
    if (!isActive || remainingTime <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      handleTick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [handleTick, isActive, remainingTime]);

  return {
    isDanger: isActive && remainingTime <= 5,
    remainingTime,
  };
}
