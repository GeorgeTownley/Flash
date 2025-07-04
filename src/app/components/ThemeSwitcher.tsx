"use client";

import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faWater,
  faLeaf,
  faMountainSun,
} from "@fortawesome/free-solid-svg-icons";

export default function ThemeSwitcher(): JSX.Element {
  const [currentTheme, setCurrentTheme] = useState<string>("");

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("flash-theme") || "";
    setCurrentTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const switchTheme = (themeClass: string): void => {
    setCurrentTheme(themeClass);
    document.body.className = themeClass;
    localStorage.setItem("flash-theme", themeClass);

    // Debug: log the computed styles
    const computedStyle = getComputedStyle(document.documentElement);
    console.log(
      "Background color variable:",
      computedStyle.getPropertyValue("--color-flash-bg")
    );
    console.log("Body class:", document.body.className);
  };

  return (
    <div
      className="p-8"
      style={{
        backgroundColor: "var(--color-flash-bg, #ff0000)",
        color: "var(--color-flash-text, #000000)",
      }}
    >
      {/* TOP CONTENT */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--color-flash-primary)" }}
        >
          Flash! Learning App
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "var(--color-flash-card)",
              border: "1px solid var(--color-flash-border)",
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "var(--color-flash-primary)" }}
            >
              Create Cards
            </h3>
            <p style={{ color: "var(--color-flash-text-muted)" }}>
              Add your flashcards here
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "var(--color-flash-surface)",
              border: "1px solid var(--color-flash-border)",
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: "var(--color-flash-primary)" }}
            >
              Study Mode
            </h3>
            <p style={{ color: "var(--color-flash-text-muted)" }}>
              Test your knowledge
            </p>
          </div>
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: "var(--color-flash-accent)",
              color: "white",
            }}
          >
            <h3 className="font-bold text-lg mb-2">Progress</h3>
            <p className="text-white/80">Track your learning</p>
          </div>
        </div>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-2 bg-white text-black rounded text-sm">
        <p>
          <strong>Debug:</strong> Current theme class: "{currentTheme}"
        </p>
        <p>
          <strong>Body class:</strong> "{document.body.className}"
        </p>
      </div>

      {/* MAIN THEME SWITCHER CONTENT */}
      <div
        className="p-6 rounded-lg mb-6"
        style={{
          backgroundColor: "var(--color-flash-card, #ffffff)",
          border: "2px solid var(--color-flash-primary, #000000)",
        }}
      >
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--color-flash-primary, #000000)" }}
        >
          Flash! Theme Test
        </h1>
        <p className="mb-4">
          Current theme: <strong>{currentTheme || "Default Flash!"}</strong>
        </p>
        <button
          className="px-4 py-2 rounded font-medium"
          style={{
            backgroundColor: "var(--color-flash-accent, #blue)",
            color: "white",
          }}
        >
          Sample Button
        </button>
      </div>

      {/* Theme selector buttons */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <button
          onClick={() => switchTheme("")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            currentTheme === "" ? "ring-4 ring-blue-400" : ""
          }`}
          style={{
            backgroundColor: "#f5f1eb",
            color: "#2d1810",
            borderColor: "#5d2e1a",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon
              icon={faCoffee}
              className="w-5 h-5"
              style={{ color: "#5d2e1a" }}
            />
            <h3 className="font-bold">Flash!</h3>
          </div>
          <p className="text-sm">Milky coffee</p>
        </button>

        <button
          onClick={() => switchTheme("theme-ocean")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            currentTheme === "theme-ocean" ? "ring-4 ring-cyan-400" : ""
          }`}
          style={{
            backgroundColor: "#0f172a",
            color: "#e2e8f0",
            borderColor: "#0ea5e9",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon
              icon={faWater}
              className="w-5 h-5"
              style={{ color: "#0ea5e9" }}
            />
            <h3 className="font-bold">Ocean</h3>
          </div>
          <p className="text-sm">Deep blue</p>
        </button>

        <button
          onClick={() => switchTheme("theme-jungle")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            currentTheme === "theme-jungle" ? "ring-4 ring-green-400" : ""
          }`}
          style={{
            backgroundColor: "#14532d",
            color: "#f7fee7",
            borderColor: "#15803d",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon
              icon={faLeaf}
              className="w-5 h-5"
              style={{ color: "#15803d" }}
            />
            <h3 className="font-bold">Jungle</h3>
          </div>
          <p className="text-sm">Forest green</p>
        </button>

        <button
          onClick={() => switchTheme("theme-desert")}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            currentTheme === "theme-desert" ? "ring-4 ring-orange-400" : ""
          }`}
          style={{
            backgroundColor: "#92400e",
            color: "#fef3c7",
            borderColor: "#b45309",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FontAwesomeIcon
              icon={faMountainSun}
              className="w-5 h-5"
              style={{ color: "#b45309" }}
            />
            <h3 className="font-bold">Desert</h3>
          </div>
          <p className="text-sm">Sandy brown</p>
        </button>
      </div>

      {/* BOTTOM CONTENT */}
      <div className="space-y-4">
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: "var(--color-flash-surface)",
            border: "1px solid var(--color-flash-border)",
          }}
        >
          <h2
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--color-flash-primary)" }}
          >
            Theme Effects Visible Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">What Changes:</h4>
              <ul
                className="space-y-1 text-sm"
                style={{ color: "var(--color-flash-text-muted)" }}
              >
                <li>• Page background color</li>
                <li>• Card backgrounds</li>
                <li>• Text colors</li>
                <li>• Border colors</li>
                <li>• Button colors</li>
              </ul>
            </div>
            <div
              className="p-4 rounded"
              style={{ backgroundColor: "var(--color-flash-card)" }}
            >
              <p
                className="font-medium mb-2"
                style={{ color: "var(--color-flash-primary)" }}
              >
                Sample Card Content
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--color-flash-text-muted)" }}
              >
                This card uses theme variables and will change with each theme
                selection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
