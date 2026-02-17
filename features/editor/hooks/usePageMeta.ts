"use client";

/**
 * usePageMeta — 페이지 메타데이터 CRUD 훅
 *
 * - editorStore.currentPage를 읽어 메타데이터 업데이트
 * - 모든 변경은 300ms debounce 후 IndexedDB에 자동 저장
 * - 저장 버튼 없음 / 입력 흐름 방해 없음
 *
 * 제공 액션: updateTitle, addTag/removeTag, addTab/removeTab/toggleTab,
 *            toggleBookmark, toggleBundle
 */

import { useCallback, useRef } from "react";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/editorStore";
import { storage } from "@/lib/storage/storage";
import type { Page } from "@/types/models";

const META_SAVE_DELAY = 300;

export function usePageMeta() {
  const { currentPage, setCurrentPage } = useEditorStore();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounce 저장
  const saveDebounced = useCallback((updated: Page) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      storage.savePage(updated).catch(() => {});
    }, META_SAVE_DELAY);
  }, []);

  // 변경 → store + storage 동기화
  const updatePage = useCallback(
    (changes: Partial<Page>) => {
      if (!currentPage) return;
      const updated: Page = { ...currentPage, ...changes };
      setCurrentPage(updated);
      saveDebounced(updated);
    },
    [currentPage, setCurrentPage, saveDebounced]
  );

  // ── title ──────────────────────────────────────────────────────────────────
  const updateTitle = useCallback(
    (title: string) => updatePage({ title: title || undefined }),
    [updatePage]
  );

  // ── tags ───────────────────────────────────────────────────────────────────
  const addTag = useCallback(
    (raw: string) => {
      if (!currentPage) return;
      const tag = raw.trim().replace(/^#/, "");
      if (!tag || currentPage.tags.includes(tag)) return;
      updatePage({ tags: [...currentPage.tags, tag] });
    },
    [currentPage, updatePage]
  );

  const removeTag = useCallback(
    (tag: string) => {
      if (!currentPage) return;
      updatePage({ tags: currentPage.tags.filter((t) => t !== tag) });
    },
    [currentPage, updatePage]
  );

  // ── tabs ───────────────────────────────────────────────────────────────────
  const addTab = useCallback(
    (tab: string) => {
      if (!currentPage || currentPage.tabs.includes(tab)) return;
      updatePage({ tabs: [...currentPage.tabs, tab] });
    },
    [currentPage, updatePage]
  );

  const removeTab = useCallback(
    (tab: string) => {
      if (!currentPage) return;
      updatePage({ tabs: currentPage.tabs.filter((t) => t !== tab) });
    },
    [currentPage, updatePage]
  );

  const toggleTab = useCallback(
    (tab: string) => {
      if (!currentPage) return;
      if (currentPage.tabs.includes(tab)) {
        removeTab(tab);
      } else {
        addTab(tab);
      }
    },
    [currentPage, addTab, removeTab]
  );

  // ── bookmark ───────────────────────────────────────────────────────────────
  const toggleBookmark = useCallback(() => {
    if (!currentPage) return;
    updatePage({ bookmarked: !currentPage.bookmarked });
  }, [currentPage, updatePage]);

  // ── bundle (이어쓰기) ──────────────────────────────────────────────────────
  const toggleBundle = useCallback(() => {
    if (!currentPage) return;
    updatePage({ bundleId: currentPage.bundleId ? undefined : nanoid() });
  }, [currentPage, updatePage]);

  return {
    currentPage,
    updateTitle,
    addTag,
    removeTag,
    addTab,
    removeTab,
    toggleTab,
    toggleBookmark,
    toggleBundle,
  };
}
