// page.tsx
import FlashcardEditor from "../components/FlashcardEditor";

export default function EditorPage() {
  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      {/* Logo - Responsive sizing and mobile padding */}
      <div className="relative w-60 h-30 sm:w-72 sm:h-36 md:w-90 md:h-45 pt-16 md:pt-0">
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

      <h2
        className="text-xl sm:text-2xl text-center w-full max-w-md mx-auto md:max-w-2xl lg:max-w-4xl px-2"
        style={{ color: "var(--color-flash-primary)" }}
      >
        Make and share flashcard quizes with your friends!
      </h2>

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
