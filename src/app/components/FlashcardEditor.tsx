// components/FlashCardEditor.tsx
"use client";

import { useState } from "react";
import FlashCardItem from "./FlashCardItem";
import AddCardButton from "./AddCardButton";
import StartTestButton from "./StartTestButton";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface FlashCardEditorProps {
  initialCards?: Flashcard[];
  initialTitle?: string;
  initialInstructions?: string;
  onCardsChange?: (cards: Flashcard[]) => void;
  onStartTest?: (data: {
    cards: Flashcard[];
    title?: string;
    instructions?: string;
  }) => void;
}

export default function FlashCardEditor({
  initialCards = [{ id: "1", question: "", answer: "" }],
  initialTitle = "",
  initialInstructions = "",
  onCardsChange,
  onStartTest,
}: FlashCardEditorProps) {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [title, setTitle] = useState(initialTitle);
  const [instructions, setInstructions] = useState(initialInstructions);

  const addCard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    onCardsChange?.(updatedCards);
  };

  const updateCard = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, [field]: value } : card
    );
    setCards(updatedCards);
    onCardsChange?.(updatedCards);
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      const updatedCards = cards.filter((card) => card.id !== id);
      setCards(updatedCards);
      onCardsChange?.(updatedCards);
    }
  };

  const handleStartTest = () => {
    const validCards = cards.filter(
      (card) => card.question.trim() && card.answer.trim()
    );

    if (validCards.length === 0) {
      alert("Add some cards first!");
      return;
    }

    const testData = {
      cards: validCards,
      title: title || undefined,
      instructions: instructions || undefined,
    };

    if (onStartTest) {
      onStartTest(testData);
    } else {
      // Default behavior - generate URL and log
      const encoded = btoa(JSON.stringify(testData));
      const testUrl = `/quiz/${encoded}`;
      console.log("Test URL:", testUrl);
      alert(`Test URL generated! Check console for now.`);
    }
  };

  const hasValidCards = cards.some(
    (card) => card.question.trim() && card.answer.trim()
  );

  return (
    <div className="flex flex-col items-center p-4 space-y-6 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-flash-primary)" }}
        >
          Create Flashcards
        </h1>
        <p className="text-sm" style={{ color: "var(--color-flash-text)" }}>
          Add questions and answers to test yourself
        </p>
      </div>

      {/* Optional Title Input */}
      <div className="w-full">
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--color-flash-text)" }}
        >
          Quiz Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., French Vocabulary, History Quiz..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[--color-flash-accent]"
          style={{ borderColor: "var(--color-flash-border)" }}
        />
      </div>

      {/* Optional Instructions Input */}
      <div className="w-full">
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--color-flash-text)" }}
        >
          Instructions (Optional)
        </label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Define the following words, Give one-word answers only..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[--color-flash-accent] h-20 resize-none"
          style={{ borderColor: "var(--color-flash-border)" }}
        />
      </div>

      {/* Cards */}
      <div className="w-full space-y-4">
        {cards.map((card, index) => (
          <div key={card.id} className="transition-all duration-300 ease-out">
            <FlashCardItem
              card={card}
              cardNumber={index + 1}
              onUpdate={(field: "question" | "answer", value: string) =>
                updateCard(card.id, field, value)
              }
              onDelete={() => deleteCard(card.id)}
              canDelete={cards.length > 1}
            />
          </div>
        ))}
      </div>

      {/* Add Card Button */}
      <AddCardButton onClick={addCard} />

      {/* Start Test Button */}
      <StartTestButton onClick={handleStartTest} disabled={!hasValidCards} />
    </div>
  );
}
