import { create } from "zustand";

/**
 * View mode: 'calendar' or 'editor'
 * - calendar: 달력 보기 (흐름 지도)
 * - editor: 백지 보기 (즉시 쓰기)
 */
export type ViewMode = "calendar" | "editor";

interface UIState {
  viewMode: ViewMode;
  leftOpen: boolean;
  rightOpen: boolean;
  /** 달력에서 선택된 날짜 (YYYY-MM-DD). null이면 오늘 날짜. */
  selectedDate: string | null;

  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  toggleLeft: () => void;
  toggleRight: () => void;
}

/**
 * UI Store — UI 상태만 담당 (비즈니스 로직 없음)
 * - 뷰 전환 (calendar ↔ editor)
 * - 좌/우 패널 열림/닫힘
 * - selectedDate: 달력에서 선택한 날짜
 */
export const useUIStore = create<UIState>((set) => ({
  viewMode: "editor", // 기본값: 즉시 쓰기
  leftOpen: true,
  rightOpen: true,
  selectedDate: null,

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === "calendar" ? "editor" : "calendar",
    })),

  toggleLeft: () => set((state) => ({ leftOpen: !state.leftOpen })),
  toggleRight: () => set((state) => ({ rightOpen: !state.rightOpen })),
}));
