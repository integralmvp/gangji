"use client";

import { useUIStore } from "@/store/uiStore";
import LeftPanel from "@/components/layout/LeftPanel";
import RightToolbar from "@/components/layout/RightToolbar";
import CalendarCanvas from "@/features/calendar/ui/CalendarCanvas";
import BlankCanvas from "@/features/editor/ui/BlankCanvas";

/**
 * Main Page — 인쇄소 노트 레이아웃
 *
 * ┌──────────┬──────────────────────────────┬──────────┐
 * │ LeftPanel │         NOTE (center)        │ RightBar │
 * │  ~10%    │           ~80%               │  ~10%    │
 * │  (glass) │  CalendarCanvas / BlankCanvas │  (glass) │
 * └──────────┴──────────────────────────────┴──────────┘
 *
 * - 100vh 고정, 스크롤 없음
 * - 좌/우 패널은 접힘/열림 (glass blur)
 * - 중앙 NOTE: 헤더/푸터 없음, 콘텐츠만
 */
export default function Home() {
  const { viewMode, leftOpen, rightOpen, selectedDate } = useUIStore();

  const leftWidth = leftOpen ? "160px" : "48px";
  const rightWidth = rightOpen ? "160px" : "48px";

  return (
    <div
      className="h-screen overflow-hidden bg-app grid"
      style={{ gridTemplateColumns: `${leftWidth} 1fr ${rightWidth}` }}
    >
      {/* 좌측 인덱스 패널 */}
      <LeftPanel />

      {/* 중앙 NOTE 영역 */}
      <main className="h-full overflow-hidden bg-note">
        {viewMode === "calendar" ? (
          <CalendarCanvas />
        ) : (
          // selectedDate가 있으면 해당 날짜, 없으면 오늘 로드
          <BlankCanvas date={selectedDate ?? undefined} />
        )}
      </main>

      {/* 우측 도구 패널 */}
      <RightToolbar />
    </div>
  );
}
