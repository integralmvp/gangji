"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * RightToolbar — 우측 도구 패널
 * - 패널 자체: glass blur 흰색 투명 배경
 * - 각 섹션 카드: 헤더(타이틀) = 파스텔 컬러, 콘텐츠 = 화이트
 * - 폰트: 흑색(ink) 통일
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

      {/* 뷰 전환 — 헤더 파스텔 컬러, 콘텐츠 화이트 */}
      <div className="px-1.5 mb-2">
        <div
          className="rounded-sm overflow-hidden bg-white"
          style={{ boxShadow: "0 1px 3px rgba(44,44,42,0.10), 0 0.5px 1px rgba(44,44,42,0.06)" }}
        >
          {/* 헤더 — 파스텔 컬러 */}
          <div
            className="flex justify-end px-2 pt-1.5 pb-1"
            style={{ background: COLORS.view.bg }}
          >
            <span className="text-[9px] font-semibold text-ink">
              {rightOpen ? "뷰" : "V"}
            </span>
          </div>
          {/* 콘텐츠 — 화이트 */}
          <div className="p-1.5 space-y-1 bg-white">
            <button
              onClick={() => setViewMode("editor")}
              className={`w-full px-2 py-1 rounded text-xs transition-all text-ink
                ${viewMode === "editor" ? "bg-ink/10 font-medium" : "hover:bg-ink/5 text-ink/60"}`}
              title="백지 보기"
            >
              {rightOpen ? "백지" : "✎"}
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`w-full px-2 py-1 rounded text-xs transition-all text-ink
                ${viewMode === "calendar" ? "bg-ink/10 font-medium" : "hover:bg-ink/5 text-ink/60"}`}
              title="달력 보기"
            >
              {rightOpen ? "달력" : "▦"}
            </button>
          </div>
        </div>
      </div>

      {/* 문서 도구 — 헤더 파스텔 컬러, 콘텐츠 화이트 (에디터 모드에서만) */}
      {viewMode === "editor" && (
        <div className="px-1.5 mb-2 flex-1 min-h-0">
          <div
            className="rounded-sm h-full flex flex-col overflow-hidden bg-white"
            style={{ boxShadow: "0 1px 3px rgba(44,44,42,0.10), 0 0.5px 1px rgba(44,44,42,0.06)" }}
          >
            {/* 헤더 — 파스텔 컬러 */}
            <div
              className="flex justify-end px-2 pt-1.5 pb-1 shrink-0"
              style={{ background: COLORS.tools.bg }}
            >
              <span className="text-[9px] font-semibold text-ink">
                {rightOpen ? "문서 도구" : "T"}
              </span>
            </div>
            {/* 도구 목록 — 화이트 */}
            <div className="p-1.5 space-y-1 overflow-y-auto bg-white">
              {EDITOR_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  className={`w-full rounded text-ink/70 hover:text-ink hover:bg-ink/5 transition-all
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

      {/* 몰입기간 자리 (PR6) — 헤더 파스텔 컬러, 콘텐츠 화이트 */}
      <div className="mt-auto px-1.5 pb-2">
        <div
          className="rounded-sm overflow-hidden bg-white"
          style={{ boxShadow: "0 1px 3px rgba(44,44,42,0.10), 0 0.5px 1px rgba(44,44,42,0.06)" }}
        >
          {/* 헤더 — 파스텔 컬러 */}
          <div
            className="flex justify-end px-2 pt-1.5 pb-1"
            style={{ background: COLORS.flow.bg }}
          >
            <span className="text-[9px] font-semibold text-ink">
              {rightOpen ? "몰입기간" : "F"}
            </span>
          </div>
          <div className="p-2 bg-white">
            <div className="text-[9px] text-ink-muted/40 text-center">PR6</div>
          </div>
        </div>
      </div>
    </div>
  );
}
