"use client";

import { useEffect, useRef } from "react";

interface BlankCanvasProps {
  pageNumber?: number;
}

/**
 * BlankCanvas
 * NOTE 중앙에 채워지는 백지 컨텐츠 (카드/박스 없음)
 *
 * - 커서 자동 포커스 (열자마자 쓰기)
 * - 쪽수 표시: NOTE 하단 중앙에 - n - (오버레이처럼)
 * - 에디터 툴은 RightToolbar에 위치
 *
 * PR4: TipTap 에디터 + 자동 저장 구현
 */
export default function BlankCanvas({ pageNumber = 1 }: BlankCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="relative h-full overflow-hidden p-8">
      {/* 날짜 표기 (헤더가 아닌 컨텐츠 일부처럼) */}
      <div className="mb-6">
        <div className="text-xs text-ink-muted">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "short",
          })}
        </div>
        <div className="mt-0.5 w-12 border-b border-ink/20" />
      </div>

      {/* 백지 내용 영역 */}
      <textarea
        ref={textareaRef}
        placeholder="백지를 펼쳤습니다. 지금 바로 쓰세요."
        className="w-full h-[calc(100%-120px)] bg-transparent border-none outline-none resize-none
          text-sm text-ink leading-relaxed
          placeholder:text-ink-muted/30"
      />

      {/* 쪽수: NOTE 하단 중앙에 오버레이처럼 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[10px] text-ink-muted/40 tracking-widest">
          — {pageNumber} —
        </span>
      </div>
    </div>
  );
}
