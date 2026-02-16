"use client";

import { useEffect, useRef } from "react";

/**
 * BlankEditor Component (Placeholder)
 * "열자마자 쓰기" - 백지 몰입
 *
 * PR3: 그리드 기반 1-screen 레이아웃 (스크롤 없이 한 페이지 전체 보임)
 * PR4: TipTap 에디터 + 자동 저장 구현
 *
 * Design: A4 paper feel, zero friction
 */
export default function BlankEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount (immediate writing experience)
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="h-full overflow-hidden bg-paper grid place-items-center p-6">
      <div className="w-full max-w-4xl h-full grid grid-rows-[1fr_auto]">
        {/* Paper-like editor area */}
        <div className="bg-white rounded-md shadow-sm p-6 border border-ink/10 grid grid-rows-[auto_1fr_auto] overflow-hidden">
          {/* Title (optional) */}
          <input
            type="text"
            placeholder="무제"
            className="w-full text-xl font-bold text-ink bg-transparent border-none outline-none mb-4 placeholder:text-ink-muted/40"
          />

          {/* Content area (Placeholder - PR4 will use TipTap) */}
          <textarea
            ref={textareaRef}
            placeholder="백지를 펼쳤습니다. 지금 바로 쓰세요."
            className="w-full text-sm text-ink bg-transparent border-none outline-none resize-none placeholder:text-ink-muted/40 leading-relaxed"
          />

          {/* Implementation note */}
          <div className="mt-3 pt-3 border-t border-ink/10 text-[10px] text-ink-muted">
            <p>PR4에서 TipTap 에디터 + 자동 저장 구현</p>
          </div>
        </div>

        {/* Metadata section (minimal, optional) */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <button className="px-2 py-1 rounded bg-paper-light hover:bg-paper-dark transition-colors text-ink-muted border border-ink/10">
            + 탭
          </button>
          <button className="px-2 py-1 rounded bg-paper-light hover:bg-paper-dark transition-colors text-ink-muted border border-ink/10">
            + 태그
          </button>
          <button className="px-2 py-1 rounded bg-paper-light hover:bg-paper-dark transition-colors text-ink-muted border border-ink/10">
            ⭐ 북마크
          </button>
        </div>
      </div>
    </div>
  );
}
