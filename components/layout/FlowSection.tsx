"use client";

/**
 * FlowSection Component
 * 하단 메모칸 느낌 (노트 하단 Flow 관리)
 * - Current Flow Card (theme, period, type, goal)
 * - Flow Strip (RUN/STAND/SIT periods)
 *
 * Phase A: Structure only
 * PR6: Full implementation with Sprint/Period data
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
    <section className="bg-paper-light/70 px-8 py-6">
      <div className="space-y-4">
        {/* Section Label */}
        <div className="text-xs text-ink-muted uppercase tracking-wide">
          몰입 기간 관리
        </div>

        {/* Main Content */}
        <div className="flex items-start gap-4">
          {/* Current Flow Card */}
          <div className="bg-paper rounded-md p-4 border border-ink/10 flex-shrink-0 w-72 shadow-sm">
            <div className="text-xs text-ink-muted mb-1">현재 테마</div>
            <div className="text-lg font-semibold text-ink mb-2">
              갱지 MVP 개발
            </div>
            <div className="text-xs text-ink-muted mb-3">
              2026.02.10 - 2026.02.28
            </div>
            <div className="text-sm text-ink flex items-center gap-2">
              <span className="text-lg">🏃</span>
              <span>핵심 기능 완성하기</span>
            </div>
          </div>

          {/* Flow Strip */}
          <div className="flex-1">
            <div className="text-xs text-ink-muted mb-2">기간 구성</div>
            <div className="flex gap-2">
              {placeholderPeriods.map((period, index) => (
                <button
                  key={index}
                  className="px-3 py-2 rounded bg-paper hover:bg-paper-dark transition-all border border-ink/10 hover:shadow-sm"
                  title={`${period.type} 기간`}
                >
                  <div className="text-xl mb-0.5">
                    {period.type === "RUN" && "🏃"}
                    {period.type === "STAND" && "🧍"}
                    {period.type === "SIT" && "🪑"}
                  </div>
                  <div className="text-xs text-ink-muted">{period.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <button className="px-3 py-2 rounded bg-ink text-paper hover:bg-ink-light transition-colors text-sm">
              편집
            </button>
            <button className="px-3 py-2 rounded bg-paper-dark text-ink hover:bg-ink/5 transition-colors text-sm border border-ink/10">
              새 몰입
            </button>
          </div>
        </div>

        {/* Implementation note */}
        <div className="text-xs text-center text-ink-muted mt-2">
          <p>PR6에서 Sprint/Period 데이터 연결 및 편집 기능 구현</p>
        </div>
      </div>
    </section>
  );
}
