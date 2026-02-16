import { create } from "zustand";

/**
 * View mode: 'calendar' or 'editor'
 * - calendar: 3-month calendar view showing flow traces
 * - editor: blank editor view for immediate writing
 */
export type ViewMode = "calendar" | "editor";

interface UIState {
  // View state
  viewMode: ViewMode;
  isLeftNavOpen: boolean;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  toggleLeftNav: () => void;
}

/**
 * UI Store
 *
 * Manages UI-only state (no business logic)
 * - View switching (calendar ↔ editor)
 * - LeftNav open/close state
 */
export const useUIStore = create<UIState>((set) => ({
  // Default to 'editor' for immediate writing experience
  viewMode: "editor",
  isLeftNavOpen: true,

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === "calendar" ? "editor" : "calendar",
    })),

  toggleLeftNav: () => set((state) => ({ isLeftNavOpen: !state.isLeftNavOpen })),
}));
