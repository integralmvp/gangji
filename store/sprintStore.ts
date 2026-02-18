import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Sprint } from "@/types/models";
import { storage } from "@/lib/storage/storage";

interface SprintState {
  /** 현재 활성 Sprint (endDate 없는 것) */
  currentSprint: Sprint | null;
  /** 전체 Sprint 목록 (달력 누적 표시용) */
  allSprints: Sprint[];
  /** FlowControlPanel에서 선택된 Sprint ID */
  selectedSprintId: string | null;
  isLoading: boolean;

  loadCurrentSprint: () => Promise<void>;
  loadAllSprints: () => Promise<void>;
  selectSprint: (id: string | null) => void;
  saveSprint: (sprint: Sprint) => Promise<void>;
  createNewSprint: (theme: string, startDate: string, endDate?: string) => Promise<Sprint>;
  deleteSprint: (id: string) => Promise<void>;
}

/**
 * SprintStore — 몰입기간(Sprint) 전역 상태
 * - currentSprint: 활성 Sprint
 * - allSprints: 달력 누적 표시용 전체 목록
 * - selectedSprintId: FlowControlPanel 선택 상태
 */
export const useSprintStore = create<SprintState>((set, get) => ({
  currentSprint: null,
  allSprints: [],
  selectedSprintId: null,
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

  loadAllSprints: async () => {
    const sprints = await storage.listSprints();
    // startDate 오름차순 정렬 (생성순)
    const sorted = [...sprints].sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    );
    const current = sorted.find((s) => !s.endDate) ?? null;
    set({ allSprints: sorted, currentSprint: current });
  },

  selectSprint: (id) => set({ selectedSprintId: id }),

  saveSprint: async (sprint: Sprint) => {
    await storage.saveSprint(sprint);
    // allSprints 동기화
    const all = get().allSprints;
    const idx = all.findIndex((s) => s.id === sprint.id);
    const updated = idx >= 0
      ? all.map((s) => (s.id === sprint.id ? sprint : s))
      : [...all, sprint].sort((a, b) => a.startDate.localeCompare(b.startDate));
    const current = updated.find((s) => !s.endDate) ?? null;
    set({ allSprints: updated, currentSprint: current });
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
    const all = [...get().allSprints, sprint].sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    );
    const current = all.find((s) => !s.endDate) ?? null;
    set({ allSprints: all, currentSprint: current, selectedSprintId: sprint.id });
    return sprint;
  },

  deleteSprint: async (id) => {
    await storage.deleteSprint(id);
    const all = get().allSprints.filter((s) => s.id !== id);
    const current = all.find((s) => !s.endDate) ?? null;
    const selectedSprintId = get().selectedSprintId === id ? null : get().selectedSprintId;
    set({ allSprints: all, currentSprint: current, selectedSprintId });
  },
}));
