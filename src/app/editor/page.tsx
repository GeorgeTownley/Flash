export default function EditorPage() {
  return (
    <div className="p-8">
      <div className="relative w-32 h-32 mb-4">
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
        className="text-3xl font-bold"
        style={{ color: "var(--color-flash-primary)" }}
      >
        Hello World - Editor Page
      </h1>
      <p style={{ color: "var(--color-flash-text)" }}>
        This will be the flashcard editor!
      </p>
    </div>
  );
}
