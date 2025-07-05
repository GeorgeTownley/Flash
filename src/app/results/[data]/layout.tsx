// src/app/results/[data]/layout.tsx
import { Metadata } from "next";
import { decodeQuizData, hasResults } from "../../utils/quizEncoding";

interface PageProps {
  params: Promise<{ data: string }>;
}

// Helper function to calculate score from user answers
function calculateScoreFromAnswers(
  userAnswers: string[],
  cards: any[]
): number {
  // Simple fallback scoring using exact string matching
  // (since we can't run AI scoring server-side)
  let correct = 0;
  userAnswers.forEach((userAnswer, index) => {
    const card = cards[index];
    if (userAnswer.toLowerCase().trim() === card.answer.toLowerCase().trim()) {
      correct++;
    }
  });
  return userAnswers.length > 0
    ? Math.round((correct / userAnswers.length) * 100)
    : 0;
}

// Generate metadata server-side for proper OG tags
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const decoded = decodeQuizData(resolvedParams.data);

    if (!hasResults(decoded)) {
      return {
        title: "Quiz Results",
        description: "View your quiz results",
      };
    }

    const quizTitle = decoded.title || "Untitled Quiz";

    // Calculate percentage using simple matching (fallback since we can't run AI server-side)
    const percentage = calculateScoreFromAnswers(
      decoded.userAnswers!,
      decoded.cards
    );

    return {
      title: `I got ${percentage}% in ${quizTitle}!`,
      description: `I scored ${percentage}% in this ${quizTitle} quiz! Think you can beat my score? Try it and find out what you can get!`,
      openGraph: {
        title: `I got ${percentage}% in this ${quizTitle} quiz!`,
        description: `I scored ${percentage}%! Think you can beat my score? Try this ${quizTitle} quiz and find out what you can get!`,
        images: [
          {
            url: "/flash-og-image.png",
            width: 1200,
            height: 630,
            alt: `${quizTitle} Quiz Results`,
          },
        ],
        type: "website",
        siteName: "Flash Quiz",
      },
      twitter: {
        card: "summary_large_image",
        title: `I got ${percentage}% in this ${quizTitle} quiz!`,
        description: `I scored ${percentage}%! Think you can beat my score? Try this quiz and find out what you can get!`,
        images: ["/flash-og-image.png"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Quiz Results",
      description: "View your quiz results",
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
