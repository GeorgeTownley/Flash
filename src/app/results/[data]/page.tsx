// src/app/results/[data]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faRotateLeft,
  faCheck,
  faTimes,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import Confetti from "react-confetti";
import {
  decodeQuizData,
  generateQuizUrl,
  hasResults,
  QuizData,
} from "../../utils/quizEncoding";

// Custom hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Set initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

interface PageProps {
  params: Promise<{ data: string }>;
}

export default function ResultsPage({ params }: PageProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [scores, setScores] = useState<("correct" | "unsure" | "incorrect")[]>(
    []
  );
  const [rationales, setRationales] = useState<string[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isNotificationFading, setIsNotificationFading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [siteUrl, setSiteUrl] = useState<string>("");

  const { width, height } = useWindowSize();

  // Apply theme on component mount and set URLs
  useEffect(() => {
    const savedTheme = localStorage.getItem("flash-theme") || "";
    document.body.className = savedTheme;

    // Set URLs safely on client side
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
      setSiteUrl(window.location.origin);
    }
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setIsNotificationFading(false);

    // Start fade out after 4 seconds
    setTimeout(() => {
      setIsNotificationFading(true);
    }, 4000);

    // Remove completely after fade animation
    setTimeout(() => {
      setNotification(null);
      setIsNotificationFading(false);
    }, 5000);
  };

  // AI scoring function
  const scoreWithAI = async (
    question: string,
    correctAnswer: string,
    userAnswer: string
  ) => {
    try {
      console.log("Scoring:", { question, correctAnswer, userAnswer });

      const response = await fetch("/api/score-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          correctAnswer,
          userAnswer,
        }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("API Error response:", errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("AI Result:", result);
      return result;
    } catch (error) {
      console.error("AI scoring failed:", error);
      // Fallback to simple matching
      const fallbackResult = {
        score:
          userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
            ? "correct"
            : "incorrect",
        rationale: "AI unavailable - used exact text matching",
      };
      console.log("Using fallback result:", fallbackResult);
      return fallbackResult;
    }
  };

  useEffect(() => {
    async function loadResults() {
      try {
        const resolvedParams = await params;
        const code = resolvedParams.data;

        // Decode the quiz data (now includes results)
        const decoded = decodeQuizData(code);
        console.log("Decoded quiz data:", decoded);

        // Validate it has results
        if (!hasResults(decoded)) {
          throw new Error("No results found in quiz data");
        }

        setQuizData(decoded);

        // Start AI scoring process
        setIsScoring(true);
        const scoringPromises = decoded.userAnswers!.map(
          async (userAnswer, index) => {
            // shuffleOrder[index] gives us the original card index for this shuffled position
            const originalCardIndex = decoded.shuffleOrder![index];
            const card = decoded.cards[originalCardIndex];

            return await scoreWithAI(card.question, card.answer, userAnswer);
          }
        );

        const aiResults = await Promise.all(scoringPromises);

        setScores(aiResults.map((result) => result.score));
        setRationales(aiResults.map((result) => result.rationale));
        setIsScoring(false);

        // Calculate percentage after scoring is complete
        const correctCount = aiResults.filter(
          (result) => result.score === "correct"
        ).length;
        const unsureCount = aiResults.filter(
          (result) => result.score === "unsure"
        ).length;
        const totalCount = aiResults.length;
        const totalPoints = correctCount * 1 + unsureCount * 0.5;
        const calculatedPercentage =
          totalCount > 0 ? Math.round((totalPoints / totalCount) * 100) : 0;

        setPercentage(calculatedPercentage);

        // Show confetti if score is over 80%
        if (calculatedPercentage > 80) {
          setShowConfetti(true);
          // Stop confetti after 10 seconds
          setTimeout(() => {
            setShowConfetti(false);
          }, 10000);
        }

        // Generate shareable quiz URL (clean quiz only, no results)
        const cleanQuizData = {
          title: decoded.title,
          instructions: decoded.instructions,
          cards: decoded.cards,
          createdAt: decoded.createdAt,
          version: decoded.version,
          // Explicitly exclude userAnswers and shuffleOrder
        };
        const quizUrl = generateQuizUrl(cleanQuizData);
        setShareUrl(quizUrl);
      } catch (err) {
        console.error("Results decode error:", err);
        setError("Failed to load quiz results");
      }
    }

    loadResults();
  }, [params]);

  const copyShareUrl = async () => {
    try {
      // Use the state value instead of directly accessing window
      await navigator.clipboard.writeText(currentUrl);
      showNotification("Results link copied to clipboard!", "success");
    } catch {
      showNotification("Failed to copy link", "error");
    }
  };

  const retakeQuiz = () => {
    window.location.href = shareUrl;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--color-flash-primary)" }}
        >
          Results Error
        </h1>
        <p style={{ color: "var(--color-flash-error)" }}>{error}</p>
      </div>
    );
  }

  if (!quizData || isScoring) {
    return (
      <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto">
        <div style={{ color: "var(--color-flash-text)" }}>
          {isScoring ? "AI is scoring your answers..." : "Loading results..."}
        </div>
      </div>
    );
  }

  const correctCount = scores.filter((score) => score === "correct").length;
  const unsureCount = scores.filter((score) => score === "unsure").length;
  const totalCount = scores.length;
  const quizTitle = quizData?.title || "Untitled Quiz"; // eslint-disable-line @typescript-eslint/no-unused-vars

  return (
    <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto md:max-w-2xl lg:max-w-4xl">
      {/* Confetti */}
      {showConfetti && width > 0 && height > 0 && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.1}
          initialVelocityX={4}
          initialVelocityY={10}
          colors={[
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
          ]}
          tweenDuration={10000}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-opacity duration-1000 ${
            isNotificationFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`p-4 rounded-lg border-2 shadow-lg max-w-sm ${
              notification.type === "success"
                ? "bg-green-100 border-green-400 text-green-800"
                : "bg-red-100 border-red-400 text-red-800"
            }`}
            style={{
              backgroundColor:
                notification.type === "success" ? "#dcfce7" : "#fee2e2",
              borderColor:
                notification.type === "success" ? "#4ade80" : "#f87171",
              color: notification.type === "success" ? "#166534" : "#991b1b",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-lg">
                {notification.type === "success" ? "✓" : "✕"}
              </span>
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Flash Logo */}
      <div className="relative w-60 h-30 sm:w-72 sm:h-36 md:w-90 md:h-45 pt-16 md:pt-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/flash.png"
          alt="Flash!"
          className="w-full h-full opacity-0 "
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
      <div className="text-center">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--color-flash-primary)" }}
        >
          Quiz Results
        </h1>
        <h2 className="text-xl" style={{ color: "var(--color-flash-text)" }}>
          {quizData.title || "Untitled Quiz"}
        </h2>
      </div>

      {/* Score Summary */}
      <div
        className="w-full p-6 rounded-lg text-center"
        style={{
          backgroundColor: "var(--color-flash-card)",
          border: "2px solid var(--color-flash-border)",
        }}
      >
        <div
          className="text-4xl font-bold mb-2"
          style={{ color: "var(--color-flash-accent)" }}
        >
          {percentage}%
        </div>
        <div className="text-lg" style={{ color: "var(--color-flash-text)" }}>
          {correctCount} correct, {unsureCount} partial,{" "}
          {totalCount - correctCount - unsureCount} incorrect
        </div>
        {percentage > 80 && (
          <div
            className="mt-2 text-lg font-semibold"
            style={{ color: "var(--color-flash-accent)" }}
          >
            🎉 Excellent work! 🎉
          </div>
        )}
        <div className="mt-4">
          <div
            className="h-4 rounded-full"
            style={{ backgroundColor: "var(--color-flash-surface)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                backgroundColor: "var(--color-flash-accent)",
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="w-full space-y-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-flash-text)" }}
        >
          Detailed Results
        </h3>

        {quizData.userAnswers!.map((userAnswer, index) => {
          // shuffleOrder[index] gives us the original card index for this shuffled position
          const originalCardIndex = quizData.shuffleOrder![index];
          const card = quizData.cards[originalCardIndex];
          const score = scores[index];
          const rationale = rationales[index];

          // Determine colors and icons based on AI score
          const isCorrect = score === "correct";
          const isUnsure = score === "unsure";

          const borderColor = isCorrect
            ? "#10b981" // Green-500
            : isUnsure
            ? "#f59e0b" // Yellow-500
            : "#ef4444"; // Red-500

          const iconColor = isCorrect
            ? "#10b981" // Green-500
            : isUnsure
            ? "#f59e0b" // Yellow-500
            : "#ef4444"; // Red-500

          const icon = isCorrect
            ? faCheck
            : isUnsure
            ? faQuestionCircle
            : faTimes;

          return (
            <div
              key={card.id}
              className="p-4 rounded-lg border-2 transition-all"
              style={{
                backgroundColor: "var(--color-flash-card)",
                borderColor: borderColor,
                boxShadow: `0 0 0 1px ${borderColor}20`, // Subtle glow effect
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h4
                  className="font-medium flex-1 text-lg"
                  style={{ color: "var(--color-flash-text)" }}
                >
                  {card.question}
                </h4>
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full ml-3"
                  style={{
                    backgroundColor: `${iconColor}20`,
                    border: `2px solid ${iconColor}`,
                  }}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className="w-4 h-4"
                    style={{ color: iconColor }}
                  />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span
                    className="font-semibold text-xs uppercase tracking-wide"
                    style={{ color: "var(--color-flash-text-muted)" }}
                  >
                    Your answer:
                  </span>
                  <span
                    className="font-medium px-2 py-1 rounded"
                    style={{
                      color: iconColor,
                      backgroundColor: `${iconColor}15`,
                    }}
                  >
                    {userAnswer}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span
                    className="font-semibold text-xs uppercase tracking-wide"
                    style={{ color: "var(--color-flash-text-muted)" }}
                  >
                    Expected answer:
                  </span>
                  <span
                    className="font-medium px-2 py-1 rounded"
                    style={{
                      color: "#10b981",
                      backgroundColor: "#10b98115",
                    }}
                  >
                    {card.answer}
                  </span>
                </div>

                {rationale && (
                  <div
                    className="mt-3 pt-3 border-t"
                    style={{ borderColor: "var(--color-flash-border)" }}
                  >
                    <div className="space-y-1">
                      <span
                        className="font-semibold text-xs uppercase tracking-wide block"
                        style={{ color: "var(--color-flash-text-muted)" }}
                      >
                        AI Assessment:
                      </span>
                      <span
                        className="italic text-sm leading-relaxed block"
                        style={{ color: "var(--color-flash-text)" }}
                      >
                        &ldquo;{rationale}&rdquo;
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-3">
        <button
          onClick={retakeQuiz}
          className="p-3 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--color-flash-accent)",
            color: "white",
          }}
        >
          <FontAwesomeIcon icon={faRotateLeft} className="w-4 h-4" />
          Retake Quiz
        </button>

        <button
          onClick={copyShareUrl}
          className="p-3 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--color-flash-surface)",
            color: "var(--color-flash-primary)",
            border: "2px solid var(--color-flash-border)",
          }}
        >
          <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
          Share My Results
        </button>
      </div>
    </div>
  );
}
