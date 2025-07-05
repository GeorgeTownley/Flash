import FlashcardEditor from "../components/FlashcardEditor";

export default function EditorPage() {
  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Logo */}
      <div className="relative w-60 h-60">
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
        className="text-2xl font-bold text-center"
        style={{ color: "var(--color-flash-primary)" }}
      >
        Flash! Flashcard Creator
      </h1>

      <FlashcardEditor />

      <p
        className="text-center text-sm"
        style={{ color: "var(--color-flash-text)" }}
      >
        Create your flashcards and test yourself
      </p>
    </div>
  );
}
