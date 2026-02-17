"use client";

/**
 * BlankCanvas — NOTE 중앙 백지 캔버스
 *
 * 구조:
 *  ☆ ← 북마크 (absolute 좌상단 모서리)
 *                              [달리기][서기][탭추가] ← 탭 (absolute 우상단, top border에 붙임)
 *
 *  2026. 02. 17. (화)
 *  ──────────────────  ← 날짜 텍스트 폭만큼의 보더라인
 *
 *  제목 없음
 *  #태그 추가
 *
 *  백지를 펼쳤습니다. 지금 바로 쓰세요.
 *
 *                                  — 1 —
 *
 * - 북마크/탭은 절대 위치 (노트 영역 모서리)
 * - 날짜만 하단 border (텍스트 폭만큼)
 * - 북마크/탭 아래 가로선 없음
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

      {/* ── 북마크 — 노트 좌측 최상단 모서리 (절대 위치) ──────────── */}
      <div className="absolute top-1.5 left-2 z-10">
        <NoteBookmark />
      </div>

      {/* ── 탭 인덱스 — 노트 우상단 top border에 딱 붙임 (절대 위치) */}
      <div className="absolute top-0 right-0 z-10">
        <NoteTabIndexes />
      </div>

      {/* ── 날짜 — 이전 스타일 복원 (inline-block, 텍스트 폭 border) ── */}
      <div className="px-8 pt-8 pb-4 shrink-0">
        <div className="inline-block">
          <div className="text-xs text-ink-muted whitespace-nowrap select-none">
            {(date ? new Date(date + "T00:00:00") : new Date()).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              weekday: "short",
            })}
          </div>
          <div className="mt-0.5 w-full border-b border-ink/20" />
        </div>
      </div>

      {/* ── 타이틀 ──────────────────────────────────────────────── */}
      <div className="px-8 pt-0 pb-0.5 shrink-0">
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
