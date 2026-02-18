"use client";

/**
 * PeriodEditor — 개별 Period 인라인 편집 폼
 *
 * - type 선택 (3개 중, RUN/STAND/SIT)
 * - goal 1줄 입력
 * - 날짜 범위 (start / end)
 * - 삭제 버튼
 */

import type { Period } from "@/types/models";
import { PERIOD_COLORS } from "@/features/calendar/utils/calendarUtils";
import { PeriodIcon } from "@/components/common/PeriodIcons";

type PeriodType = "run" | "stand" | "sit";

interface PeriodEditorProps {
  period: Period;
  onChange: (patch: Partial<Period>) => void;
  onDelete: () => void;
  onClose: () => void;
}

const PERIOD_TYPES: PeriodType[] = ["run", "stand", "sit"];

export default function PeriodEditor({
  period,
  onChange,
  onDelete,
  onClose,
}: PeriodEditorProps) {
  return (
    <div className="mt-1.5 p-2 rounded bg-paper/60 border border-ink/8 space-y-1.5">

      {/* 타입 선택 (3개) */}
      <div className="flex gap-1">
        {PERIOD_TYPES.map((t) => {
          const c = PERIOD_COLORS[t];
          const active = period.type === t;
          return (
            <button
              key={t}
              onClick={() => onChange({ type: t })}
              className="flex-1 flex items-center justify-center gap-0.5 py-0.5 rounded text-[9px] font-medium transition-all"
              style={{
                background: active ? c.bg : "transparent",
                color: active ? c.text : "#8C8C8A",
                border: `1px solid ${active ? c.bg : "rgba(44,44,42,0.1)"}`,
              }}
            >
              <PeriodIcon type={t} size={10} color={active ? c.text : "#8C8C8A"} />
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* 목표 1줄 */}
      <input
        type="text"
        value={period.goal}
        onChange={(e) => onChange({ goal: e.target.value })}
        placeholder="목표 한 줄"
        maxLength={60}
        className="w-full text-[10px] text-ink bg-transparent border-b border-ink/15 py-0.5 outline-none placeholder:text-ink-muted/40 focus:border-ink/30"
      />

      {/* 날짜 범위 */}
      <div className="flex items-center gap-1">
        <input
          type="date"
          value={period.startDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
          className="flex-1 text-[9px] text-ink bg-transparent border border-ink/10 rounded px-1 py-0.5 outline-none focus:border-ink/25"
        />
        <span className="text-[8px] text-ink-muted/40">~</span>
        <input
          type="date"
          value={period.endDate ?? ""}
          onChange={(e) =>
            onChange({ endDate: e.target.value || undefined })
          }
          className="flex-1 text-[9px] text-ink bg-transparent border border-ink/10 rounded px-1 py-0.5 outline-none focus:border-ink/25"
        />
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-between pt-0.5">
        <button
          onClick={onDelete}
          className="text-[9px] text-ink-muted/50 hover:text-red-400 transition-colors"
        >
          삭제
        </button>
        <button
          onClick={onClose}
          className="text-[9px] text-ink-muted/50 hover:text-ink transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
