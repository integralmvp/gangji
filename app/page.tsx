"use client";

import { useUIStore } from "@/store/uiStore";
import LeftNav from "@/components/layout/LeftNav";
import NoteLayout from "@/components/layout/NoteLayout";
import Header from "@/components/layout/Header";
import FlowSection from "@/components/layout/FlowSection";
import CalendarSection from "@/components/layout/CalendarSection";
import BlankEditor from "@/components/editor/BlankEditor";

/**
 * Main Page - Gangji Layout (1-screen fixed, no scroll)
 *
 * Layout structure: "노트 한 장 + 포스트잇 인덱스"
 * ┌────────────┬────────────────────────────┐
 * │ LogoSlot   │ NoteHeader                 │ <- 같은 높이
 * ├────────────┼────────────────────────────┤
 * │            │                            │
 * │ IndexTabs  │ Calendar/Editor (1fr)      │
 * │ (포스트잇)  │                            │
 * │            ├────────────────────────────┤
 * │            │ Memo (editor 시 숨김)       │
 * └────────────┴────────────────────────────┘
 *
 * - 전체 100vh, overflow hidden (스크롤 없는 고정 화면)
 * - 좌측 20%: 포스트잇 인덱스 탭
 * - 우측 80%: 노트 한 장
 */
export default function Home() {
  const { viewMode } = useUIStore();

  return (
    <div className="h-screen overflow-hidden grid grid-cols-[20%_80%]">
      {/* LeftNav: 포스트잇 인덱스 */}
      <LeftNav />

      {/* NoteLayout: 노트 한 장 */}
      <NoteLayout
        header={<Header />}
        main={
          viewMode === "calendar" ? <CalendarSection /> : <BlankEditor />
        }
        flow={viewMode === "calendar" ? <FlowSection /> : null}
      />
    </div>
  );
}
