"use client";

interface AddCardButtonProps {
  onClick: () => void;
}

export default function AddCardButton({ onClick }: AddCardButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
      style={{ backgroundColor: "var(--color-flash-primary)" }}
    >
      + Add Card
    </button>
  );
}
