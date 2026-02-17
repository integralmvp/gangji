import { create } from "zustand";
import type { Page } from "@/types/models";

/**
 * EditorStore — 에디터 전역 상태
 *
 * - editor 인스턴스: RightToolbar에서 도구 명령을 실행하기 위해 공유
 * - currentPage: 현재 편집 중인 페이지
 * - isSaving: 자동 저장 진행 여부
 */

// TipTap Editor 타입 (순환 참조 방지를 위해 any 타입으로 처리)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TipTapEditor = any;

interface EditorState {
  editor: TipTapEditor | null;
  currentPage: Page | null;
  isSaving: boolean;
  lastSavedAt: Date | null;

  setEditor: (editor: TipTapEditor | null) => void;
  setCurrentPage: (page: Page | null) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSavedAt: (date: Date) => void;
}

/**
 * EditorStore
 * - editor 인스턴스는 직렬화되지 않음 (클래스 인스턴스)
 * - Zustand에서 ref-like 패턴으로 사용
 */
export const useEditorStore = create<EditorState>((set) => ({
  editor: null,
  currentPage: null,
  isSaving: false,
  lastSavedAt: null,

  setEditor: (editor) => set({ editor }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
}));
