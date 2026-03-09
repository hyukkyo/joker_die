import type { RoundResult } from "../types/round";

export function formatRoundLog(result: RoundResult): string {
  switch (result.logKey) {
    case "round.draw":
      return `라운드 ${result.round}: 무승부입니다.`;
    case "round.playerDamaged":
      return `라운드 ${result.round}: 플레이어가 ${result.finalDamage} 피해를 받았습니다.`;
    case "round.computerDamaged":
      return `라운드 ${result.round}: 컴퓨터가 ${result.finalDamage} 피해를 받았습니다.`;
    case "round.timeout":
      return `라운드 ${result.round}: 시간 초과로 플레이어가 ${result.finalDamage} 피해를 받았습니다.`;
    case "round.instantFinish":
      return `라운드 ${result.round}: 0이 Joker를 잡아 즉시 승리했습니다.`;
  }
}

