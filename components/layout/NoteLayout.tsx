"use client";

import { ReactNode } from "react";

interface NoteLayoutProps {
  header: ReactNode;
  main: ReactNode;
  flow: ReactNode | null;
}

/**
 * NoteLayout
 * 우측 영역 전체를 담당하는 "노트 한 장" 레이아웃
 * 세로 Grid: Header (auto) + Main (1fr) + Flow (auto, 조건부)
 * - editor 모드: flow 숨김 (백지 몰입)
 * - calendar 모드: flow 표시 (메모칸)
 */
export default function NoteLayout({ header, main, flow }: NoteLayoutProps) {
  return (
    <div
      className={`h-full bg-paper ${
        flow ? "grid grid-rows-[auto_1fr_auto]" : "grid grid-rows-[auto_1fr]"
      }`}
    >
      {/* Header: 노트 제목 줄 (고정 높이) */}
      <header className="border-b border-ink/10">{header}</header>

      {/* Main: 달력 또는 백지 에디터 */}
      <main className="overflow-hidden">{main}</main>

      {/* Flow: 하단 메모칸 (조건부) */}
      {flow && <footer className="border-t border-ink/10">{flow}</footer>}
    </div>
  );
}
