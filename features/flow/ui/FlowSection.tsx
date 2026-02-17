"use client";

/**
 * FlowSection — 우측 툴바 몰입기간(Sprint/Flow) 섹션 (PR6)
 *
 * [Sprint 없을 때]
 * - "새 몰입기간 시작" 버튼 → 간단 폼 (theme / start / end)
 *
 * [Sprint 있을 때]
 * - theme(편집 가능) + 날짜 표시
 * - PeriodStrip: [달리기][서기][앉기] 시각 스트립
 * - period 클릭 → PeriodEditor 인라인
 * - "기간 추가" 3버튼 + "삭제" 버튼
 */

import { useState } from "react";
import { useSprintFlow } from "@/features/flow/hooks/useSprintFlow";
import PeriodStrip from "./PeriodStrip";
import PeriodEditor from "./PeriodEditor";
import { PERIOD_COLORS } from "@/features/calendar/utils/calendarUtils";

interface FlowSectionProps {
  open: boolean;
}

type PeriodType = "run" | "stand" | "sit";
const PERIOD_TYPES: PeriodType[] = ["run", "stand", "sit"];

export default function FlowSection({ open }: FlowSectionProps) {
  const {
    currentSprint,
    isCreating,
    setIsCreating,
    editingPeriodIdx,
    setEditingPeriodIdx,
    form,
    setForm,
    handleCreateSprint,
    handleDeleteSprint,
    handleUpdateSprint,
    handleAddPeriod,
    handleUpdatePeriod,
    handleDeletePeriod,
    resetForm,
  } = useSprintFlow();

  const [editingTheme, setEditingTheme] = useState(false);
  const [themeValue, setThemeValue] = useState("");

  const openThemeEdit = () => {
    setThemeValue(currentSprint?.theme ?? "");
    setEditingTheme(true);
  };

  const commitTheme = () => {
    if (themeValue.trim()) {
      handleUpdateSprint({ theme: themeValue.trim() });
    }
    setEditingTheme(false);
  };

  // ── 닫힌 상태 ──────────────────────────────────────────────────────────
  if (!open) {
    return (
      <div className="flex justify-center p-1.5">
        <span className="text-[9px] text-ink-muted/40 font-medium">F</span>
      </div>
    );
  }

  // ── Sprint 없음 + 생성 폼 열기 전 ─────────────────────────────────────
  if (!currentSprint && !isCreating) {
    return (
      <div className="p-2">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full text-[10px] text-ink-muted/60 hover:text-ink border border-ink/10 rounded py-1.5 transition-colors"
        >
          + 몰입기간 시작
        </button>
      </div>
    );
  }

  // ── Sprint 생성 폼 ─────────────────────────────────────────────────────
  if (!currentSprint && isCreating) {
    return (
      <div className="p-2 space-y-1.5">
        <input
          type="text"
          value={form.theme}
          onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
          placeholder="몰입 테마"
          maxLength={40}
          autoFocus
          className="w-full text-[10px] text-ink bg-transparent border-b border-ink/20 pb-0.5 outline-none placeholder:text-ink-muted/40 focus:border-ink/40"
        />
        <div className="flex gap-1">
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            className="flex-1 text-[9px] text-ink bg-transparent border border-ink/10 rounded px-1 py-0.5 outline-none focus:border-ink/25"
          />
          <span className="text-[8px] text-ink-muted/40 self-center">~</span>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            className="flex-1 text-[9px] text-ink bg-transparent border border-ink/10 rounded px-1 py-0.5 outline-none focus:border-ink/25"
          />
        </div>
        <div className="flex gap-1 pt-0.5">
          <button
            onClick={handleCreateSprint}
            className="flex-1 text-[9px] text-ink bg-paper/80 border border-ink/15 rounded py-0.5 hover:bg-ink/5 transition-colors"
          >
            시작
          </button>
          <button
            onClick={resetForm}
            className="text-[9px] text-ink-muted/50 hover:text-ink transition-colors px-1"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  // ── Sprint 존재 ────────────────────────────────────────────────────────
  if (!currentSprint) return null;

  return (
    <div className="p-2 space-y-2">

      {/* 테마 */}
      {editingTheme ? (
        <input
          type="text"
          value={themeValue}
          onChange={(e) => setThemeValue(e.target.value)}
          onBlur={commitTheme}
          onKeyDown={(e) => e.key === "Enter" && commitTheme()}
          maxLength={40}
          autoFocus
          className="w-full text-[10px] font-medium text-ink bg-transparent border-b border-ink/25 pb-0.5 outline-none"
        />
      ) : (
        <div className="flex items-start justify-between gap-1">
          <button
            onClick={openThemeEdit}
            className="text-[10px] font-medium text-ink hover:text-ink/70 text-left leading-tight transition-colors truncate"
            title="테마 편집"
          >
            {currentSprint.theme || "제목 없음"}
          </button>
          <button
            onClick={handleDeleteSprint}
            className="text-[8px] text-ink-muted/30 hover:text-red-400 transition-colors shrink-0"
            title="Sprint 삭제"
          >
            ✕
          </button>
        </div>
      )}

      {/* 날짜 범위 */}
      <div className="text-[8px] text-ink-muted/50">
        {currentSprint.startDate}
        {currentSprint.endDate ? ` ~ ${currentSprint.endDate}` : " (진행 중)"}
      </div>

      {/* Period Strip */}
      <PeriodStrip
        periods={currentSprint.periods}
        editingIdx={editingPeriodIdx}
        onClickPeriod={(i) =>
          setEditingPeriodIdx(editingPeriodIdx === i ? null : i)
        }
      />

      {/* Period Editor (선택된 period) */}
      {editingPeriodIdx !== null &&
        currentSprint.periods[editingPeriodIdx] && (
          <PeriodEditor
            period={currentSprint.periods[editingPeriodIdx]}
            onChange={(patch) => handleUpdatePeriod(editingPeriodIdx, patch)}
            onDelete={() => handleDeletePeriod(editingPeriodIdx)}
            onClose={() => setEditingPeriodIdx(null)}
          />
        )}

      {/* 기간 추가 버튼 (3개) */}
      <div className="flex gap-0.5 pt-0.5">
        {PERIOD_TYPES.map((t) => {
          const c = PERIOD_COLORS[t];
          return (
            <button
              key={t}
              onClick={() => handleAddPeriod(t)}
              className="flex-1 flex items-center justify-center gap-0.5 py-0.5 rounded text-[8px] transition-all hover:brightness-95"
              style={{ background: c.bg, color: c.text }}
              title={`${c.label} 기간 추가`}
            >
              <span className="font-mono">+</span>
              <span>{c.icon}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
