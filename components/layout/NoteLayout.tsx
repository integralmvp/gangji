"use client";

import { ReactNode } from "react";

interface NoteLayoutProps {
  header: ReactNode;
  main: ReactNode;
  flow: ReactNode;
}

/**
 * NoteLayout
 * 우측 영역 전체를 담당하는 "노트 한 장" 레이아웃
 * 세로 Grid: Header (auto) + Main (1fr) + Flow (auto)
 */
export default function NoteLayout({ header, main, flow }: NoteLayoutProps) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-full bg-paper">
      {/* Header: 노트 제목 줄 */}
      <header className="border-b border-ink/10">{header}</header>

      {/* Main: 달력 또는 백지 에디터 */}
      <main className="overflow-y-auto">{main}</main>

      {/* Flow: 하단 메모칸 */}
      <footer className="border-t border-ink/10">{flow}</footer>
    </div>
  );
}
