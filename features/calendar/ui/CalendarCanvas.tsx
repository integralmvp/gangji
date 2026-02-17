"use client";

/**
 * CalendarCanvas
 * NOTE 중앙에 채워지는 달력 컨텐츠 (카드/박스 없음)
 *
 * 레이아웃:
 * - 전체: 중앙 정렬 (flex items-center justify-center)
 * - 좌측: 소형 달력 3개 — 메인 달력 높이와 동일하게 flex-1 분배
 * - 우측: 대형 현재월 달력
 *
 * 년월 표기: 소형/대형 모두 중앙 정렬
 * Phase A: 구조/레이아웃만 (데이터 연결은 PR5)
 */
export default function CalendarCanvas() {
  const today = new Date();

  const getMonthData = (offset: number) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthName = d.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
    const firstDow = d.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, monthName, firstDow, daysInMonth };
  };

  /**
   * 소형 달력 — 컨테이너 높이를 꽉 채움 (flex-1 환경)
   * 년월: 중앙 정렬
   */
  const renderSmallCalendar = (offset: number) => {
    const { monthName, firstDow, daysInMonth } = getMonthData(offset);
    const cells = Array(firstDow).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    const isCurrentMonth = offset === 0;

    return (
      <div className="flex flex-col min-h-0 h-full">
        {/* 년월 — 중앙 정렬 */}
        <div
          className={`text-[11px] font-medium text-center mb-1.5 shrink-0
            ${isCurrentMonth ? "text-ink" : "text-ink-muted"}`}
        >
          {monthName}
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 shrink-0 pb-0.5 border-b border-ink/8 mb-1">
          {["일","월","화","수","목","금","토"].map((d) => (
            <div key={d} className="flex items-center justify-center text-[9px] text-ink-muted">
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 — 남은 공간 꽉 채움 */}
        <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-0">
          {cells.map((day, i) => (
            <button
              key={i}
              disabled={day === null}
              className={`flex items-center justify-center text-[10px] rounded-sm transition-colors
                ${day === null ? "" : isCurrentMonth
                  ? "text-ink hover:bg-ink/8"
                  : "text-ink-muted hover:bg-ink/5"
                }
                ${day === today.getDate() && isCurrentMonth
                  ? "font-semibold underline"
                  : ""
                }
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * 대형 현재월 달력 — 컨테이너 높이를 꽉 채움
   * 년월: 중앙 정렬
   */
  const renderLargeCalendar = () => {
    const { monthName, firstDow, daysInMonth } = getMonthData(0);
    const cells = Array(firstDow).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    return (
      <div className="flex flex-col h-full min-h-0">
        {/* 년월 — 중앙 정렬 */}
        <div className="text-base font-medium text-ink text-center mb-3 shrink-0">
          {monthName}
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-ink/10 pb-1 mb-1 shrink-0">
          {["일","월","화","수","목","금","토"].map((d) => (
            <div key={d} className="text-center text-[11px] text-ink-muted font-medium py-0.5">
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 셀 — 남은 공간 꽉 채움 */}
        <div className="grid grid-cols-7 grid-rows-5 flex-1 min-h-0">
          {cells.map((day, i) => (
            <button
              key={i}
              disabled={day === null}
              className={`flex flex-col items-center justify-start pt-1 rounded transition-colors
                ${day === null ? "" : "hover:bg-ink/5 cursor-pointer"}
              `}
            >
              {day && (
                <span
                  className={`text-[13px] leading-none
                    ${day === today.getDate() ? "font-semibold text-ink" : "text-ink-muted"}`}
                >
                  {day}
                </span>
              )}
              {/* 기록 존재 dot (placeholder → PR5에서 교체) */}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    /* NOTE 전체 영역 — 내용을 수직/수평 중앙 배치 */
    <div className="h-full flex items-center justify-center p-8 overflow-hidden">
      {/* 달력 컨테이너 — 화면 높이의 85%까지 */}
      <div className="flex gap-8 w-full" style={{ height: "min(520px, 85%)" }}>

        {/* 좌측: 소형 3개월 달력 — 메인 달력 높이에 딱 맞게 3등분 */}
        <div className="w-[168px] shrink-0 flex flex-col gap-3 border-r border-ink/10 pr-6">
          <div className="flex-1 min-h-0">{renderSmallCalendar(-1)}</div>
          <div className="flex-1 min-h-0">{renderSmallCalendar(0)}</div>
          <div className="flex-1 min-h-0">{renderSmallCalendar(1)}</div>
        </div>

        {/* 우측: 대형 현재월 달력 — NOTE 중앙에 위치 */}
        <div className="flex-1 min-h-0 min-w-0">
          {renderLargeCalendar()}
        </div>
      </div>
    </div>
  );
}
