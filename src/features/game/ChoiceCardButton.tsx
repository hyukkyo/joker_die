import type { Choice } from "./types/round";

type ChoiceCardButtonProps = {
  choice: Choice;
  disabled: boolean;
  isSelected: boolean;
  onSelect: (choice: Choice) => void;
};

export function ChoiceCardButton({
  choice,
  disabled,
  isSelected,
  onSelect,
}: ChoiceCardButtonProps) {
  const isJoker = choice === "Joker";

  return (
    <button
      aria-label={String(choice)}
      className={`choiceCardButton${isJoker ? " jokerCard" : ""}${
        isSelected ? " selectedCard" : ""
      }`}
      disabled={disabled}
      onClick={() => onSelect(choice)}
      type="button"
    >
      <span className="cardCorner top">{isJoker ? "J" : choice}</span>
      <span className="cardValue">{isJoker ? "JOKER" : choice}</span>
      <span className="cardCorner bottom">{isJoker ? "J" : choice}</span>
    </button>
  );
}
