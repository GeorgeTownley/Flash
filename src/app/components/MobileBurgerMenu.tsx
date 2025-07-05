// components/MobileBurgerMenu.tsx
"use client";

import { useState, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

interface MenuSection {
  title: string;
  items: ReactNode;
}

interface MobileBurgerMenuProps {
  sections: MenuSection[];
  className?: string;
}

export default function MobileBurgerMenu({
  sections,
  className = "",
}: MobileBurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className={`md:hidden ${className}`}>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all focus:outline-none"
        style={{
          backgroundColor: "var(--color-flash-accent, #5d2e1a)",
          color: "white",
        }}
        title="Open menu"
      >
        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
      </button>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--color-flash-bg, #f8fafc)",
          borderLeft: "1px solid var(--color-flash-border, #e2e8f0)",
        }}
      >
        {/* Menu Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--color-flash-border, #e2e8f0)" }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-flash-text, #1e293b)" }}
          >
            Menu
          </h3>
          <button
            onClick={closeMenu}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ color: "var(--color-flash-text, #1e293b)" }}
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border-b"
              style={{ borderColor: "var(--color-flash-border, #e2e8f0)" }}
            >
              <div className="p-4">
                <h4
                  className="text-sm font-medium mb-3 uppercase tracking-wide opacity-75"
                  style={{ color: "var(--color-flash-text, #1e293b)" }}
                >
                  {section.title}
                </h4>
                <div onClick={closeMenu}>{section.items}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}
    </div>
  );
}
