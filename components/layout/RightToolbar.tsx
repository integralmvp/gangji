"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * RightToolbar — 우측 도구 패널
 * - 패널 자체: glass blur 투명 배경
 * - 뷰 전환, 에디터 도구, 몰입기간 각 그룹: 포스트잇 카드 스타일
 */
export default function RightToolbar() {
  const { viewMode, setViewMode, rightOpen, toggleRight } = useUIStore();

  const editorTools = [
    { id: "bold",      icon: "B",  label: "굵게",   style: "font-bold" },
    { id: "italic",    icon: "I",  label: "기울임", style: "italic" },
    { id: "underline", icon: "U",  label: "밑줄",   style: "underline" },
    { id: "h1",        icon: "H1", label: "제목 1", style: "" },
    { id: "h2",        icon: "H2", label: "제목 2", style: "" },
    { id: "list",      icon: "≡",  label: "목록",   style: "" },
    { id: "highlight", icon: "▌",  label: "형광펜", style: "" },
  ];

  return (
    <div className="h-full glass transition-all duration-200 flex flex-col">
      {/* 토글 버튼 */}
      <button
        onClick={toggleRight}
        className="self-start p-2 m-1 rounded text-ink-muted hover:text-ink transition-colors text-xs"
        title={rightOpen ? "닫기" : "열기"}
      >
        {rightOpen ? "▸" : "◂"}
      </button>

      {/* 뷰 전환 — 포스트잇 카드 */}
      <div className="px-2 mb-2">
        <div className="postit p-2 space-y-1">
          {rightOpen && (
            <div className="text-[9px] text-ink-muted mb-1 uppercase tracking-wide">뷰</div>
          )}
          <button
            onClick={() => setViewMode("editor")}
            className={`w-full px-2 py-1 rounded text-xs transition-colors
              ${viewMode === "editor"
                ? "bg-ink text-paper"
                : "text-ink-muted hover:text-ink hover:bg-ink/5"
              }`}
            title="백지 보기"
          >
            {rightOpen ? "백지" : "✎"}
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`w-full px-2 py-1 rounded text-xs transition-colors
              ${viewMode === "calendar"
                ? "bg-ink text-paper"
                : "text-ink-muted hover:text-ink hover:bg-ink/5"
              }`}
            title="달력 보기"
          >
            {rightOpen ? "달력" : "▦"}
          </button>
        </div>
      </div>

      {/* 에디터 도구 — 각 도구가 포스트잇 카드 (에디터 모드에서만) */}
      {viewMode === "editor" && (
        <div className="px-2 flex-1 space-y-1">
          {rightOpen && (
            <div className="text-[9px] text-ink-muted mb-1 uppercase tracking-wide">
              문서 도구
            </div>
          )}
          {editorTools.map((tool) => (
            <button
              key={tool.id}
              className={`postit w-full rounded text-ink-muted hover:text-ink transition-colors
                ${rightOpen
                  ? "flex items-center gap-2 px-2 py-1.5"
                  : "flex justify-center p-2"
                }`}
              title={tool.label}
            >
              <span className={`text-xs font-mono ${tool.style}`}>{tool.icon}</span>
              {rightOpen && (
                <span className="text-xs">{tool.label}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 몰입기간 자리 (PR6) — 포스트잇 카드 */}
      <div className="mt-auto px-2 pb-2">
        <div className="postit p-2">
          <div className="text-[9px] text-ink-muted text-center">
            {rightOpen ? "몰입기간" : "🏃"}
          </div>
          {rightOpen && (
            <div className="text-[9px] text-ink-muted/40 text-center">PR6</div>
          )}
        </div>
      </div>
    </div>
  );
}
