// utils/quizEncoding.ts

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizData {
  title?: string;
  instructions?: string;
  cards: Flashcard[];
  createdAt?: string;
  version?: string;
  // Optional fields for results
  userAnswers?: string[];
  shuffleOrder?: number[]; // Indices to preserve card order
}

/**
 * Encodes quiz data to a URL-safe base64 string
 */
export function encodeQuizData(quizData: QuizData): string {
  try {
    const jsonString = JSON.stringify(quizData);

    // Use URL-safe base64 encoding
    const encoded = btoa(jsonString)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return encoded;
  } catch (error) {
    throw new Error(
      `Failed to encode quiz data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Decodes a URL-safe base64 string back to quiz data
 */
export function decodeQuizData(encodedData: string): QuizData {
  try {
    // Convert URL-safe base64 back to regular base64
    let base64String = encodedData.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    while (base64String.length % 4) {
      base64String += "=";
    }

    const decoded = atob(base64String);
    const quiz = JSON.parse(decoded) as QuizData;

    // Validate the structure
    if (!quiz || typeof quiz !== "object") {
      throw new Error("Invalid quiz data structure");
    }

    if (!quiz.cards || !Array.isArray(quiz.cards) || quiz.cards.length === 0) {
      throw new Error("No valid cards found in quiz data");
    }

    return quiz;
  } catch (error) {
    throw new Error(
      `Failed to decode quiz data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Generates a shareable quiz URL (without results)
 */
export function generateQuizUrl(quizData: QuizData, baseUrl?: string): string {
  // Create clean quiz data without results
  const cleanQuizData: QuizData = {
    title: quizData.title,
    instructions: quizData.instructions,
    cards: quizData.cards,
    createdAt: quizData.createdAt,
    version: quizData.version,
    // Exclude userAnswers and shuffleOrder
  };

  const encoded = encodeQuizData(cleanQuizData);
  const base =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/quiz/${encoded}`;
}

/**
 * Generates a results URL (with user answers)
 */
export function generateResultsUrl(
  quizData: QuizData,
  baseUrl?: string
): string {
  const encoded = encodeQuizData(quizData);
  const base =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/results/${encoded}`;
}

/**
 * Creates shuffled cards and returns both cards and order indices
 */
export function shuffleCards(cards: Flashcard[]): {
  shuffledCards: Flashcard[];
  shuffleOrder: number[];
} {
  const indices = Array.from({ length: cards.length }, (_, i) => i);

  // Fisher-Yates shuffle of indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const shuffledCards = indices.map((i) => cards[i]);

  return { shuffledCards, shuffleOrder: indices };
}

/**
 * Restores original card order using shuffle indices
 */
export function restoreCardOrder(
  shuffledCards: Flashcard[],
  shuffleOrder: number[]
): Flashcard[] {
  const originalCards = new Array(shuffledCards.length);
  shuffledCards.forEach((card, shuffledIndex) => {
    const originalIndex = shuffleOrder[shuffledIndex];
    originalCards[originalIndex] = card;
  });
  return originalCards;
}

/**
 * Checks if quiz data contains results
 */
export function hasResults(quizData: QuizData): boolean {
  return !!(quizData.userAnswers && quizData.shuffleOrder);
}

/**
 * Validates quiz data structure
 */
export function validateQuizData(data: any): data is QuizData {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.cards) &&
    data.cards.length > 0 &&
    data.cards.every(
      (card: any) =>
        card &&
        typeof card === "object" &&
        typeof card.id === "string" &&
        typeof card.question === "string" &&
        typeof card.answer === "string"
    )
  );
}
