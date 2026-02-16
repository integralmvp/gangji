"use client";

/**
 * CalendarSection Component
 * 3개월 달력을 세로로 배치
 * Phase A: 구조만 구현 (데이터 연결은 PR5)
 */
export default function CalendarSection() {
  // Helper function to get month name
  const getMonthName = (offset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
  };

  // Helper function to generate calendar days (placeholder)
  const generateDays = () => {
    return Array.from({ length: 35 }, (_, i) => i + 1);
  };

  const months = [-1, 0, 1]; // 이전, 현재, 다음

  return (
    <div className="py-8 px-12 space-y-8">
      {months.map((offset) => (
        <div key={offset} className="bg-paper-light/50 rounded-lg p-6 border border-ink/5">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-ink">{getMonthName(offset)}</h3>
            {offset === 0 && (
              <span className="text-xs text-ink-muted bg-ink/5 px-2 py-1 rounded">
                현재
              </span>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day labels */}
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div
                key={day}
                className="text-center text-xs text-ink-muted font-medium py-2"
              >
                {day}
              </div>
            ))}

            {/* Days (placeholder) */}
            {generateDays().map((day) => (
              <button
                key={day}
                className="aspect-square flex items-center justify-center text-sm text-ink hover:bg-paper-dark rounded transition-colors"
              >
                {day <= 31 ? day : ""}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Placeholder hint */}
      <div className="text-center text-xs text-ink-muted mt-8">
        <p>달력 데이터 연결은 PR5에서 구현</p>
      </div>
    </div>
  );
}
