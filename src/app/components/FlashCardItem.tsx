// components/FlashCardItem.tsx
"use client";

import { useState } from "react";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashCardItemProps {
  card: Flashcard;
  cardNumber: number;
  onUpdate: (field: "question" | "answer", value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function FlashCardItem({
  card,
  cardNumber,
  onUpdate,
  onDelete,
  canDelete,
}: FlashCardItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    if (isDeleting) return; // Prevent double clicks
    setIsDeleting(true);
    // Wait for fade animation, then actually delete
    setTimeout(() => {
      onDelete();
    }, 600);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`p-4 rounded-lg border transition-all duration-600 ease-out ${
          isDeleting
            ? "opacity-0 scale-90 pointer-events-none"
            : "opacity-100 scale-100"
        }`}
        style={{
          backgroundColor: "var(--color-flash-card)",
          borderColor: "var(--color-flash-border)",
        }}
      >
        <div className="space-y-3">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-flash-text)" }}
            >
              Question
            </label>
            <input
              type="text"
              value={card.question}
              onChange={(e) => onUpdate("question", e.target.value)}
              placeholder="Enter your question..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[--color-flash-accent] transition-all duration-200"
              style={{
                borderColor: "var(--color-flash-border)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-flash-text)" }}
            >
              Answer
            </label>
            <input
              type="text"
              value={card.answer}
              onChange={(e) => onUpdate("answer", e.target.value)}
              placeholder="Enter the answer..."
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[--color-flash-accent] transition-all duration-200"
              style={{
                borderColor: "var(--color-flash-border)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Delete button - positioned outside, only visible on hover */}
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 flex items-center justify-center text-xs font-bold hover:scale-110 disabled:opacity-50 shadow-lg z-10 ${
            isHovered || isDeleting
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
          }`}
          title="Delete card"
        >
          ✕
        </button>
      )}
    </div>
  );
}
