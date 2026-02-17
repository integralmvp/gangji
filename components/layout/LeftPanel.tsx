"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * LeftPanel — 좌측 인덱스 패널
 * - 패널 자체: glass blur 투명 배경
 * - 각 nav 아이템: 포스트잇 카드 스타일
 */
export default function LeftPanel() {
  const { leftOpen, toggleLeft } = useUIStore();

  const navItems = [
    { id: "recent", icon: "◷", label: "최근" },
    { id: "run", icon: "▷", label: "달리기" },
    { id: "stand", icon: "│", label: "서기" },
    { id: "sit", icon: "○", label: "앉기" },
    { id: "tabs", icon: "⊟", label: "탭" },
    { id: "tags", icon: "⊙", label: "보관소" },
    { id: "bookmarks", icon: "◈", label: "북마크" },
    { id: "search", icon: "⊕", label: "검색" },
  ];

  return (
    <div className={`h-full glass transition-all duration-200 flex flex-col`}>
      {/* 토글 버튼 */}
      <button
        onClick={toggleLeft}
        className="self-end p-2 m-1 rounded text-ink-muted hover:text-ink transition-colors text-xs"
        title={leftOpen ? "닫기" : "열기"}
      >
        {leftOpen ? "◂" : "▸"}
      </button>

      {/* Nav Items — 각 아이템이 포스트잇 카드 */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`postit w-full flex items-center gap-2 px-2 py-2
              text-ink-muted hover:text-ink transition-colors
              ${leftOpen ? "" : "justify-center"}`}
            title={!leftOpen ? item.label : undefined}
          >
            <span className="text-xs font-mono opacity-60">{item.icon}</span>
            {leftOpen && (
              <span className="text-xs">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* 하단 브랜드 — 포스트잇 카드 */}
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
