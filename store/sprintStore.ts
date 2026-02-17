import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Sprint } from "@/types/models";
import { storage } from "@/lib/storage/storage";

interface SprintState {
  currentSprint: Sprint | null;
  isLoading: boolean;

  loadCurrentSprint: () => Promise<void>;
  saveSprint: (sprint: Sprint) => Promise<void>;
  createNewSprint: (theme: string, startDate: string, endDate?: string) => Promise<Sprint>;
  deleteSprint: (id: string) => Promise<void>;
}

/**
 * SprintStore — 몰입기간(Sprint) 전역 상태
 * - 현재 활성 Sprint 1개를 기본 단위로 관리
 * - 히스토리 다중 관리는 Phase B
 */
export const useSprintStore = create<SprintState>((set) => ({
  currentSprint: null,
  isLoading: false,

  loadCurrentSprint: async () => {
    set({ isLoading: true });
    try {
      const sprint = await storage.getCurrentSprint();
      set({ currentSprint: sprint });
    } finally {
      set({ isLoading: false });
    }
  },

  saveSprint: async (sprint: Sprint) => {
    await storage.saveSprint(sprint);
    set({ currentSprint: sprint });
  },

  createNewSprint: async (theme, startDate, endDate) => {
    const now = new Date().toISOString();
    const sprint: Sprint = {
      id: nanoid(),
      theme,
      startDate,
      endDate,
      periods: [],
      createdAt: now,
      updatedAt: now,
    };
    await storage.saveSprint(sprint);
    set({ currentSprint: sprint });
    return sprint;
  },

  deleteSprint: async (id) => {
    await storage.deleteSprint(id);
    set({ currentSprint: null });
  },
}));
