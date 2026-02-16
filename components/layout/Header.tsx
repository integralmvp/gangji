"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * Header Component
 * 노트 제목 줄 (종이 상단)
 * - 고정 높이: 64px (h-16)
 * - 중앙: 날짜
 * - 우측: [달력] / [백지] 전환
 */
export default function Header() {
  const { viewMode, toggleViewMode } = useUIStore();

  // Format current date (e.g., "2026.02.16")
  const currentDate = new Date()
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\. /g, ".")
    .replace(/\.$/, "");

  return (
    <div className="relative h-16 flex items-center justify-center px-6">
      {/* 중앙: 날짜 */}
      <div className="text-ink font-medium text-lg">{currentDate}</div>

      {/* 우측: 뷰 전환 버튼 */}
      <div className="absolute right-6 flex gap-2">
        <button
          onClick={toggleViewMode}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            viewMode === "calendar"
              ? "bg-ink text-paper"
              : "bg-paper-dark text-ink hover:bg-ink/10"
          }`}
        >
          달력
        </button>
        <button
          onClick={toggleViewMode}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            viewMode === "editor"
              ? "bg-ink text-paper"
              : "bg-paper-dark text-ink hover:bg-ink/10"
          }`}
        >
          백지
        </button>
      </div>
    </div>
  );
}

