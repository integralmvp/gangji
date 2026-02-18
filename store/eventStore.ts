import { create } from "zustand";
import { nanoid } from "nanoid";
import type { CalendarEvent } from "@/types/models";
import { storage } from "@/lib/storage/storage";

interface EventState {
  /** 모달이 열린 날짜 (YYYY-MM-DD). null이면 모달 닫힘 */
  modalDate: string | null;
  /** 3개월 범위 이벤트 캐시: date → CalendarEvent[] */
  eventsByDate: Record<string, CalendarEvent[]>;

  openModal: (date: string) => void;
  closeModal: () => void;

  /** 날짜 범위 이벤트 로드 (달력 렌더용) */
  loadEventsByDateRange: (startDate: string, endDate: string) => Promise<void>;

  /** 이벤트 저장 후 캐시 갱신 */
  saveEvent: (date: string, text: string) => Promise<void>;

  /** 이벤트 삭제 후 캐시 갱신 */
  deleteEvent: (id: string, date: string) => Promise<void>;
}

/**
 * EventStore — CalendarEvent 전역 상태
 * - 모달 열림/닫힘
 * - 달력 범위 내 이벤트 캐시
 */
export const useEventStore = create<EventState>((set, get) => ({
  modalDate: null,
  eventsByDate: {},

  openModal: (date) => set({ modalDate: date }),
  closeModal: () => set({ modalDate: null }),

  loadEventsByDateRange: async (startDate, endDate) => {
    const events = await storage.getEventsByDateRange(startDate, endDate);
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    }
    set({ eventsByDate: map });
  },

  saveEvent: async (date, text) => {
    const event: CalendarEvent = {
      id: nanoid(),
      date,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    await storage.saveEvent(event);
    // 캐시 갱신
    const prev = get().eventsByDate;
    const list = [...(prev[date] ?? []), event];
    set({ eventsByDate: { ...prev, [date]: list } });
  },

  deleteEvent: async (id, date) => {
    await storage.deleteEvent(id);
    const prev = get().eventsByDate;
    const list = (prev[date] ?? []).filter((e) => e.id !== id);
    set({ eventsByDate: { ...prev, [date]: list } });
  },
}));
