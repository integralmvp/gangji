"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * TopBar Component
 *
 * Fixed top bar showing:
 * - Left: Current date
 * - Right: [Calendar] / [Blank] view toggle
 *
 * Design: Paper tone, minimal, no pressure
 */
export default function TopBar() {
  const { viewMode, toggleViewMode } = useUIStore();

  // Format current date (e.g., "2026년 2월 16일")
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-paper border-b border-paper-dark px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Current Date */}
        <div className="text-ink font-medium">{currentDate}</div>

        {/* Right: View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={toggleViewMode}
            className={`px-4 py-2 rounded transition-colors ${
              viewMode === "calendar"
                ? "bg-ink text-paper"
                : "bg-paper-dark text-ink hover:bg-paper-dark/70"
            }`}
          >
            달력
          </button>
          <button
            onClick={toggleViewMode}
            className={`px-4 py-2 rounded transition-colors ${
              viewMode === "editor"
                ? "bg-ink text-paper"
                : "bg-paper-dark text-ink hover:bg-paper-dark/70"
            }`}
          >
            백지
          </button>
        </div>
      </div>
    </header>
  );
}
