import type { EndReason, RoundResult } from "../types/round";

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

export function describeRoundResult(result: RoundResult): string {
  switch (result.resultType) {
    case "number_battle":
      if (result.playerChoice === null || result.computerChoice === null) {
        return "정상 카드 대결 정보가 없습니다.";
      }

      if (result.instantFinish) {
        return "즉시 종료 라운드입니다.";
      }

      if (
        typeof result.playerChoice === "number" &&
        typeof result.computerChoice === "number"
      ) {
        const diff = Math.abs(result.playerChoice - result.computerChoice);
        if (diff === 1) {
          return `차이가 1이라 큰 수를 낸 쪽이 두 수의 합 ${result.baseDamage} 피해를 받았습니다.`;
        }

        if (result.playerChoice === 0 || result.computerChoice === 0) {
          return `0은 숫자 카드에게 지므로 0을 낸 쪽이 ${result.baseDamage} 피해를 받았습니다.`;
        }

        return `차이가 ${diff}라 작은 수를 낸 쪽이 ${result.baseDamage} 피해를 받았습니다.`;
      }

      return `${result.baseDamage} 피해가 적용된 숫자 대결입니다.`;
    case "joker_vs_number":
      return `Joker와 숫자가 만나 숫자를 낸 쪽이 자신의 숫자만큼 ${result.baseDamage} 피해를 받았습니다.`;
    case "zero_vs_joker_instant_finish":
      return "0이 Joker를 만나 체력 계산 없이 즉시 승리했습니다.";
    case "same_number_draw":
      return "같은 카드를 내 무승부 처리되었습니다.";
    case "zero_zero_hp_penalty":
      return "0과 0이 만나 현재 체력이 더 많은 쪽이 7 피해를 받았습니다.";
    case "joker_joker_hp_penalty":
      return "Joker와 Joker가 만나 현재 체력이 더 적은 쪽이 7 피해를 받았습니다.";
    case "timeout_penalty":
      return "제한 시간 30초를 넘겨 플레이어가 5 피해를 받았습니다.";
  }
}

export function describeMultiplier(result: RoundResult): string {
  if (result.instantFinish) {
    return "즉시 승리 라운드라 피해 배율은 적용되지 않았습니다.";
  }

  if (result.finalDamage === 0) {
    return result.nextRoundDoubleDamage
      ? "이번 라운드는 피해가 없었지만, 다음 라운드에는 2배 피해가 활성화됩니다."
      : "이번 라운드는 피해가 없었고 배율 변화도 없습니다.";
  }

  if (result.multiplierApplied === 2) {
    return `이번 라운드는 2배 피해가 적용되어 최종 피해가 ${result.finalDamage}가 되었습니다.`;
  }

  return result.nextRoundDoubleDamage
    ? "이번 라운드 피해는 1배로 처리되었고, 다음 라운드부터 2배 피해가 적용됩니다."
    : "이번 라운드는 기본 배율 1배로 처리되었습니다.";
}

export function formatEndReason(endReason: EndReason): string {
  switch (endReason) {
    case "hp_zero_player":
      return "플레이어 체력이 0 이하가 되어 패배했습니다.";
    case "hp_zero_computer":
      return "컴퓨터 체력이 0 이하가 되어 승리했습니다.";
    case "instant_finish_zero_beats_joker":
      return "0이 Joker를 잡아 즉시 승리 규칙이 발동했습니다.";
    case "manual_restart":
      return "수동 재시작으로 게임이 종료되었습니다.";
    case "none":
      return "진행 중";
  }
}
