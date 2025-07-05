// src/app/api/score-quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ScoreRequest {
  question: string;
  correctAnswer: string;
  userAnswer: string;
}

interface ScoreResponse {
  score: "correct" | "unsure" | "incorrect";
  rationale: string;
}

export async function POST(request: NextRequest) {
  try {
    const { question, correctAnswer, userAnswer }: ScoreRequest =
      await request.json();

    // Validate input
    if (!question || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        {
          error: "Missing required fields: question, correctAnswer, userAnswer",
        },
        { status: 400 }
      );
    }

    // Create the AI prompt
    const prompt = `You are scoring a flashcard quiz answer. 

Question: "${question}"
Correct Answer: "${correctAnswer}"
User's Answer: "${userAnswer}"

Score the user's answer as one of:
- "correct": Answer is right or essentially equivalent
- "unsure": Answer is partially correct or ambiguous 
- "incorrect": Answer is wrong

Provide a brief rationale (max 20 words) explaining the scoring.

Respond in this exact JSON format:
{
  "score": "correct|unsure|incorrect",
  "rationale": "Brief explanation of scoring"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1, // Low temperature for consistent scoring
      max_tokens: 150,
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const scoreData: ScoreResponse = JSON.parse(responseText);

    // Validate the response structure
    if (!scoreData.score || !scoreData.rationale) {
      throw new Error("Invalid response structure from AI");
    }

    if (!["correct", "unsure", "incorrect"].includes(scoreData.score)) {
      throw new Error("Invalid score value from AI");
    }

    return NextResponse.json(scoreData);
  } catch (error) {
    console.error("AI Scoring Error:", error);

    // Fallback to simple text matching if AI fails
    const { question, correctAnswer, userAnswer } = await request.json();
    const isSimpleMatch =
      userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

    return NextResponse.json({
      score: isSimpleMatch ? "correct" : "incorrect",
      rationale: "AI unavailable - used exact text matching",
    });
  }
}
