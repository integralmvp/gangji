"use client";

/**
 * NoteTabIndexes — 노트 탭 인덱스 스티커
 *
 * NOTE 우측 상단에 붙는 인덱스 스티커.
 * 실제 노트에 인덱스 스티커를 꽂은 것처럼 보임 (위젯/버튼 느낌 금지).
 *
 * - 탭은 우측부터 왼쪽 방향으로 누적 배치
 * - 모양: 뒤집어진 사다리꼴 + 곡선 (CSS clip-path)
 * - (+) 클릭 → 미니 팝오버로 탭 선택 (run/stand/sit)
 * - 탭 클릭 → 해당 탭 토글(제거)
 */

import React, { useRef, useState, useEffect } from "react";
import { usePageMeta } from "@/features/editor/hooks/usePageMeta";

const TAB_OPTIONS = [
  {
    id: "run",
    label: "달리기",
    bg: "#FDE68A",      // 따뜻한 노랑
    border: "#F5C842",
    text: "#92710A",
  },
  {
    id: "stand",
    label: "서기",
    bg: "#DDD6FE",      // 소프트 라벤더
    border: "#B8A9F5",
    text: "#5B4E8A",
  },
  {
    id: "sit",
    label: "앉기",
    bg: "#A7F3D0",      // 소프트 민트
    border: "#6EE7B7",
    text: "#065F46",
  },
] as const;

export default function NoteTabIndexes() {
  const { currentPage, toggleTab } = usePageMeta();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const activeTabs = currentPage?.tabs ?? [];
  const availableTabs = TAB_OPTIONS.filter((t) => !activeTabs.includes(t.id));
  const activeTabDefs = TAB_OPTIONS.filter((t) => activeTabs.includes(t.id));

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !addBtnRef.current?.contains(e.target as Node)
      ) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  return (
    // gap = 탭 가로 길이(80px)만큼 띄움
    <div className="flex items-start" style={{ gap: "80px" }}>
      {/* 활성 탭 (좌→우 배치 — container가 right-0이므로 우측부터 누적) */}
      {activeTabDefs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => toggleTab(tab.id)}
          title={`${tab.label} 탭 제거`}
          className="note-tab-sticker group"
          style={
            {
              "--tab-color": tab.bg,
              color: tab.text,
            } as React.CSSProperties
          }
        >
          <span className="note-tab-sticker-label">{tab.label}</span>
          {/* hover 시 × 표시 */}
          <span className="note-tab-sticker-remove">×</span>
        </button>
      ))}

      {/* + 탭 추가 버튼 */}
      {currentPage && availableTabs.length > 0 && (
        <div className="relative">
          <button
            ref={addBtnRef}
            onClick={() => setShowPopover((v) => !v)}
            title="탭 추가"
            className="note-tab-sticker note-tab-sticker--add"
          >
            <span className="note-tab-sticker-label">탭추가</span>
          </button>

          {/* 미니 팝오버 */}
          {showPopover && (
            <div
              ref={popoverRef}
              className="absolute right-0 top-full mt-1 z-50
                bg-white/95 backdrop-blur-sm rounded-md shadow-lg
                border border-ink/10 py-1 min-w-[80px]"
            >
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    toggleTab(tab.id);
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5
                    text-xs text-ink/70 hover:bg-ink/5 transition-colors"
                >
                  <span
                    className="w-2.5 h-2.5 items-center rounded-sm shrink-0"
                    style={{ backgroundColor: tab.bg, border: `1px solid ${tab.border}` }}
                  />
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
