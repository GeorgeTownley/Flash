// components/FlashCardEditor.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faPlay } from "@fortawesome/free-solid-svg-icons";

import FlashCardItem from "./FlashCardItem";
import AddCardButton from "./AddCardButton";
import StartTestButton from "./StartTestButton";
import ImportExport from "./ImportExport";
import RotaryThemeSelector from "./RotaryThemeSelector";
import MobileBurgerMenu from "./MobileBurgerMenu";
import SimpleThemeButtons from "./SimpleThemeButtons";
import { encodeQuizData, generateQuizUrl } from "../utils/quizEncoding";

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

  // Load saved quiz progress on component mount
  useEffect(() => {
    const savedQuiz = localStorage.getItem("flash-quiz-draft");
    if (savedQuiz) {
      try {
        console.log("Found saved quiz data:", savedQuiz);
        const parsed = JSON.parse(savedQuiz);
        console.log("Parsed saved data:", parsed);

        // Validate the structure before using it
        if (parsed && typeof parsed === "object") {
          setCards(
            parsed.cards && Array.isArray(parsed.cards)
              ? parsed.cards
              : initialCards
          );
          setTitle(parsed.title || initialTitle);
          setInstructions(parsed.instructions || initialInstructions);
        } else {
          console.warn("Invalid saved data structure, using defaults");
        }
      } catch (error) {
        console.warn("Failed to load saved quiz draft:", error);
        // Clear the corrupted data
        localStorage.removeItem("flash-quiz-draft");
      }
    }
  }, []); // Empty dependency array - only run on mount

  // Auto-save quiz progress with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const quizData = {
        cards,
        title,
        instructions,
        lastSaved: new Date().toISOString(),
      };

      // Only save if there's meaningful content
      const hasContent =
        cards.some((card) => card.question.trim() || card.answer.trim()) ||
        title.trim() ||
        instructions.trim();

      if (hasContent) {
        localStorage.setItem("flash-quiz-draft", JSON.stringify(quizData));
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [cards, title, instructions]);

  const addCard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      question: "",
      answer: "",
    };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    onCardsChange?.(updatedCards);

    // Scroll to new card after it's rendered
    setTimeout(() => {
      const newCardElement = document.querySelector(
        `[data-card-id="${newCard.id}"]`
      );
      newCardElement?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
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
      try {
        // Use the utility function to generate the quiz URL
        const testUrl = generateQuizUrl(testData);
        console.log("Generated quiz URL:", testUrl);
        window.location.href = testUrl;
      } catch (error) {
        console.error("Failed to generate quiz URL:", error);
        alert("Failed to start quiz. Please try again.");
      }
    }
  };

  const handleImport = (importedData: {
    cards: Flashcard[];
    title: string;
    instructions: string;
  }) => {
    setCards(importedData.cards);
    setTitle(importedData.title);
    setInstructions(importedData.instructions);
    onCardsChange?.(importedData.cards);
  };

  const startTour = () => {
    // Placeholder for React Joyride tour
    console.log("Starting tour...");
    alert("Tour would start here! (React Joyride integration)");
  };

  const hasValidCards = cards.some(
    (card) => card.question.trim() && card.answer.trim()
  );

  // Define mobile menu sections
  const mobileMenuSections = [
    {
      title: "Styles",
      items: <SimpleThemeButtons />,
    },
    {
      title: "Help",
      items: (
        <div className="space-y-2">
          <button
            onClick={startTour}
            className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:scale-[1.02] focus:outline-none hover:shadow-md"
            style={{
              backgroundColor: "var(--color-flash-accent, #5d2e1a)",
              color: "white",
            }}
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="w-5 h-5" />
            <span className="font-medium">Take a Tour</span>
          </button>
        </div>
      ),
    },
    {
      title: "Actions",
      items: (
        <div className="space-y-2">
          <button
            onClick={handleStartTest}
            disabled={!hasValidCards}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:scale-[1.02] focus:outline-none ${
              hasValidCards
                ? "hover:shadow-md"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{
              backgroundColor: hasValidCards
                ? "var(--color-flash-accent, #5d2e1a)"
                : "#9ca3af",
              color: "white",
            }}
          >
            <FontAwesomeIcon icon={faPlay} className="w-5 h-5" />
            <span className="font-medium">Start Quiz</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center p-4 space-y-6 w-full max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
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
          className="w-full p-2 border rounded focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--color-flash-border)",
            backgroundColor: "var(--color-flash-card)",
            color: "var(--color-flash-text)",
          }}
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
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 h-20 resize-none"
          style={{
            borderColor: "var(--color-flash-border)",
            backgroundColor: "var(--color-flash-card)",
            color: "var(--color-flash-text)",
          }}
        />
      </div>

      {/* Cards */}
      <div className="w-full space-y-4">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="transition-all duration-300 ease-out"
            data-card-id={card.id}
          >
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

      {/* Import/Export */}
      <ImportExport
        cards={cards}
        title={title}
        instructions={instructions}
        onImport={handleImport}
      />

      {/* Start Test Button */}
      <StartTestButton onClick={handleStartTest} disabled={!hasValidCards} />

      {/* Desktop Rotary Theme Selector */}
      <RotaryThemeSelector />

      {/* Mobile Burger Menu */}
      <MobileBurgerMenu sections={mobileMenuSections} />
    </div>
  );
}
