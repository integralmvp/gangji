"use client";

/**
 * useBlankEditor — 백지 에디터 핵심 훅
 *
 * - TipTap 에디터 초기화 (extensions 포함)
 * - 오늘 날짜 페이지 자동 로드/생성
 * - 500ms debounce 자동 저장
 * - 에디터 인스턴스를 editorStore에 등록 (RightToolbar 연결용)
 * - auto-focus 제거: 포커스는 BlankCanvas가 직접 제어 (title → editor 순)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import { useEditorStore } from "@/store/editorStore";
import { storage } from "@/lib/storage/storage";
import { loadOrCreateTodayPage, loadOrCreatePageByDate } from "../utils/pageUtils";
import type { Page } from "@/types/models";

const AUTOSAVE_DELAY = 500;

export function useBlankEditor(date?: string) {
  const { setEditor, setCurrentPage, setIsSaving, setLastSavedAt } =
    useEditorStore();

  const currentPageRef = useRef<Page | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 저장 함수 (페이지 ref 사용하여 최신 page 참조)
  const scheduleSave = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (editor: any) => {
      const page = currentPageRef.current;
      if (!page) return;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          const content = JSON.stringify(editor.getJSON());
          const updated: Page = { ...page, content };
          await storage.savePage(updated);
          currentPageRef.current = updated;
          setLastSavedAt(new Date());
        } finally {
          setIsSaving(false);
        }
      }, AUTOSAVE_DELAY);
    },
    [setIsSaving, setLastSavedAt]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "백지를 펼쳤습니다. 지금 바로 쓰세요.",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "",
    autofocus: false, // BlankCanvas가 title → editor 순서로 포커스 제어
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      scheduleSave(editor);
    },
  });

  // 에디터 포커스 함수 (BlankCanvas에서 title Enter 후 호출)
  const focusEditor = useCallback(() => {
    editor?.commands.focus("start");
  }, [editor]);

  // 페이지 로드 (오늘 또는 특정 날짜)
  useEffect(() => {
    if (!editor) return;

    setIsLoading(true);

    const loadPage = date
      ? loadOrCreatePageByDate(date)
      : loadOrCreateTodayPage();

    loadPage.then((page) => {
      currentPageRef.current = page;
      setCurrentPage(page);

      try {
        const json = JSON.parse(page.content);
        editor.commands.setContent(json);
      } catch {
        editor.commands.setContent("");
      }

      setIsLoading(false);
      // 포커스는 BlankCanvas의 onLoadComplete 콜백에서 처리
    });
  }, [editor, date, setCurrentPage]);

  // editorStore에 인스턴스 등록
  useEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  // 언마운트 시 pending save 즉시 실행
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        const page = currentPageRef.current;
        if (page && editor) {
          const content = JSON.stringify(editor.getJSON());
          storage.savePage({ ...page, content }).catch(() => {});
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { editor, isLoading, focusEditor };
}
