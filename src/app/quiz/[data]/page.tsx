// src/app/quiz/[data]/page.tsx
export default function QuizPage({ params }: { params: { data: string } }) {
  const deckCode = params.data;

  // Try to decode and display quiz info
  let quizInfo = null;
  try {
    const decoded = atob(deckCode);
    quizInfo = JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode quiz data:", error);
  }

  return (
    <div className="flex flex-col items-center p-4 space-y-6 max-w-2xl mx-auto">
      <h1
        className="text-3xl font-bold text-center"
        style={{ color: "var(--color-flash-primary)" }}
      >
        Quiz Preview
      </h1>

      {quizInfo ? (
        <div className="w-full space-y-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "var(--color-flash-card)",
              border: "1px solid var(--color-flash-border)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--color-flash-text)" }}
            >
              {quizInfo.title || "Untitled Quiz"}
            </h2>

            {quizInfo.instructions && (
              <p
                className="mb-4"
                style={{ color: "var(--color-flash-text-muted)" }}
              >
                {quizInfo.instructions}
              </p>
            )}

            <div style={{ color: "var(--color-flash-text)" }}>
              <strong>Cards: </strong>
              {quizInfo.cards?.length || 0}
            </div>
          </div>

          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "var(--color-flash-surface)",
              border: "1px solid var(--color-flash-border)",
            }}
          >
            <h3
              className="font-semibold mb-2"
              style={{ color: "var(--color-flash-text)" }}
            >
              Deck Code:
            </h3>
            <code
              className="block p-2 rounded text-sm break-all"
              style={{
                backgroundColor: "var(--color-flash-bg)",
                color: "var(--color-flash-text)",
                border: "1px solid var(--color-flash-border)",
              }}
            >
              {deckCode}
            </code>
          </div>
        </div>
      ) : (
        <div
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: "var(--color-flash-surface)",
            border: "1px solid var(--color-flash-border)",
          }}
        >
          <p style={{ color: "var(--color-flash-text)" }}>Invalid quiz data</p>
          <code
            className="block mt-2 p-2 rounded text-sm break-all"
            style={{
              backgroundColor: "var(--color-flash-bg)",
              color: "var(--color-flash-text)",
              border: "1px solid var(--color-flash-border)",
            }}
          >
            {deckCode}
          </code>
        </div>
      )}

      <div className="text-center">
        <p
          className="text-sm"
          style={{ color: "var(--color-flash-text-muted)" }}
        >
          Quiz functionality coming soon!
        </p>
      </div>
    </div>
  );
}
