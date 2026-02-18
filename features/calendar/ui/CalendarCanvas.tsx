"use client";

/**
 * CalendarCanvas — NOTE 중앙 달력 캔버스
 *
 * 레이아웃:
 * - 상단: 2열 (소형 3개월 미니맵 | 대형 현재월)
 * - 하단: FlowControlPanel (Flow 관리 전용)
 *
 * 시각화 레이어 (아래→위):
 * 1. Sprint 형광펜 하이라이트 (Sprint별 색상)
 * 2. Period 배경 tint (RUN/STAND/SIT)
 * 3. Sprint 시작일 🚩 깃발
 * 4. Period 아이콘 (🏃/🧍/🪑)
 * 5. presence dot (기록 존재) / ★ (북마크)
 * 6. Event dot (일정 존재)
 *
 * 날짜 클릭 → EventModal 오픈 (editor 이동 없음)
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
import EventModal from "./EventModal";
import FlowControlPanel from "@/features/flow/ui/FlowControlPanel";

const DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarCanvas() {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const { allSprints } = useSprintStore();
  const { modalDate, openModal, closeModal, eventsByDate } = useEventStore();
  const { presence } = useCalendarData(viewMonth);

  const handleDateClick = (dateStr: string) => {
    openModal(dateStr);
  };

  const goToPrevMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToToday = () =>
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));

  // ── 날짜 셀 배경 계산 ─────────────────────────────────────────────────
  /** Sprint 형광펜 하이라이트 색상 반환 */
  const getSprintHighlight = (dateStr: string): string | null => {
    const sprint = getSprintForDate(allSprints, dateStr);
    if (!sprint) return null;
    const idx = allSprints.indexOf(sprint);
    return getSprintHighlightColor(idx);
  };

  /** Period tint 반환 */
  const getPeriodTint = (dateStr: string): string | null => {
    const sprint = getSprintForDate(allSprints, dateStr);
    const period = getPeriodForDate(sprint, dateStr);
    return period ? PERIOD_COLORS[period.type].tint : null;
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
            const highlight = getSprintHighlight(dateStr);
            const tint = getPeriodTint(dateStr);
            const sprint = getSprintForDate(allSprints, dateStr);
            const period = sprint ? getPeriodForDate(sprint, dateStr) : null;
            const flagSprint = getSprintStartingOnDate(allSprints, dateStr);
            const hasEvents = (eventsByDate[dateStr]?.length ?? 0) > 0;

            // 배경: 형광펜 + period tint 합성
            const bgStyle: React.CSSProperties = {};
            if (highlight || tint) {
              const colors: string[] = [];
              if (tint) colors.push(tint);
              if (highlight) colors.push(highlight);
              if (colors.length === 2) {
                bgStyle.background = `linear-gradient(135deg, ${tint} 0%, ${highlight} 100%)`;
              } else if (colors.length === 1) {
                bgStyle.background = colors[0];
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleDateClick(dateStr)}
                className="relative flex items-center justify-center rounded-sm transition-colors hover:bg-ink/8"
                style={bgStyle}
                title={dateStr}
              >
                {/* 깃발 (Sprint 시작일) */}
                {flagSprint && (
                  <span
                    className="absolute top-0 left-0 text-[5px] leading-none"
                    title={flagSprint.theme}
                  >
                    🚩
                  </span>
                )}
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
                {/* period 아이콘 (미니) */}
                {period && (
                  <span className="absolute bottom-0 left-0 text-[5px] leading-none">
                    {PERIOD_COLORS[period.type].icon}
                  </span>
                )}
                {/* presence */}
                {pres && (
                  <span
                    className="absolute bottom-0 right-0 text-[5px] leading-none"
                    style={{ color: pres.bookmarked ? "#F39C12" : "#8C8C8A" }}
                  >
                    {pres.bookmarked ? "★" : "•"}
                  </span>
                )}
                {/* event dot */}
                {hasEvents && !pres && (
                  <span className="absolute bottom-0 right-0 w-1 h-1 rounded-full bg-ink/30" />
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
            {(viewMonth.getFullYear() !== today.getFullYear() ||
              viewMonth.getMonth() !== today.getMonth()) && (
              <button
                onClick={goToToday}
                className="text-[9px] text-ink-muted/50 hover:text-ink border border-ink/15
                  rounded px-1 py-0.5 transition-colors"
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
            const highlight = getSprintHighlight(dateStr);
            const tint = getPeriodTint(dateStr);
            const sprint = getSprintForDate(allSprints, dateStr);
            const period = sprint ? getPeriodForDate(sprint, dateStr) : null;
            const flagSprint = getSprintStartingOnDate(allSprints, dateStr);
            const events = eventsByDate[dateStr] ?? [];

            // 배경: 형광펜 + period tint
            const bgStyle: React.CSSProperties = {};
            if (highlight || tint) {
              if (highlight && tint) {
                bgStyle.background = `linear-gradient(135deg, ${tint} 0%, ${highlight} 100%)`;
              } else {
                bgStyle.background = (highlight ?? tint)!;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleDateClick(dateStr)}
                className="relative flex flex-col items-center pt-1 rounded transition-colors
                  hover:bg-ink/6 group"
                style={bgStyle}
                title={dateStr}
              >
                {/* 깃발 (Sprint 시작일) — hover시 tooltip */}
                {flagSprint && (
                  <div className="absolute top-0.5 left-1 flex items-center gap-0.5 z-10">
                    <span
                      className="text-[10px] leading-none cursor-pointer"
                      title={`🚩 ${flagSprint.theme}`}
                    >
                      🚩
                    </span>
                    {/* hover tooltip */}
                    <span
                      className="absolute left-5 top-0 bg-ink/80 text-white text-[9px]
                        rounded px-1.5 py-0.5 whitespace-nowrap pointer-events-none
                        opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      style={{ fontSize: "9px" }}
                    >
                      {flagSprint.theme}
                    </span>
                  </div>
                )}

                {/* 날짜 숫자 */}
                <span
                  className={`text-[13px] leading-none ${
                    todayFlag ? "font-bold text-ink" : "text-ink-muted"
                  }`}
                  style={todayFlag ? { textDecoration: "underline" } : undefined}
                >
                  {day}
                </span>

                {/* 아이콘 + presence 영역 */}
                <div className="flex items-center gap-0.5 mt-0.5 flex-wrap justify-center">
                  {/* period 타입 아이콘 */}
                  {period && (
                    <span
                      className="text-[11px] leading-none"
                      title={`${PERIOD_COLORS[period.type].label}${period.goal ? ` — ${period.goal}` : ""}`}
                    >
                      {PERIOD_COLORS[period.type].icon}
                    </span>
                  )}

                  {/* presence dot / 북마크 별 */}
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

                {/* 이벤트 목록 (최대 2개 미리보기) */}
                {events.length > 0 && (
                  <div className="w-full px-0.5 mt-0.5 space-y-px">
                    {events.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[8px] leading-tight text-ink/60 truncate
                          bg-ink/5 rounded px-0.5"
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
    <div className="h-full overflow-y-auto">
      {/* 달력 섹션 */}
      <div className="p-6 pb-4">
        <div className="flex gap-8" style={{ height: "min(480px, 70vh)" }}>

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

      {/* Flow Control Panel 섹션 */}
      <div className="px-6 pb-8">
        <div className="border-t border-ink/8 pt-6">
          <FlowControlPanel />
        </div>
      </div>

      {/* Event Modal */}
      {modalDate && (
        <EventModal date={modalDate} onClose={closeModal} />
      )}
    </div>
  );
}
