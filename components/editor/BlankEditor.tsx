"use client";

import { useEffect, useRef } from "react";

/**
 * BlankEditor Component (Placeholder)
 *
 * The core of Gangji: "Open and immediately write"
 *
 * PR4: Full implementation with:
 * - TipTap rich text editor
 * - Auto-focus on mount
 * - Auto-save (500ms debounce)
 * - Metadata (title, tabs, tags, bookmark)
 * - Bundle support
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
    <div className="flex-1 p-8 bg-paper overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Paper-like editor area */}
        <div className="bg-white rounded-lg shadow-sm p-12 min-h-[842px] border border-paper-dark">
          {/* Title (optional) */}
          <input
            type="text"
            placeholder="무제"
            className="w-full text-3xl font-bold text-ink bg-transparent border-none outline-none mb-8 placeholder:text-ink-light/30"
          />

          {/* Content area (Placeholder - PR4 will use TipTap) */}
          <textarea
            ref={textareaRef}
            placeholder="백지를 펼쳤습니다. 지금 바로 쓰세요."
            className="w-full min-h-[600px] text-lg text-ink bg-transparent border-none outline-none resize-none placeholder:text-ink-light/30 leading-relaxed"
          />

          {/* Implementation note */}
          <div className="mt-8 pt-4 border-t border-paper-dark text-sm text-ink-light">
            <p>PR4에서 TipTap 에디터 + 자동 저장 구현 예정</p>
            <p className="mt-1">현재는 구조 확인용 플레이스홀더입니다</p>
          </div>
        </div>

        {/* Metadata section (minimal, optional) */}
        <div className="mt-6 flex gap-4 text-sm text-ink-light">
          <button className="px-3 py-1 rounded bg-paper-light hover:bg-paper-dark transition-colors">
            + 탭
          </button>
          <button className="px-3 py-1 rounded bg-paper-light hover:bg-paper-dark transition-colors">
            + 태그
          </button>
          <button className="px-3 py-1 rounded bg-paper-light hover:bg-paper-dark transition-colors">
            ⭐ 북마크
          </button>
        </div>
      </div>
    </div>
  );
}
