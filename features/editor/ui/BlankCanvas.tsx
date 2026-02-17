"use client";

/**
 * BlankCanvas — NOTE 중앙 백지 캔버스
 *
 * 구조 (위→아래):
 *  ┌─────────────────────────────────────────────────────────┐
 *  │ ⭐ 날짜                             [달리기][서기][+]  │  ← 탑바 (bookmark + date + tab stickers)
 *  │─────────────────────────────────────────────────────── │  ← 얇은 구분선
 *  │ 제목 없음                                               │  ← 타이틀 (plain input)
 *  │ #태그 추가                                              │  ← 태그 (plain text-like)
 *  │                                                         │
 *  │ 백지를 펼쳤습니다. 지금 바로 쓰세요.                   │  ← 에디터 (no scroll)
 *  │                                                         │
 *  │                                  — 1 —                 │  ← 쪽수 (absolute, 보조정보)
 *  └─────────────────────────────────────────────────────────┘
 *
 * - 스크롤 없음 (overflow-hidden): 페이지 1장 = 화면 전체
 * - 포커스 흐름: 로드 → title → Enter → editor
 * - 도구 UI는 RightToolbar에만 위치 (여기서 추가 금지)
 */

import { useEffect, useRef } from "react";
import { EditorContent } from "@tiptap/react";
import { useBlankEditor } from "@/features/editor/hooks/useBlankEditor";
import { useEditorStore } from "@/store/editorStore";
import EditorBubbleMenu from "./EditorBubbleMenu";
import NoteBookmark from "./NoteBookmark";
import NoteTabIndexes from "./NoteTabIndexes";
import NoteTitleInput from "./NoteTitleInput";
import NoteTagsInput from "./NoteTagsInput";

interface BlankCanvasProps {
  date?: string;
}

export default function BlankCanvas({ date }: BlankCanvasProps) {
  const { editor, isLoading, focusEditor } = useBlankEditor(date);
  const { currentPage } = useEditorStore();
  const titleRef = useRef<HTMLInputElement>(null);

  // 페이지 로드 완료 → title 포커스
  useEffect(() => {
    if (!isLoading) {
      titleRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="relative h-full overflow-hidden flex flex-col">

      {/* ── 탑바: 북마크 + 날짜 + 탭 인덱스 ─────────────────────── */}
      <div className="flex items-end justify-between px-5 pt-3 pb-0 shrink-0">
        {/* 좌: 북마크 + 날짜 */}
        <div className="flex items-center gap-2">
          <NoteBookmark />
          <span className="text-[11px] text-ink-muted/50 whitespace-nowrap select-none">
            {(date ? new Date(date + "T00:00:00") : new Date()).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              weekday: "short",
            })}
          </span>
        </div>
        {/* 우: 탭 인덱스 스티커 */}
        <NoteTabIndexes />
      </div>

      {/* 구분선 — 탑바와 콘텐츠 사이 */}
      <div className="mx-5 border-b border-ink/10 shrink-0" />

      {/* ── 타이틀 ──────────────────────────────────────────────── */}
      <div className="px-8 pt-4 pb-0.5 shrink-0">
        <NoteTitleInput ref={titleRef} onEnter={focusEditor} />
      </div>

      {/* ── 태그 라인 ────────────────────────────────────────────── */}
      <div className="px-8 pb-3 shrink-0">
        <NoteTagsInput />
      </div>

      {/* ── 에디터 — 스크롤 없음, 남은 공간 채움 ─────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden px-8 pb-6">
        {isLoading ? (
          <div className="h-full">
            <span className="text-sm text-ink-muted/25">
              백지를 펼쳤습니다. 지금 바로 쓰세요.
            </span>
          </div>
        ) : (
          <>
            {editor && <EditorBubbleMenu editor={editor} />}
            <EditorContent editor={editor} className="gangji-editor h-full" />
          </>
        )}
      </div>

      {/* ── 쪽수 — 절대 위치, 하단 중앙, 작고 흐리게 ──────────── */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <span className="text-[10px] text-ink-muted/35 tracking-widest select-none">
          — {currentPage?.pageNumber ?? 1} —
        </span>
      </div>
    </div>
  );
}
