"use client";

/**
 * CalendarView Component (Placeholder)
 *
 * Will show:
 * - 3-month calendar (previous, current, next)
 * - Page existence dots (📄)
 * - Sprint/Flow period highlights
 *
 * Phase A: Structure only
 * PR5: Full implementation with data
 *
 * Design: Flow map, not schedule table
 * - No red warnings, no guilt UI
 * - Show "presence" not "completion"
 */
export default function CalendarView() {
  return (
    <div className="flex-1 p-8 bg-paper">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-ink mb-2">흐름 지도</h2>
          <p className="text-ink-light">
            달력은 일정표가 아닙니다. 당신의 흐름을 확인하는 지도입니다.
          </p>
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-paper-light rounded-lg shadow-sm p-8 border border-paper-dark">
          <div className="grid grid-cols-3 gap-8">
            {/* Previous Month */}
            <div className="text-center">
              <div className="text-lg font-medium text-ink-light mb-4">
                1월
              </div>
              <div className="aspect-square bg-paper rounded flex items-center justify-center text-ink-light">
                <span className="text-sm">이전 달</span>
              </div>
            </div>

            {/* Current Month */}
            <div className="text-center">
              <div className="text-lg font-medium text-ink mb-4">
                2월 (현재)
              </div>
              <div className="aspect-square bg-paper rounded flex items-center justify-center border-2 border-ink">
                <span className="text-sm text-ink">이번 달</span>
              </div>
            </div>

            {/* Next Month */}
            <div className="text-center">
              <div className="text-lg font-medium text-ink-light mb-4">
                3월
              </div>
              <div className="aspect-square bg-paper rounded flex items-center justify-center text-ink-light">
                <span className="text-sm">다음 달</span>
              </div>
            </div>
          </div>

          {/* Implementation note */}
          <div className="mt-8 text-center text-sm text-ink-light">
            <p>PR5에서 완전한 3개월 달력 구현 예정</p>
            <p className="mt-1">날짜 클릭 → 해당 페이지 열기 → 에디터 전환</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-6 justify-center text-sm text-ink-light">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-ink"></span>
            <span>기록 있음</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-paper-dark"></span>
            <span>몰입 기간</span>
          </div>
        </div>
      </div>
    </div>
  );
}
