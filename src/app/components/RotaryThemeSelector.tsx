// components/RotaryThemeSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagicWandSparkles,
  faDroplet,
  faLeaf,
  faMountainSun,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface Theme {
  id: string;
  name: string;
  icon: IconDefinition;
  bgColor: string;
  className: string;
  textColor: string;
}

export default function RotaryThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const themes: Theme[] = [
    {
      id: "flash",
      name: "Flash!",
      icon: faMagicWandSparkles,
      bgColor: "#5d2e1a",
      className: "",
      textColor: "white", // Dark background = white text
    },
    {
      id: "ocean",
      name: "Ocean",
      icon: faDroplet,
      bgColor: "#0ea5e9",
      className: "theme-ocean",
      textColor: "white", // Dark background = white text
    },
    {
      id: "jungle",
      name: "Jungle",
      icon: faLeaf,
      bgColor: "#15803d",
      className: "theme-jungle",
      textColor: "white", // Dark background = white text
    },
    {
      id: "desert",
      name: "Desert",
      icon: faMountainSun,
      bgColor: "#b45309",
      className: "theme-desert",
      textColor: "white", // Dark background = white text
    },
  ];

  const currentThemeData =
    themes.find((t) => t.className === currentTheme) || themes[0];

  useEffect(() => {
    // Load saved theme from localStorage (same method as working POC)
    const savedTheme = localStorage.getItem("flash-theme") || "";
    setCurrentTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const switchTheme = (themeClass: string): void => {
    setCurrentTheme(themeClass);
    document.body.className = themeClass;
    localStorage.setItem("flash-theme", themeClass);
    setIsOpen(false); // Close menu after selection

    // Debug: log the computed styles (same as POC)
    const computedStyle = getComputedStyle(document.documentElement);
    console.log(
      "Background color variable:",
      computedStyle.getPropertyValue("--color-flash-bg")
    );
    console.log("Body class:", document.body.className);
  };

  return (
    <div className="hidden md:block fixed bottom-4 right-4 z-50">
      {/* Main Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none ${
          isOpen ? "scale-110" : ""
        }`}
        style={{
          backgroundColor: currentThemeData.bgColor,
          color: currentThemeData.textColor,
        }}
        title={`Current theme: ${currentThemeData.name}`}
      >
        <FontAwesomeIcon icon={currentThemeData.icon} className="w-6 h-6" />
      </button>

      {/* Rotary Menu Options */}
      <div
        className={`absolute top-0 left-0 transition-all duration-300 z-20 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {themes
          .filter((theme) => theme.className !== currentTheme) // Show all themes except current
          .map((theme, index) => {
            // Position buttons in upper-left quadrant
            // Spread them in an arc from 180° to 270° (6 o'clock to 9 o'clock)
            const totalButtons = themes.length - 1; // Exclude current theme
            const startAngle = 180; // 6 o'clock
            const endAngle = 270; // 9 o'clock
            const angleStep = (endAngle - startAngle) / (totalButtons - 1);
            const angle = startAngle + index * angleStep;

            // Convert to radians and calculate position
            const radians = (angle * Math.PI) / 180;
            const radius = 80;
            const x = Math.cos(radians) * radius;
            const y = Math.sin(radians) * radius;

            return (
              <button
                key={theme.id}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log(`${theme.name} button clicked!`);
                  switchTheme(theme.className);
                }}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 will-change-transform ${
                  isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.textColor,
                  transform: isOpen
                    ? `translate3d(${x}px, ${y}px, 0) scale(1)`
                    : "translate3d(0, 0, 0) scale(0)",
                  transitionDelay: isOpen ? `${index * 80}ms` : "0ms",
                  top: "50%",
                  left: "50%",
                  marginTop: "-24px",
                  marginLeft: "-24px",
                  zIndex: 30,
                  backfaceVisibility: "hidden",
                }}
                title={`Switch to ${theme.name} theme`}
              >
                <FontAwesomeIcon
                  icon={theme.icon}
                  className="w-5 h-5"
                  style={{ transform: "translateZ(0)" }}
                />
              </button>
            );
          })}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
