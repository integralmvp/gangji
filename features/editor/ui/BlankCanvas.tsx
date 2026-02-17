"use client";

/**
 * BlankCanvas — NOTE 중앙 백지 컨텐츠
 *
 * - TipTap 에디터 (PR4: 실제 에디터 적용)
 * - 진입 즉시 커서 자동 포커스, 1초 내 타이핑 가능
 * - 500ms debounce 자동 저장
 * - 오늘 날짜 페이지 자동 로드/생성
 * - NOTE 내부: 에디터 + 쪽수만, 그 외 UI 없음
 *
 * 도구 UI는 RightToolbar에 위치 (이 파일에서 삽입 금지)
 */

import { EditorContent } from "@tiptap/react";
import { useBlankEditor } from "@/features/editor/hooks/useBlankEditor";
import { useEditorStore } from "@/store/editorStore";
import EditorBubbleMenu from "./EditorBubbleMenu";

interface BlankCanvasProps {
  date?: string; // 특정 날짜 페이지를 열 때 (달력 클릭)
}

export default function BlankCanvas({ date }: BlankCanvasProps) {
  const { editor, isLoading } = useBlankEditor(date);
  const { currentPage } = useEditorStore();

  return (
    <div className="relative h-full overflow-hidden flex flex-col">
      {/* 날짜 표기 — 작은 컨텍스트 정보 (헤더가 아님) */}
      <div className="px-8 pt-8 pb-4 shrink-0">
        <div className="inline-block">
          <div className="text-xs text-ink-muted whitespace-nowrap">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              weekday: "short",
            })}
          </div>
          <div className="mt-0.5 w-full border-b border-ink/20" />
        </div>
      </div>

      {/* 에디터 영역 — 컨텐츠만, 로딩 중이면 플레이스홀더 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-12">
        {isLoading ? (
          <div className="h-full flex items-start pt-2">
            <span className="text-sm text-ink-muted/30">
              백지를 펼쳤습니다. 지금 바로 쓰세요.
            </span>
          </div>
        ) : (
          <>
            {editor && <EditorBubbleMenu editor={editor} />}
            <EditorContent
              editor={editor}
              className="gangji-editor h-full min-h-[calc(100vh-180px)]"
            />
          </>
        )}
      </div>

      {/* 쪽수 — NOTE 하단 중앙, 작고 흐리게 (UI 아님, 보조 정보) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[10px] text-ink-muted/40 tracking-widest">
          — {currentPage?.pageNumber ?? 1} —
        </span>
      </div>
    </div>
  );
}
