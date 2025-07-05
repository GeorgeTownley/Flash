// src/app/quiz/[data]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import {
  decodeQuizData,
  generateResultsUrl,
  shuffleCards,
  QuizData,
} from "../../utils/quizEncoding";

// Apply theme immediately to prevent flash
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("flash-theme") || "";
  document.body.className = savedTheme;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface PageProps {
  params: Promise<{ data: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const [deckCode, setDeckCode] = useState<string>("");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme is already applied above, but keep this for consistency
  useEffect(() => {
    const savedTheme = localStorage.getItem("flash-theme") || "";
    document.body.className = savedTheme;
  }, []);

  // Shuffle array function (remove since we're using utility)
  // const shuffleArray = <T,>(array: T[]): T[] => {
  //   const shuffled = [...array];
  //   for (let i = shuffled.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  //   }
  //   return shuffled;
  // };

  // Load and decode quiz data
  useEffect(() => {
    async function loadQuizData() {
      try {
        console.log("Starting to load quiz data...");
        const resolvedParams = await params;
        console.log("Resolved params:", resolvedParams);

        if (!resolvedParams || !resolvedParams.data) {
          throw new Error("No quiz data found in URL parameters");
        }

        const code = resolvedParams.data;
        setDeckCode(code);

        console.log("Raw deck code:", code);

        // Use the utility function to decode
        const quiz = decodeQuizData(code);
        console.log("Decoded quiz data:", quiz);

        setQuizData(quiz);
        const { shuffledCards: cards, shuffleOrder: order } = shuffleCards(
          quiz.cards
        );
        setShuffledCards(cards);
        setShuffleOrder(order);
        setUserAnswers(new Array(quiz.cards.length).fill(""));
      } catch (err) {
        console.error("Detailed error:", err);
        setError(
          `Failed to load quiz data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    }

    loadQuizData();
  }, [params]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentCardIndex(0);
    setUserAnswer("");
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      alert("Please enter an answer before continuing.");
      return;
    }

    // Save the current answer
    const newAnswers = [...userAnswers];
    newAnswers[currentCardIndex] = userAnswer.trim();
    setUserAnswers(newAnswers);

    // Move to next card or finish quiz
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setUserAnswer("");
    } else {
      // Quiz completed - redirect to results page
      if (!quizData) {
        alert("Quiz data not available");
        return;
      }

      const resultsData: QuizData = {
        title: quizData.title,
        instructions: quizData.instructions,
        cards: quizData.cards,
        createdAt: quizData.createdAt,
        version: quizData.version,
        userAnswers: newAnswers,
        shuffleOrder: shuffleOrder,
      };

      try {
        const resultsUrl = generateResultsUrl(resultsData);
        console.log("Generated results URL:", resultsUrl);
        window.location.href = resultsUrl;
      } catch (error) {
        console.error("Failed to generate results URL:", error);
        alert("Quiz completed! Results page coming soon.");
      }
    }
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentCardIndex(0);
    setUserAnswer("");
    setUserAnswers(new Array(shuffledCards.length).fill(""));
    const { shuffledCards: cards, shuffleOrder: order } = shuffleCards(
      quizData?.cards || []
    );
    setShuffledCards(cards);
    setShuffleOrder(order);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold text-center"
          style={{ color: "var(--color-flash-primary)" }}
        >
          Quiz Error
        </h1>
        <div
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: "var(--color-flash-surface)",
            border: "1px solid var(--color-flash-border)",
          }}
        >
          <p style={{ color: "var(--color-flash-error)" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto">
        <div style={{ color: "var(--color-flash-text)" }}>Loading quiz...</div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto">
        {/* Flash Logo */}
        <div className="relative w-20 h-10">
          <img
            src="/flash.png"
            alt="Flash!"
            className="w-full h-full opacity-0"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "var(--color-flash-primary)",
              maskImage: "url(/flash.png)",
              WebkitMaskImage: "url(/flash.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </div>

        <h1
          className="text-3xl font-bold text-center"
          style={{ color: "var(--color-flash-primary)" }}
        >
          {quizData.title || "Flashcard Quiz"}
        </h1>

        {quizData.instructions && (
          <div
            className="p-4 rounded-lg w-full"
            style={{
              backgroundColor: "var(--color-flash-card)",
              border: "1px solid var(--color-flash-border)",
            }}
          >
            <p style={{ color: "var(--color-flash-text)" }}>
              {quizData.instructions}
            </p>
          </div>
        )}

        <div
          className="p-4 rounded-lg w-full text-center"
          style={{
            backgroundColor: "var(--color-flash-surface)",
            border: "1px solid var(--color-flash-border)",
          }}
        >
          <p
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--color-flash-text)" }}
          >
            Ready to start?
          </p>
          <p style={{ color: "var(--color-flash-text-muted)" }}>
            {shuffledCards.length} cards • Randomized order
          </p>
        </div>

        <button
          onClick={startQuiz}
          className="w-full p-4 rounded-lg font-bold text-white text-lg transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--color-flash-accent)" }}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  const currentCard = shuffledCards[currentCardIndex];
  const isLastCard = currentCardIndex === shuffledCards.length - 1;

  return (
    <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto">
      {/* Flash Logo */}
      <div className="relative w-20 h-10">
        <img
          src="/flash.png"
          alt="Flash!"
          className="w-full h-full opacity-0"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "var(--color-flash-primary)",
            maskImage: "url(/flash.png)",
            WebkitMaskImage: "url(/flash.png)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div>

      {/* Header */}
      <div className="w-full text-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-flash-primary)" }}
        >
          {quizData.title || "Flashcard Quiz"}
        </h1>
        <p style={{ color: "var(--color-flash-text-muted)" }}>
          Question {currentCardIndex + 1} of {shuffledCards.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-2 rounded-full"
        style={{ backgroundColor: "var(--color-flash-surface)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            backgroundColor: "var(--color-flash-accent)",
            width: `${((currentCardIndex + 1) / shuffledCards.length) * 100}%`,
          }}
        />
      </div>

      {/* Question Card */}
      <div
        className="w-full p-6 rounded-lg"
        style={{
          backgroundColor: "var(--color-flash-card)",
          border: "2px solid var(--color-flash-border)",
        }}
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: "var(--color-flash-text)" }}
        >
          {currentCard.question}
        </h2>

        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-flash-text)" }}
            >
              Your Answer:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  submitAnswer();
                }
              }}
              placeholder="Type your answer here..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                borderColor: "var(--color-flash-border)",
                backgroundColor: "var(--color-flash-bg)",
                color: "var(--color-flash-text)",
              }}
              autoFocus
            />
          </div>

          <button
            onClick={submitAnswer}
            disabled={!userAnswer.trim()}
            className="w-full p-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--color-flash-accent)" }}
          >
            <span>{isLastCard ? "Finish Quiz" : "Next Question"}</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
