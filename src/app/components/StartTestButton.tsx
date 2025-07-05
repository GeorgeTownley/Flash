"use client";

interface StartTestButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function StartTestButton({
  onClick,
  disabled = false,
}: StartTestButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full p-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: "var(--color-flash-accent)" }}
    >
      Test!
    </button>
  );
}
