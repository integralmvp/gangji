"use client";

/**
 * CalendarCanvas
 * NOTE 중앙에 채워지는 달력 컨텐츠 (카드/박스 없음)
 *
 * 좌측: 소형 달력 3개 (전월/현재/다음월) — 흐름 파악용
 * 우측: 대형 현재월 달력 — 관리용
 *
 * Phase A: 구조/레이아웃만 (데이터 연결은 PR5)
 */
export default function CalendarCanvas() {
  const today = new Date();

  const getMonthData = (offset: number) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthName = d.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
    const firstDow = d.getDay(); // 0=일
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, monthName, firstDow, daysInMonth };
  };

  const renderSmallCalendar = (offset: number) => {
    const { monthName, firstDow, daysInMonth } = getMonthData(offset);
    const cells = Array(firstDow).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    const isCurrentMonth = offset === 0;

    return (
      <div className="mb-4">
        <div className={`text-[10px] font-medium mb-1 ${isCurrentMonth ? "text-ink" : "text-ink-muted"}`}>
          {monthName}
        </div>
        <div className="grid grid-cols-7 gap-x-px">
          {["일","월","화","수","목","금","토"].map((d) => (
            <div key={d} className="h-3 flex items-center justify-center text-[8px] text-ink-muted">
              {d}
            </div>
          ))}
          {cells.map((day, i) => (
            <button
              key={i}
              disabled={day === null}
              className={`h-4 w-full flex items-center justify-center text-[8px] rounded-sm transition-colors
                ${day === null ? "" : isCurrentMonth
                  ? "text-ink hover:bg-ink/8"
                  : "text-ink-muted hover:bg-ink/5"
                }
                ${day === today.getDate() && isCurrentMonth ? "font-semibold underline" : ""}
              `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLargeCalendar = () => {
    const { monthName, firstDow, daysInMonth } = getMonthData(0);
    const cells = Array(firstDow).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    return (
      <div className="h-full grid grid-rows-[auto_1fr]">
        {/* 월 헤더 */}
        <div className="mb-3">
          <div className="text-sm font-medium text-ink">{monthName}</div>
          <div className="mt-1 w-8 border-b border-ink/20" />
        </div>

        {/* 달력 그리드 */}
        <div className="grid grid-rows-[auto_1fr] h-full">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 border-b border-ink/10 pb-1 mb-1">
            {["일","월","화","수","목","금","토"].map((d) => (
              <div key={d} className="text-center text-[10px] text-ink-muted font-medium py-0.5">
                {d}
              </div>
            ))}
          </div>

          {/* 날짜 셀 */}
          <div className="grid grid-cols-7 grid-rows-5 h-full">
            {cells.map((day, i) => (
              <button
                key={i}
                disabled={day === null}
                className={`flex flex-col items-center justify-start pt-0.5 text-xs rounded transition-colors
                  ${day === null ? "" : "hover:bg-ink/5 cursor-pointer"}
                  ${day === today.getDate() ? "font-semibold text-ink" : "text-ink-light"}
                `}
              >
                {day && (
                  <>
                    <span className={`text-[11px] ${day === today.getDate() ? "text-ink" : "text-ink-muted"}`}>
                      {day}
                    </span>
                    {/* 기록 존재 dot (placeholder) */}
                    {/* PR5에서 실제 데이터로 교체 */}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full grid grid-cols-[160px_1fr] gap-6 p-6 overflow-hidden">
      {/* 좌측: 소형 3개월 달력 */}
      <div className="h-full overflow-hidden border-r border-ink/8 pr-4">
        {renderSmallCalendar(-1)}
        {renderSmallCalendar(0)}
        {renderSmallCalendar(1)}
      </div>

      {/* 우측: 대형 현재월 달력 */}
      <div className="h-full overflow-hidden">
        {renderLargeCalendar()}
      </div>
    </div>
  );
}
