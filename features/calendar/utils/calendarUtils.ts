/**
 * calendarUtils — 달력 관련 순수 유틸 함수
 * React import 없음, side-effect 없음
 */

import type { Sprint, Period } from "@/types/models";

export interface MonthData {
  year: number;
  month: number; // 0-indexed
  monthName: string;
  firstDow: number; // 0=일, 6=토
  daysInMonth: number;
}

/**
 * 기준 날짜로부터 offset 개월 떨어진 달의 메타데이터 반환
 */
export function getMonthData(base: Date, offset: number): MonthData {
  const d = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const year = d.getFullYear();
  const month = d.getMonth();
  const monthName = d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
  const firstDow = d.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { year, month, monthName, firstDow, daysInMonth };
}

/**
 * YYYY-MM-DD 형식 문자열 반환
 */
export function toDateString(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

/**
 * today 여부 확인
 */
export function isToday(dateStr: string, today: Date): boolean {
  return dateStr === toDateString(today.getFullYear(), today.getMonth(), today.getDate());
}

/**
 * Sprint 기간 내에서 특정 날짜가 속하는 Period 반환
 * 없으면 null
 */
export function getPeriodForDate(
  sprint: Sprint | null,
  dateStr: string
): Period | null {
  if (!sprint) return null;
  if (dateStr < sprint.startDate) return null;
  if (sprint.endDate && dateStr > sprint.endDate) return null;

  for (const period of sprint.periods) {
    if (
      dateStr >= period.startDate &&
      (!period.endDate || dateStr <= period.endDate)
    ) {
      return period;
    }
  }
  return null;
}

/**
 * Sprint 기간 범위 안에 있는지 확인 (period 여부 무관)
 */
export function isInSprintRange(sprint: Sprint | null, dateStr: string): boolean {
  if (!sprint) return false;
  if (dateStr < sprint.startDate) return false;
  if (sprint.endDate && dateStr > sprint.endDate) return false;
  return true;
}

/**
 * Period 타입별 색상 설정 (갱지 파스텔 팔레트)
 */
export const PERIOD_COLORS = {
  run: {
    bg: "#FAE9E4",
    text: "#C0392B",
    icon: "▷",
    label: "달리기",
  },
  stand: {
    bg: "#E6F5EE",
    text: "#27AE60",
    icon: "│",
    label: "서기",
  },
  sit: {
    bg: "#E4EDF8",
    text: "#2E86AB",
    icon: "○",
    label: "앉기",
  },
} as const;

/**
 * Sprint 달력 하이라이트 배경색 (period 타입별, 더 연하게)
 */
export const PERIOD_CALENDAR_BG = {
  run: "rgba(250,233,228,0.55)",
  stand: "rgba(230,245,238,0.55)",
  sit: "rgba(228,237,248,0.55)",
  sprint: "rgba(245,242,224,0.40)", // sprint range 내 기본 (period 없음)
} as const;

/**
 * 3개월 날짜 범위 반환 (startDate, endDate)
 * viewMonth 기준 전월 1일 ~ 다음월 말일
 */
export function getThreeMonthRange(viewMonth: Date): {
  startDate: string;
  endDate: string;
} {
  const startDate = toDateString(
    viewMonth.getFullYear(),
    viewMonth.getMonth() - 1,
    1
  );
  const endYear = viewMonth.getFullYear();
  const endMonth = viewMonth.getMonth() + 1; // 0-indexed, 다음달
  const lastDay = new Date(endYear, endMonth + 1, 0).getDate();
  const endDate = toDateString(endYear, endMonth, lastDay);
  return { startDate, endDate };
}
