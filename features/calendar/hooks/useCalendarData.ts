"use client";

/**
 * useCalendarData — 달력 데이터 로딩 훅
 *
 * - viewMonth 기준 전월/현재월/다음월 날짜 범위의 Page presence 매핑
 * - 전체 Sprint 로딩 (달력 누적 하이라이트용)
 * - CalendarEvent 로딩 (날짜별 이벤트)
 */

import { useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage/storage";
import { useSprintStore } from "@/store/sprintStore";
import { useEventStore } from "@/store/eventStore";
import { getThreeMonthRange } from "@/features/calendar/utils/calendarUtils";

export interface PresenceInfo {
  hasContent: boolean;
  bookmarked: boolean;
}

export interface CalendarData {
  /** date(YYYY-MM-DD) → presence 정보 */
  presence: Record<string, PresenceInfo>;
  isLoading: boolean;
  /** presence 데이터 수동 갱신 트리거 */
  refresh: () => void;
}

/**
 * Page에 "존재(presence)"가 있는지 판단
 * - content가 실질적으로 있거나 title/tags/tabs/bookmark 등 interaction 있으면 true
 */
function hasPresence(page: {
  content: string;
  title?: string;
  tags: string[];
  tabs: string[];
  bookmarked: boolean;
}): boolean {
  if (page.bookmarked) return true;
  if (page.title && page.title.trim().length > 0) return true;
  if (page.tags.length > 0) return true;
  if (page.tabs.length > 0) return true;
  // TipTap JSON: 빈 doc은 {"type":"doc","content":[{"type":"paragraph"}]} — 50자 이하면 빈 것으로 간주
  if (page.content && page.content.length > 60) return true;
  return false;
}

export function useCalendarData(viewMonth: Date): CalendarData {
  const [presence, setPresence] = useState<Record<string, PresenceInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const { loadAllSprints } = useSprintStore();
  const { loadEventsByDateRange } = useEventStore();

  const { startDate, endDate } = useMemo(
    () => getThreeMonthRange(viewMonth),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewMonth.getFullYear(), viewMonth.getMonth()]
  );

  // 전체 Sprint + Events 로딩 (달력 범위 변경 시)
  useEffect(() => {
    loadAllSprints();
    loadEventsByDateRange(startDate, endDate);
  }, [loadAllSprints, loadEventsByDateRange, startDate, endDate]);

  // Pages presence 로딩
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    storage.getPagesByDateRange(startDate, endDate).then((pages) => {
      if (cancelled) return;
      const map: Record<string, PresenceInfo> = {};
      for (const page of pages) {
        if (hasPresence(page)) {
          map[page.date] = {
            hasContent: true,
            bookmarked: page.bookmarked,
          };
        }
      }
      setPresence(map);
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [startDate, endDate, tick]);

  const refresh = () => setTick((t) => t + 1);

  return { presence, isLoading, refresh };
}
