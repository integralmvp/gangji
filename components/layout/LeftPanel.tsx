"use client";

import { useUIStore } from "@/store/uiStore";

/**
 * LeftPanel — 좌측 인덱스 패널
 * - 패널 자체: glass blur 흰색 투명 배경
 * - 각 nav 아이템: 아이콘+타이틀 좌측 반 = 파스텔 컬러, 우측 나머지 = 화이트
 * - 폰트: 흑색(ink) 통일
 */

// 아이템별 파스텔 컬러
const NAV_ITEMS = [
  { id: "recent",    icon: "◷", label: "최근",   color: "#EDE9F8" },
  { id: "run",       icon: "▷", label: "달리기", color: "#FAE9E4" },
  { id: "stand",     icon: "│", label: "서기",   color: "#E6F5EE" },
  { id: "sit",       icon: "○", label: "앉기",   color: "#E4EDF8" },
  { id: "tabs",      icon: "⊟", label: "탭",     color: "#F5F2E0" },
  { id: "tags",      icon: "⊙", label: "보관소", color: "#F8E9F0" },
  { id: "bookmarks", icon: "◈", label: "북마크", color: "#F5EDE0" },
  { id: "search",    icon: "⊕", label: "검색",   color: "#E8F5F0" },
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

      {/* Nav Items — 좌측 컬러 영역 + 우측 화이트 영역 */}
      <nav className="flex-1 px-1.5 space-y-1 overflow-y-auto py-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className="w-full flex rounded-sm overflow-hidden hover:brightness-95 active:brightness-90 transition-all text-ink"
            style={{
              boxShadow: "0 1px 3px rgba(44,44,42,0.10), 0 0.5px 1px rgba(44,44,42,0.06)",
            }}
            title={!leftOpen ? item.label : undefined}
          >
            {leftOpen ? (
              /* 펼침 상태: 좌측 절반 컬러 + 우측 절반 화이트 */
              <>
                <span
                  className="flex items-center gap-2 px-2 py-1.5 w-1/2"
                  style={{ background: item.color }}
                >
                  <span className="text-[11px] font-mono text-ink/60 shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-xs font-medium text-ink leading-tight truncate">
                    {item.label}
                  </span>
                </span>
                <span className="w-1/2 bg-white" />
              </>
            ) : (
              /* 접힘 상태: 전체 컬러 (아이콘만) */
              <span
                className="flex items-center justify-center w-full py-1.5"
                style={{ background: item.color }}
              >
                <span className="text-[11px] font-mono text-ink/60">
                  {item.icon}
                </span>
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* 하단 브랜드 */}
      {leftOpen && (
        <div className="p-2">
          <div className="text-[25px] text-ink-muted">Gangji</div>
        </div>
      )}
    </div>
  );
}
