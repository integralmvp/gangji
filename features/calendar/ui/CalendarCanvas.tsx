"use client";

/**
 * CalendarCanvas — NOTE 중앙 달력 캔버스
 *
 * 레이아웃: 원본 복원 (flex center, 2열)
 *  - 좌측: 소형 3개월 미니맵
 *  - 우측: 대형 현재월
 *
 * 시각화 레이어:
 * [대형 달력]
 *  1. Period 배경 tint → 날짜 셀 전체 배경 (RUN/STAND/SIT)
 *  2. Sprint 형광펜 → 날짜 숫자에만 하이라이트 (배경 아님)
 *  3. Sprint 시작일 🚩 깃발
 *  4. Period SVG 아이콘 (작게)
 *  5. presence dot / ★
 *  6. Event 텍스트 미리보기
 *
 * [미니맵]
 *  - Sprint 형광펜: 숫자에만
 *  - 🚩 깃발: startDate에만
 *  - presence dot
 *  - Period 배경/아이콘: 표시 안 함
 *
 * 날짜 클릭 → EventModal (editor 이동 없음)
 */

import { useState } from "react";
import { useSprintStore } from "@/store/sprintStore";
import { useEventStore } from "@/store/eventStore";
import { useCalendarData } from "@/features/calendar/hooks/useCalendarData";
import {
  getMonthData,
  toDateString,
  isToday,
  getPeriodForDate,
  getSprintForDate,
  getSprintStartingOnDate,
  getSprintHighlightColor,
  PERIOD_COLORS,
} from "@/features/calendar/utils/calendarUtils";
import { PeriodIcon } from "@/components/common/PeriodIcons";
import EventModal from "./EventModal";

const DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarCanvas() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const { allSprints } = useSprintStore();
  const { modalDate, openModal, closeModal, eventsByDate } = useEventStore();
  const { presence } = useCalendarData(viewMonth);

  const goToPrevMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToToday = () =>
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  // ── Sprint 형광펜 색상 (숫자에만 적용) ─────────────────────────────────
  const getHighlightForDate = (dateStr: string): string | null => {
    const sprint = getSprintForDate(allSprints, dateStr);
    if (!sprint) return null;
    const idx = allSprints.indexOf(sprint);
    return getSprintHighlightColor(idx);
  };

  // ── Period 셀 배경 tint ──────────────────────────────────────────────
  const getCellBgForDate = (dateStr: string): string | null => {
    const sprint = getSprintForDate(allSprints, dateStr);
    if (!sprint) return null;
    const period = getPeriodForDate(sprint, dateStr);
    return period ? PERIOD_COLORS[period.type].cellBg : null;
  };

  // ── 소형 달력 렌더 (미니맵) ──────────────────────────────────────────
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
        <div
          className={`text-[10px] font-medium text-center mb-1 shrink-0 ${
            isCurrentView ? "text-ink" : "text-ink-muted"
          }`}
        >
          {monthName}
        </div>

        <div className="grid grid-cols-7 shrink-0 pb-0.5 border-b border-ink/8 mb-0.5">
          {DOW_LABELS.map((d) => (
            <div key={d} className="flex items-center justify-center text-[8px] text-ink-muted/60">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-0">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = toDateString(year, month, day);
            const todayFlag = isToday(dateStr, today);
            const pres = presence[dateStr];
            const highlight = getHighlightForDate(dateStr);
            const flagSprint = getSprintStartingOnDate(allSprints, dateStr);

            return (
              <button
                key={i}
                onClick={() => openModal(dateStr)}
                className="relative flex items-center justify-center rounded-sm transition-colors hover:bg-ink/8"
                title={dateStr}
              >
                {/* 깃발 (미니) */}
                {flagSprint && (
                  <span className="absolute top-0 left-0 text-[5px] leading-none" title={flagSprint.theme}>
                    🚩
                  </span>
                )}

                {/* 날짜 숫자 — 형광펜은 숫자에만 */}
                <span
                  className={`text-[9px] leading-none ${
                    todayFlag
                      ? "font-bold text-ink"
                      : isCurrentView
                      ? "text-ink/70"
                      : "text-ink-muted/50"
                  }`}
                  style={
                    highlight
                      ? {
                          background: highlight,
                          padding: "0px 2px",
                          borderRadius: "2px",
                          display: "inline-block",
                        }
                      : todayFlag
                      ? { textDecoration: "underline" }
                      : undefined
                  }
                >
                  {day}
                </span>

                {/* presence dot */}
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
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2 shrink-0 px-1">
          <button
            onClick={goToPrevMonth}
            className="text-ink-muted/50 hover:text-ink text-xs px-1 transition-colors"
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink">{monthName}</span>
            {(viewMonth.getFullYear() !== today.getFullYear() ||
              viewMonth.getMonth() !== today.getMonth()) && (
              <button
                onClick={goToToday}
                className="text-[9px] text-ink-muted/50 hover:text-ink border border-ink/15 rounded px-1 py-0.5 transition-colors"
              >
                오늘
              </button>
            )}
          </div>
          <button
            onClick={goToNextMonth}
            className="text-ink-muted/50 hover:text-ink text-xs px-1 transition-colors"
          >
            ›
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-ink/10 pb-1 mb-1 shrink-0">
          {DOW_LABELS.map((d) => (
            <div key={d} className="text-center text-[11px] text-ink-muted font-medium py-0.5">
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
            const highlight = getHighlightForDate(dateStr);
            const cellBg = getCellBgForDate(dateStr);
            const sprint = getSprintForDate(allSprints, dateStr);
            const period = sprint ? getPeriodForDate(sprint, dateStr) : null;
            const flagSprint = getSprintStartingOnDate(allSprints, dateStr);
            const events = eventsByDate[dateStr] ?? [];

            return (
              <button
                key={i}
                onClick={() => openModal(dateStr)}
                className="relative flex flex-col items-center pt-1 rounded transition-colors hover:brightness-95 group"
                style={cellBg ? { background: cellBg } : undefined}
                title={dateStr}
              >
                {/* 깃발 (Sprint 시작일) */}
                {flagSprint && (
                  <div className="absolute top-0.5 left-1 z-10">
                    <span
                      className="text-[10px] leading-none"
                      title={flagSprint.theme}
                    >
                      🚩
                    </span>
                    {/* hover tooltip */}
                    <span
                      className="absolute left-4 top-0 bg-ink/80 text-white text-[9px]
                        rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none
                        opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      {flagSprint.theme}
                    </span>
                  </div>
                )}

                {/* 날짜 숫자 — 형광펜은 숫자 텍스트에만 */}
                <span
                  className={`text-[13px] leading-none ${
                    todayFlag ? "font-bold text-ink" : "text-ink-muted"
                  }`}
                  style={
                    highlight
                      ? {
                          background: highlight,
                          padding: "1px 4px",
                          borderRadius: "3px",
                          display: "inline-block",
                        }
                      : todayFlag
                      ? { textDecoration: "underline" }
                      : undefined
                  }
                >
                  {day}
                </span>

                {/* Period 아이콘 + presence */}
                <div className="flex items-center gap-0.5 mt-0.5">
                  {period && (
                    <span
                      title={`${PERIOD_COLORS[period.type].label}${period.goal ? ` — ${period.goal}` : ""}`}
                    >
                      <PeriodIcon
                        type={period.type}
                        size={10}
                        color={PERIOD_COLORS[period.type].text}
                      />
                    </span>
                  )}
                  {pres && (
                    <span
                      className="text-[9px] leading-none"
                      style={{ color: pres.bookmarked ? "#F39C12" : "#8C8C8A" }}
                      title="기록 있음"
                    >
                      {pres.bookmarked ? "★" : "·"}
                    </span>
                  )}
                </div>

                {/* 이벤트 미리보기 */}
                {events.length > 0 && (
                  <div className="w-full px-0.5 mt-0.5 space-y-px">
                    {events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[8px] leading-tight text-ink/60 truncate bg-ink/5 rounded px-0.5"
                        title={ev.text}
                      >
                        {ev.text}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-[8px] text-ink-muted/40 text-center">
                        +{events.length - 2}
                      </div>
                    )}
                  </div>
                )}
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

        {/* 좌측: 소형 3개월 미니맵 */}
        <div className="w-[160px] shrink-0 flex flex-col gap-3 border-r border-ink/10 pr-6">
          <div className="flex-1 min-h-0">{renderSmallCalendar(-1)}</div>
          <div className="flex-1 min-h-0">{renderSmallCalendar(0)}</div>
          <div className="flex-1 min-h-0">{renderSmallCalendar(1)}</div>
        </div>

        {/* 우측: 대형 현재월 */}
        <div className="flex-1 min-h-0 min-w-0">
          {renderLargeCalendar()}
        </div>

      </div>

      {/* Event Modal */}
      {modalDate && (
        <EventModal date={modalDate} onClose={closeModal} />
      )}
    </div>
  );
}
