"use client";

/**
 * PeriodStrip — [STAND][RUN][RUN][SIT] 시각 스트립
 *
 * - 각 period 블록: 타입별 파스텔 컬러
 * - hover: goal/날짜 툴팁
 * - click: 해당 period 편집 열기
 */

import type { Period } from "@/types/models";
import { PERIOD_COLORS } from "@/features/calendar/utils/calendarUtils";

interface PeriodStripProps {
  periods: Period[];
  editingIdx: number | null;
  onClickPeriod: (idx: number) => void;
}

export default function PeriodStrip({
  periods,
  editingIdx,
  onClickPeriod,
}: PeriodStripProps) {
  if (periods.length === 0) {
    return (
      <div className="text-[9px] text-ink-muted/40 text-center py-1">
        기간 없음
      </div>
    );
  }

  return (
    <div className="flex gap-0.5 flex-wrap">
      {periods.map((period, i) => {
        const colors = PERIOD_COLORS[period.type];
        const isEditing = editingIdx === i;
        const tooltip = [
          colors.label,
          period.startDate,
          period.endDate ? `~ ${period.endDate}` : "(진행 중)",
          period.goal ? `· ${period.goal}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={i}
            onClick={() => onClickPeriod(i)}
            title={tooltip}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium transition-all"
            style={{
              background: colors.bg,
              color: colors.text,
              outline: isEditing ? `1.5px solid ${colors.text}` : "none",
              outlineOffset: "1px",
            }}
          >
            <span className="font-mono">{colors.icon}</span>
            <span>{colors.label}</span>
          </button>
        );
      })}
    </div>
  );
}
