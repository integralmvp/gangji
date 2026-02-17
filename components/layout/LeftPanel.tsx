"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * LeftPanel — 좌측 인덱스 패널
 * 탐색/정리: Recent / 몰입탭 / Tags / Bookmarks / Search
 *
 * - glass blur 반투명 (존재감 최소, 중앙 NOTE가 주인공)
 * - 접힘: 아이콘만 표시
 * - 모바일: overlay drawer (추후 PR)
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
    <div
      className={`h-full glass transition-all duration-200 flex flex-col
        ${leftOpen ? "w-full" : "w-full items-center"}`}
    >
      {/* 토글 버튼 */}
      <button
        onClick={toggleLeft}
        className="self-end p-2 m-1 rounded text-ink-muted hover:text-ink transition-colors text-xs"
        title={leftOpen ? "닫기" : "열기"}
      >
        {leftOpen ? "◂" : "▸"}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left
              text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors
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

      {/* 하단: 설정/정보 */}
      {leftOpen && (
        <div className="p-2 border-t border-ink/8">
          <div className="text-[9px] text-ink-muted text-center">Gangji</div>
        </div>
      )}
    </div>
  );
}
