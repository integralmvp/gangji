"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * RightToolbar — 우측 도구 패널
 * - 상단: 뷰 전환 토글 (달력 / 백지)
 * - 에디터 모드: 문서 도구 (굵기/기울/밑줄/헤딩/리스트/하이라이트)
 * - 몰입기간 자리 확보 (PR6에서 구현)
 *
 * - glass blur 반투명
 * - 접힘: 아이콘만 표시
 */
export default function RightToolbar() {
  const { viewMode, setViewMode, rightOpen, toggleRight } = useUIStore();

  const editorTools = [
    { id: "bold", icon: "B", label: "굵게", style: "font-bold" },
    { id: "italic", icon: "I", label: "기울임", style: "italic" },
    { id: "underline", icon: "U", label: "밑줄", style: "underline" },
    { id: "h1", icon: "H1", label: "제목 1", style: "" },
    { id: "h2", icon: "H2", label: "제목 2", style: "" },
    { id: "list", icon: "≡", label: "목록", style: "" },
    { id: "highlight", icon: "▌", label: "형광펜", style: "" },
  ];

  return (
    <div
      className={`h-full glass transition-all duration-200 flex flex-col
        ${rightOpen ? "w-full" : "w-full items-center"}`}
    >
      {/* 토글 버튼 */}
      <button
        onClick={toggleRight}
        className="self-start p-2 m-1 rounded text-ink-muted hover:text-ink transition-colors text-xs"
        title={rightOpen ? "닫기" : "열기"}
      >
        {rightOpen ? "▸" : "◂"}
      </button>

      {/* 뷰 전환 */}
      <div className={`px-2 mb-3 ${rightOpen ? "" : "flex flex-col items-center"}`}>
        {rightOpen && (
          <div className="text-[9px] text-ink-muted mb-1 uppercase tracking-wide">뷰</div>
        )}
        <div className={`flex gap-1 ${rightOpen ? "" : "flex-col"}`}>
          <button
            onClick={() => setViewMode("editor")}
            className={`px-2 py-1 rounded text-xs transition-colors
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
            className={`px-2 py-1 rounded text-xs transition-colors
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

      {/* 구분선 */}
      <div className="mx-2 border-t border-ink/8 mb-3" />

      {/* 에디터 도구 (에디터 모드에서만) */}
      {viewMode === "editor" && (
        <div className={`px-2 flex-1 ${rightOpen ? "" : "flex flex-col items-center"}`}>
          {rightOpen && (
            <div className="text-[9px] text-ink-muted mb-1 uppercase tracking-wide">
              문서 도구
            </div>
          )}
          <div className={`space-y-0.5 ${rightOpen ? "" : ""}`}>
            {editorTools.map((tool) => (
              <button
                key={tool.id}
                className={`rounded text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors
                  ${rightOpen ? "w-full flex items-center gap-2 px-2 py-1.5" : "p-2 flex justify-center w-full"}`}
                title={tool.label}
              >
                <span className={`text-xs font-mono ${tool.style}`}>{tool.icon}</span>
                {rightOpen && (
                  <span className="text-xs">{tool.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 몰입기간 자리 (PR6) */}
      <div className="mt-auto px-2 pb-2">
        {rightOpen && (
          <div className="p-2 rounded border border-ink/8 border-dashed">
            <div className="text-[9px] text-ink-muted text-center">몰입기간</div>
            <div className="text-[9px] text-ink-muted/50 text-center">PR6</div>
          </div>
        )}
      </div>
    </div>
  );
}
