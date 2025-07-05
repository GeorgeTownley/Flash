// components/ImportExport.tsx
"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface ImportExportProps {
  cards: Flashcard[];
  title: string;
  instructions: string;
  onImport: (data: {
    cards: Flashcard[];
    title: string;
    instructions: string;
  }) => void;
}

export default function ImportExport({
  cards,
  title,
  instructions,
  onImport,
}: ImportExportProps) {
  const [showImportField, setShowImportField] = useState(false);
  const [importText, setImportText] = useState("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isNotificationFading, setIsNotificationFading] = useState(false);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleExport = async () => {
    // Check if there's any data to export
    const validCards = cards.filter(
      (card) => card.question.trim() || card.answer.trim()
    );
    if (validCards.length === 0 && !title.trim() && !instructions.trim()) {
      showNotification("No data to export", "error");
      return;
    }

    const exportData = {
      title: title || "Untitled Quiz",
      instructions: instructions || "",
      cards: validCards,
      createdAt: new Date().toISOString(),
      version: "1.0",
    };

    // Convert to JSON and compress to base64
    const jsonString = JSON.stringify(exportData);
    const compressed = btoa(jsonString);

    console.log("Export Data (JSON):", jsonString);
    console.log("Export Data (Base64):", compressed);

    // Copy to clipboard
    const success = await copyToClipboard(compressed);
    if (success) {
      showNotification("Deck code copied to clipboard", "success");
    } else {
      showNotification("Failed to copy to clipboard", "error");
    }
  };

  const handleImportClick = () => {
    const wasShowing = showImportField;
    setShowImportField(!showImportField);
    setImportText("");

    // If we're opening the import field, scroll to keep it visible
    if (!wasShowing) {
      setTimeout(() => {
        const importSection = document.querySelector("[data-import-section]");
        importSection?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  const handleImportSubmit = () => {
    try {
      // Try to decode base64 first
      let jsonString = importText;
      try {
        jsonString = atob(importText);
      } catch {
        // If base64 decode fails, assume it's already JSON
      }

      const importedData = JSON.parse(jsonString);

      // Validate the data structure
      if (!importedData.cards || !Array.isArray(importedData.cards)) {
        throw new Error("Invalid data format: missing cards array");
      }

      console.log("Import Data:", importedData);

      onImport({
        cards: importedData.cards,
        title: importedData.title || "",
        instructions: importedData.instructions || "",
      });

      setShowImportField(false);
      setImportText("");
      // No success message needed - the data populating is validation enough
    } catch (error) {
      console.error("Import error:", error);
      showNotification("Incorrect data format", "error");
    }
  };

  return (
    <div className="w-full space-y-4" data-import-section>
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

      {/* Import/Export Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleImportClick}
          className="p-3 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            backgroundColor: showImportField
              ? "var(--color-flash-accent)"
              : "var(--color-flash-surface)",
            color: showImportField ? "white" : "var(--color-flash-primary)",
            border: `2px solid ${
              showImportField
                ? "var(--color-flash-accent)"
                : "var(--color-flash-border)"
            }`,
          }}
        >
          <FontAwesomeIcon icon={faUpload} className="w-4 h-4" />
          Import Deck
        </button>
        <button
          onClick={handleExport}
          className="p-3 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--color-flash-surface)",
            color: "var(--color-flash-primary)",
            border: "2px solid var(--color-flash-border)",
          }}
        >
          <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
          Export Deck
        </button>
      </div>

      {/* Conditional Import Field */}
      {showImportField && (
        <div
          className="space-y-3 p-4 rounded-lg"
          style={{
            backgroundColor: "var(--color-flash-card)",
            border: "1px solid var(--color-flash-border)",
          }}
        >
          <label
            className="block text-sm font-medium"
            style={{ color: "var(--color-flash-text)" }}
          >
            Paste your flashcard data (JSON or Base64):
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported flashcard data here..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[--color-flash-accent] h-32 resize-none"
            style={{ borderColor: "var(--color-flash-border)" }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleImportSubmit}
              disabled={!importText.trim()}
              className="px-4 py-2 rounded font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "var(--color-flash-accent)" }}
            >
              Import
            </button>
            <button
              onClick={() => setShowImportField(false)}
              className="px-4 py-2 rounded font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: "var(--color-flash-surface)",
                color: "var(--color-flash-text)",
                border: "1px solid var(--color-flash-border)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
