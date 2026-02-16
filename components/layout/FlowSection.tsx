"use client";

/**
 * FlowSection Component (Bottom Flow Control Layer)
 *
 * Manages sprint/immersion periods:
 * - Current Flow Card (theme, period, type, goal)
 * - Flow Strip (RUN/STAND/SIT periods)
 *
 * Phase A: Structure only
 * PR6: Full implementation with Sprint/Period data
 *
 * Design: Control layer, not pressure UI
 */
export default function FlowSection() {
  // Placeholder data
  const placeholderPeriods = [
    { type: "STAND", label: "복기" },
    { type: "RUN", label: "달리기" },
    { type: "RUN", label: "달리기" },
    { type: "SIT", label: "휴식" },
  ];

  return (
    <section className="bg-paper-light border-t border-paper-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          {/* Current Flow Card */}
          <div className="bg-paper rounded-lg shadow-sm p-4 border border-paper-dark flex-shrink-0 w-80">
            <div className="text-sm text-ink-light mb-1">현재 몰입 테마</div>
            <div className="text-xl font-bold text-ink mb-2">
              갱지 MVP 개발
            </div>
            <div className="text-sm text-ink-light">
              2026.02.10 - 2026.02.28
            </div>
            <div className="mt-2 text-sm text-ink">
              🏃 <span className="font-medium">RUN:</span> 핵심 기능 완성하기
            </div>
          </div>

          {/* Flow Strip */}
          <div className="flex-1">
            <div className="text-sm text-ink-light mb-2">기간 구성</div>
            <div className="flex gap-2">
              {placeholderPeriods.map((period, index) => (
                <button
                  key={index}
                  className="px-4 py-2 rounded bg-paper hover:bg-paper-dark transition-colors border border-paper-dark"
                  title={`${period.type} 기간`}
                >
                  <div className="text-2xl mb-1">
                    {period.type === "RUN" && "🏃"}
                    {period.type === "STAND" && "🧍"}
                    {period.type === "SIT" && "🪑"}
                  </div>
                  <div className="text-xs text-ink-light">{period.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button className="px-4 py-2 rounded bg-ink text-paper hover:bg-ink-light transition-colors">
              편집
            </button>
            <button className="px-4 py-2 rounded bg-paper-dark text-ink hover:bg-paper transition-colors">
              새 몰입
            </button>
          </div>
        </div>

        {/* Implementation note */}
        <div className="mt-4 text-xs text-center text-ink-light">
          <p>PR6에서 Sprint/Period 데이터 연결 및 편집 기능 구현 예정</p>
        </div>
      </div>
    </section>
  );
}
