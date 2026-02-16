"use client";

import { useEffect, useRef } from "react";

/**
 * BlankEditor Component (Placeholder)
 * "열자마자 쓰기" - 백지 몰입
 *
 * PR3: 1-screen 레이아웃 (내부 스크롤)
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
    <div className="h-full overflow-y-auto bg-paper">
      <div className="max-w-4xl mx-auto px-8 py-6">
        {/* Paper-like editor area */}
        <div className="bg-white rounded-md shadow-sm p-8 min-h-[600px] border border-ink/10">
          {/* Title (optional) */}
          <input
            type="text"
            placeholder="무제"
            className="w-full text-2xl font-bold text-ink bg-transparent border-none outline-none mb-6 placeholder:text-ink-muted/40"
          />

          {/* Content area (Placeholder - PR4 will use TipTap) */}
          <textarea
            ref={textareaRef}
            placeholder="백지를 펼쳤습니다. 지금 바로 쓰세요."
            className="w-full min-h-[500px] text-base text-ink bg-transparent border-none outline-none resize-none placeholder:text-ink-muted/40 leading-relaxed"
          />

          {/* Implementation note */}
          <div className="mt-6 pt-4 border-t border-ink/10 text-xs text-ink-muted">
            <p>PR4에서 TipTap 에디터 + 자동 저장 구현</p>
          </div>
        </div>

        {/* Metadata section (minimal, optional) */}
        <div className="mt-4 flex gap-3 text-sm">
          <button className="px-3 py-1.5 rounded bg-paper-light hover:bg-paper-dark transition-colors text-ink-muted border border-ink/10">
            + 탭
          </button>
          <button className="px-3 py-1.5 rounded bg-paper-light hover:bg-paper-dark transition-colors text-ink-muted border border-ink/10">
            + 태그
          </button>
          <button className="px-3 py-1.5 rounded bg-paper-light hover:bg-paper-dark transition-colors text-ink-muted border border-ink/10">
            ⭐ 북마크
          </button>
        </div>
      </div>
    </div>
  );
}
