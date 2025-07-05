// components/SimpleThemeButtons.tsx
"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagicWandSparkles,
  faDroplet,
  faLeaf,
  faMountainSun,
} from "@fortawesome/free-solid-svg-icons";

interface Theme {
  id: string;
  name: string;
  icon: any;
  bgColor: string;
  className: string;
  textColor: string;
}

export default function SimpleThemeButtons() {
  const [currentTheme, setCurrentTheme] = useState<string>("");

  const themes: Theme[] = [
    {
      id: "flash",
      name: "Flash!",
      icon: faMagicWandSparkles,
      bgColor: "#5d2e1a",
      className: "",
      textColor: "white",
    },
    {
      id: "ocean",
      name: "Ocean",
      icon: faDroplet,
      bgColor: "#0ea5e9",
      className: "theme-ocean",
      textColor: "white",
    },
    {
      id: "jungle",
      name: "Jungle",
      icon: faLeaf,
      bgColor: "#15803d",
      className: "theme-jungle",
      textColor: "white",
    },
    {
      id: "desert",
      name: "Desert",
      icon: faMountainSun,
      bgColor: "#b45309",
      className: "theme-desert",
      textColor: "white",
    },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("flash-theme") || "";
    setCurrentTheme(savedTheme);
  }, []);

  const switchTheme = (themeClass: string): void => {
    setCurrentTheme(themeClass);
    document.body.className = themeClass;
    localStorage.setItem("flash-theme", themeClass);
  };

  return (
    <div className="space-y-2">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => switchTheme(theme.className)}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all hover:scale-[1.02] focus:outline-none ${
            currentTheme === theme.className
              ? "ring-2 ring-offset-2 scale-[1.02]"
              : "hover:shadow-md"
          }`}
          style={
            {
              backgroundColor: theme.bgColor,
              color: theme.textColor,
              ...(currentTheme === theme.className && {
                "--tw-ring-color": theme.bgColor,
              }),
            } as React.CSSProperties
          }
        >
          <FontAwesomeIcon icon={theme.icon} className="w-5 h-5" />
          <span className="font-medium">{theme.name}</span>
          {currentTheme === theme.className && (
            <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-75"></div>
          )}
        </button>
      ))}
    </div>
  );
}
