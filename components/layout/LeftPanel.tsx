"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * LeftPanel — 좌측 인덱스 패널
 * - 패널 자체: glass blur 투명 배경
 * - 각 nav 아이템: 포스트잇 카드 + 타이틀에 파스텔 컬러 탭
 */

// 아이템별 파스텔 컬러 (흰기 섞인 낮은 채도)
const NAV_ITEMS = [
  { id: "recent",    icon: "◷", label: "최근",   color: "#EDE9F8", textColor: "#6B5E8A" },
  { id: "run",       icon: "▷", label: "달리기", color: "#FAE9E4", textColor: "#8A4F3E" },
  { id: "stand",     icon: "│", label: "서기",   color: "#E6F5EE", textColor: "#3E7A5A" },
  { id: "sit",       icon: "○", label: "앉기",   color: "#E4EDF8", textColor: "#3E5A8A" },
  { id: "tabs",      icon: "⊟", label: "탭",     color: "#F5F2E0", textColor: "#7A6E3A" },
  { id: "tags",      icon: "⊙", label: "보관소", color: "#F8E9F0", textColor: "#8A3E68" },
  { id: "bookmarks", icon: "◈", label: "북마크", color: "#F5EDE0", textColor: "#8A5E3A" },
  { id: "search",    icon: "⊕", label: "검색",   color: "#E8F5F0", textColor: "#3A7A6A" },
];

export default function LeftPanel() {
  const { leftOpen, toggleLeft } = useUIStore();

  return (
    <div className="h-full glass transition-all duration-200 flex flex-col">
      {/* 토글 버튼 */}
      <button
        onClick={toggleLeft}
        className="self-end p-2 m-1 rounded text-ink-muted hover:text-ink transition-colors text-xs"
        title={leftOpen ? "닫기" : "열기"}
      >
        {leftOpen ? "◂" : "▸"}
      </button>

      {/* Nav Items — 각 아이템이 포스트잇 카드 + 타이틀 파스텔 컬러 탭 */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className="postit w-full flex items-center gap-2 px-2 py-1.5 hover:opacity-90 transition-opacity"
            title={!leftOpen ? item.label : undefined}
          >
            <span className="text-[11px] font-mono text-ink-muted/50 shrink-0">
              {item.icon}
            </span>
            {leftOpen && (
              /* 타이틀 영역 — 포스트잇 컬러 탭 */
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded-sm leading-tight"
                style={{ background: item.color, color: item.textColor }}
              >
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* 하단 브랜드 */}
      {leftOpen && (
        <div className="p-2">
          <div className="postit px-2 py-1.5 text-center">
            <div className="text-[9px] text-ink-muted">Gangji</div>
          </div>
        </div>
      )}
    </div>
  );
}
