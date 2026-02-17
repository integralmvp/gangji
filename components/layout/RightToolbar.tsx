"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * RightToolbar — 우측 도구 패널
 * - 패널 자체: glass blur 투명 배경
 * - 뷰 섹션: 포스트잇 카드, 타이틀 우측 배치 + 파스텔 컬러 탭
 * - 문서 도구: 하나의 긴 포스트잇 카드에 타이틀 + 모든 도구 통합
 * - 타이틀별 서로 다른 파스텔 컬러
 */

const EDITOR_TOOLS = [
  { id: "bold",      icon: "B",  label: "굵게",   style: "font-bold" },
  { id: "italic",    icon: "I",  label: "기울임", style: "italic" },
  { id: "underline", icon: "U",  label: "밑줄",   style: "underline" },
  { id: "h1",        icon: "H1", label: "제목 1", style: "" },
  { id: "h2",        icon: "H2", label: "제목 2", style: "" },
  { id: "list",      icon: "≡",  label: "목록",   style: "" },
  { id: "highlight", icon: "▌",  label: "형광펜", style: "" },
];

// 섹션별 파스텔 컬러
const COLORS = {
  view:   { bg: "#EDE9F8", text: "#6B5E8A" }, // soft lavender
  tools:  { bg: "#E4EDF8", text: "#3E5A8A" }, // soft sky blue
  flow:   { bg: "#F5F2E0", text: "#7A6E3A" }, // soft warm yellow
};

export default function RightToolbar() {
  const { viewMode, setViewMode, rightOpen, toggleRight } = useUIStore();

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

      {/* 뷰 전환 — 포스트잇 카드, 타이틀 우측 */}
      <div className="px-2 mb-2">
        <div className="postit overflow-hidden">
          {/* 타이틀 — 우측 정렬, 파스텔 컬러 탭 */}
          <div className="flex justify-end px-2 pt-1.5 pb-1 border-b border-ink/6">
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm"
              style={{ background: COLORS.view.bg, color: COLORS.view.text }}
            >
              {rightOpen ? "뷰" : "V"}
            </span>
          </div>
          {/* 내용 */}
          <div className="p-1.5 space-y-1">
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
      </div>

      {/* 문서 도구 — 하나의 긴 포스트잇에 타이틀 + 모든 도구 (에디터 모드에서만) */}
      {viewMode === "editor" && (
        <div className="px-2 mb-2 flex-1 min-h-0">
          <div className="postit h-full flex flex-col overflow-hidden">
            {/* 타이틀 — 우측 정렬, 파스텔 컬러 탭 */}
            <div className="flex justify-end px-2 pt-1.5 pb-1 border-b border-ink/6 shrink-0">
              <span
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm"
                style={{ background: COLORS.tools.bg, color: COLORS.tools.text }}
              >
                {rightOpen ? "문서 도구" : "T"}
              </span>
            </div>
            {/* 도구 목록 */}
            <div className="p-1.5 space-y-1 overflow-y-auto">
              {EDITOR_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  className={`w-full rounded text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors
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
          </div>
        </div>
      )}

      {/* 몰입기간 자리 (PR6) — 포스트잇 카드, 타이틀 우측 */}
      <div className="mt-auto px-2 pb-2">
        <div className="postit overflow-hidden">
          <div className="flex justify-end px-2 pt-1.5 pb-1 border-b border-ink/6">
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm"
              style={{ background: COLORS.flow.bg, color: COLORS.flow.text }}
            >
              {rightOpen ? "몰입기간" : "F"}
            </span>
          </div>
          <div className="p-2">
            <div className="text-[9px] text-ink-muted/40 text-center">PR6</div>
          </div>
        </div>
      </div>
    </div>
  );
}
