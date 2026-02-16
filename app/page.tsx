"use client";

import { useUIStore } from "@/store/uiStore";
import LeftNav from "@/components/layout/LeftNav";
import NoteLayout from "@/components/layout/NoteLayout";
import Header from "@/components/layout/Header";
import FlowSection from "@/components/layout/FlowSection";
import CalendarSection from "@/components/layout/CalendarSection";
import BlankEditor from "@/components/editor/BlankEditor";

/**
 * Main Page - Gangji Layout (Grid 기반)
 *
 * Layout structure: "노트 한 장 + 좌측 인덱스"
 * ┌────────────┬────────────────────────────┐
 * │            │ Header (날짜 + 뷰 전환)     │
 * │            ├────────────────────────────┤
 * │  LeftNav   │                            │
 * │  (20%)     │  Main (Calendar | Editor)  │
 * │            │  (1fr)                     │
 * │            ├────────────────────────────┤
 * │            │ FlowSection (하단 메모칸)   │
 * └────────────┴────────────────────────────┘
 *
 * View switching: calendar ↔ editor (state-based, no routing)
 * Default: editor (immediate writing)
 */
export default function Home() {
  const { viewMode } = useUIStore();

  return (
    <div className="h-screen grid grid-cols-[20%_80%]">
      {/* LeftNav: 노트 인덱스 */}
      <LeftNav />

      {/* NoteLayout: 노트 한 장 */}
      <NoteLayout
        header={<Header />}
        main={
          viewMode === "calendar" ? <CalendarSection /> : <BlankEditor />
        }
        flow={<FlowSection />}
      />
    </div>
  );
}
