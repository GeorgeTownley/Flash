"use client";

interface AddCardButtonProps {
  onClick: () => void;
  "data-add-button"?: string;
}

export default function AddCardButton({
  onClick,
  "data-add-button": dataAddButton,
}: AddCardButtonProps) {
  return (
    <button
      onClick={onClick}
      data-add-button={dataAddButton}
      className="w-full p-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
      style={{ backgroundColor: "var(--color-flash-primary)" }}
    >
      + Add Card
    </button>
  );
}
