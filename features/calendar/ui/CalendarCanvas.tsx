"use client";

/**
 * CalendarCanvas — NOTE 중앙 달력 캔버스 (PR5)
 *
 * 레이아웃:
 * - 좌측: 세로 미니 3개월 (전월/현재월/다음월)
 * - 우측: 현재 viewMonth 대형 달력
 *
 * 기능:
 * - presence dot/★: 기록 존재 표시
 * - Sprint 하이라이트: period 타입별 약한 배경색
 * - 날짜 클릭: 해당 날짜 페이지 로드 → editor 전환
 * - viewMonth 이동: 대형 달력 헤더 좌우 화살표
 */

import { useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { useSprintStore } from "@/store/sprintStore";
import { useCalendarData } from "@/features/calendar/hooks/useCalendarData";
import {
  getMonthData,
  toDateString,
  isToday,
  getPeriodForDate,
  isInSprintRange,
  PERIOD_COLORS,
  PERIOD_CALENDAR_BG,
} from "@/features/calendar/utils/calendarUtils";

const DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarCanvas() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const { openDateInEditor } = useUIStore();
  const { currentSprint } = useSprintStore();
  const { presence } = useCalendarData(viewMonth);

  const handleDateClick = (dateStr: string) => {
    openDateInEditor(dateStr);
  };

  const goToPrevMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToToday = () =>
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  // ── 날짜 셀 배경색 (sprint 하이라이트) ───────────────────────────────
  const getCellBg = (dateStr: string): string => {
    const period = getPeriodForDate(currentSprint, dateStr);
    if (period) return PERIOD_CALENDAR_BG[period.type];
    if (isInSprintRange(currentSprint, dateStr)) return PERIOD_CALENDAR_BG.sprint;
    return "transparent";
  };

  // ── 소형 달력 렌더 ────────────────────────────────────────────────────
  const renderSmallCalendar = (offset: number) => {
    const data = getMonthData(viewMonth, offset);
    const { year, month, monthName, firstDow, daysInMonth } = data;
    const isCurrentView = offset === 0;

    const cells: (number | null)[] = [
      ...Array(firstDow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
      <div className="flex flex-col min-h-0 h-full">
        {/* 년월 */}
        <div
          className={`text-[10px] font-medium text-center mb-1 shrink-0 ${
            isCurrentView ? "text-ink" : "text-ink-muted"
          }`}
        >
          {monthName}
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 shrink-0 pb-0.5 border-b border-ink/8 mb-0.5">
          {DOW_LABELS.map((d) => (
            <div
              key={d}
              className="flex items-center justify-center text-[8px] text-ink-muted/60"
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-0">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = toDateString(year, month, day);
            const todayFlag = isToday(dateStr, today);
            const pres = presence[dateStr];
            const cellBg = getCellBg(dateStr);

            return (
              <button
                key={i}
                onClick={() => handleDateClick(dateStr)}
                className="relative flex items-center justify-center rounded-sm transition-colors hover:bg-ink/8"
                style={{ background: cellBg !== "transparent" ? cellBg : undefined }}
                title={dateStr}
              >
                <span
                  className={`text-[9px] leading-none ${
                    todayFlag
                      ? "font-bold text-ink underline"
                      : isCurrentView
                      ? "text-ink/70"
                      : "text-ink-muted/50"
                  }`}
                >
                  {day}
                </span>
                {/* presence 표시 */}
                {pres && (
                  <span
                    className="absolute bottom-0 right-0 text-[5px] leading-none"
                    style={{ color: pres.bookmarked ? "#F39C12" : "#8C8C8A" }}
                  >
                    {pres.bookmarked ? "★" : "•"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ── 대형 달력 렌더 ────────────────────────────────────────────────────
  const renderLargeCalendar = () => {
    const data = getMonthData(viewMonth, 0);
    const { year, month, monthName, firstDow, daysInMonth } = data;

    const cells: (number | null)[] = [
      ...Array(firstDow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
      <div className="flex flex-col h-full min-h-0">
        {/* 헤더: 년월 + 네비게이션 */}
        <div className="flex items-center justify-between mb-2 shrink-0 px-1">
          <button
            onClick={goToPrevMonth}
            className="text-ink-muted/50 hover:text-ink text-xs px-1 transition-colors"
            title="이전 달"
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink">{monthName}</span>
            {/* 오늘로 돌아오기 (현재월이 아닐 때만) */}
            {(viewMonth.getFullYear() !== today.getFullYear() ||
              viewMonth.getMonth() !== today.getMonth()) && (
              <button
                onClick={goToToday}
                className="text-[9px] text-ink-muted/50 hover:text-ink border border-ink/15 rounded px-1 py-0.5 transition-colors"
                title="오늘로"
              >
                오늘
              </button>
            )}
          </div>
          <button
            onClick={goToNextMonth}
            className="text-ink-muted/50 hover:text-ink text-xs px-1 transition-colors"
            title="다음 달"
          >
            ›
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-ink/10 pb-1 mb-1 shrink-0">
          {DOW_LABELS.map((d) => (
            <div
              key={d}
              className="text-center text-[11px] text-ink-muted font-medium py-0.5"
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-0">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = toDateString(year, month, day);
            const todayFlag = isToday(dateStr, today);
            const pres = presence[dateStr];
            const period = getPeriodForDate(currentSprint, dateStr);
            const cellBg = getCellBg(dateStr);

            return (
              <button
                key={i}
                onClick={() => handleDateClick(dateStr)}
                className="relative flex flex-col items-center pt-1 rounded transition-colors hover:bg-ink/6"
                style={{ background: cellBg !== "transparent" ? cellBg : undefined }}
                title={dateStr}
              >
                {/* 날짜 숫자 */}
                <span
                  className={`text-[13px] leading-none ${
                    todayFlag
                      ? "font-bold text-ink"
                      : "text-ink-muted"
                  }`}
                  style={todayFlag ? { textDecoration: "underline" } : undefined}
                >
                  {day}
                </span>

                {/* presence + period 표시 영역 */}
                <div className="flex items-center gap-0.5 mt-0.5">
                  {/* period 타입 아이콘 */}
                  {period && (
                    <span
                      className="text-[8px] leading-none opacity-70"
                      style={{ color: PERIOD_COLORS[period.type].text }}
                      title={`${PERIOD_COLORS[period.type].label}: ${period.goal || ""}`}
                    >
                      {PERIOD_COLORS[period.type].icon}
                    </span>
                  )}
                  {/* presence dot / 북마크 별 */}
                  {pres && (
                    <span
                      className="text-[8px] leading-none"
                      style={{ color: pres.bookmarked ? "#F39C12" : "#8C8C8A" }}
                    >
                      {pres.bookmarked ? "★" : "·"}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex items-center justify-center p-8 overflow-hidden">
      <div className="flex gap-8 w-full" style={{ height: "min(520px, 85%)" }}>

        {/* 좌측: 소형 3개월 달력 */}
        <div className="w-[160px] shrink-0 flex flex-col gap-3 border-r border-ink/10 pr-6">
          <div className="flex-1 min-h-0">{renderSmallCalendar(-1)}</div>
          <div className="flex-1 min-h-0">{renderSmallCalendar(0)}</div>
          <div className="flex-1 min-h-0">{renderSmallCalendar(1)}</div>
        </div>

        {/* 우측: 대형 현재월 달력 */}
        <div className="flex-1 min-h-0 min-w-0">
          {renderLargeCalendar()}
        </div>

      </div>
    </div>
  );
}
