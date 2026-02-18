"use client";

/**
 * FlowControlPanel — 달력 하단 Flow 관리 패널
 *
 * Calendar 페이지 전용. Editor 페이지에서는 절대 사용 금지.
 *
 * 구성:
 * 1. Sprint 목록 탭 (전체 누적 표시) + 새 Sprint 생성
 * 2. 선택된 Sprint 메타 편집 (테마/기간/삭제)
 * 3. Period 스트립 + 편집
 * 4. Period 추가 버튼 (달리기/서기/앉기)
 */

import { useState } from "react";
import { useFlowControl } from "@/features/flow/hooks/useFlowControl";
import { PERIOD_COLORS, getSprintHighlightColor, SPRINT_HIGHLIGHT_COLORS } from "@/features/calendar/utils/calendarUtils";
import PeriodEditor from "./PeriodEditor";

type PeriodType = "run" | "stand" | "sit";
const PERIOD_TYPES: PeriodType[] = ["run", "stand", "sit"];

export default function FlowControlPanel() {
  const {
    allSprints,
    selectedSprint,
    selectedSprintId,
    selectSprint,
    isCreating,
    setIsCreating,
    editingPeriodIdx,
    setEditingPeriodIdx,
    form,
    setForm,
    handleCreateSprint,
    handleDeleteSprint,
    handleUpdateSprintMeta,
    handleAddPeriod,
    handleUpdatePeriod,
    handleDeletePeriod,
    resetForm,
  } = useFlowControl();

  const [editTheme, setEditTheme] = useState(false);
  const [themeValue, setThemeValue] = useState("");
  const [editDates, setEditDates] = useState(false);

  const openThemeEdit = () => {
    setThemeValue(selectedSprint?.theme ?? "");
    setEditTheme(true);
  };
  const commitTheme = () => {
    if (selectedSprint && themeValue.trim()) {
      handleUpdateSprintMeta(selectedSprint.id, { theme: themeValue.trim() });
    }
    setEditTheme(false);
  };

  return (
    <div
      className="rounded-lg border border-ink/8 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.85)" }}
    >
      {/* 패널 헤더 */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ background: "#F5F2E0" }}
      >
        <span className="text-[11px] font-semibold text-ink">몰입 기간 (Flow)</span>
        <button
          onClick={() => { resetForm(); setIsCreating(true); }}
          className="text-[10px] text-ink-muted/60 hover:text-ink border border-ink/15
            rounded px-2 py-0.5 transition-colors"
        >
          + 새 테마
        </button>
      </div>

      <div className="p-5 space-y-5">

        {/* Sprint 생성 폼 */}
        {isCreating && (
          <div className="border border-ink/10 rounded-lg p-4 space-y-3 bg-paper/40">
            <div className="text-[10px] font-medium text-ink-muted/60 mb-1">새 몰입 테마</div>
            <input
              type="text"
              value={form.theme}
              onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
              placeholder="테마명 (예: 프로젝트 론칭)"
              maxLength={40}
              autoFocus
              className="w-full text-sm text-ink bg-transparent border-b border-ink/20 pb-1
                outline-none placeholder:text-ink-muted/40 focus:border-ink/40"
            />
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <div className="text-[9px] text-ink-muted/50 mb-1">시작일</div>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full text-xs text-ink bg-transparent border border-ink/15
                    rounded px-2 py-1 outline-none focus:border-ink/30"
                />
              </div>
              <span className="text-ink-muted/40 text-sm mt-4">~</span>
              <div className="flex-1">
                <div className="text-[9px] text-ink-muted/50 mb-1">종료일 (선택)</div>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full text-xs text-ink bg-transparent border border-ink/15
                    rounded px-2 py-1 outline-none focus:border-ink/30"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCreateSprint}
                className="flex-1 py-2 text-xs font-medium text-ink bg-ink/8
                  hover:bg-ink/14 rounded-md transition-colors"
              >
                시작
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 text-xs text-ink-muted/60 hover:text-ink
                  border border-ink/10 rounded-md transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* Sprint 목록 탭 */}
        {allSprints.length > 0 && (
          <div>
            <div className="text-[9px] text-ink-muted/50 font-medium mb-2">테마 목록</div>
            <div className="flex flex-wrap gap-2">
              {allSprints.map((sprint, idx) => {
                const color = getSprintHighlightColor(idx);
                const isSelected = sprint.id === selectedSprintId;
                const isActive = !sprint.endDate;
                return (
                  <button
                    key={sprint.id}
                    onClick={() => selectSprint(isSelected ? null : sprint.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                      transition-all border"
                    style={{
                      background: isSelected ? color.replace(/[\d.]+\)$/, "0.7)") : color,
                      borderColor: isSelected ? "rgba(44,44,42,0.25)" : "rgba(44,44,42,0.10)",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-ink/50 inline-block" />
                    )}
                    <span className="text-ink/80">{sprint.theme || "제목 없음"}</span>
                    <span className="text-ink-muted/40 text-[9px]">
                      {sprint.startDate.slice(5)}
                      {sprint.endDate ? `~${sprint.endDate.slice(5)}` : "~"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {allSprints.length === 0 && !isCreating && (
          <div className="text-center py-6 text-sm text-ink-muted/40">
            아직 몰입 테마가 없습니다.
          </div>
        )}

        {/* 선택된 Sprint 편집 영역 */}
        {selectedSprint && (
          <div className="border-t border-ink/8 pt-5 space-y-4">

            {/* 테마명 + 삭제 */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {editTheme ? (
                  <input
                    type="text"
                    value={themeValue}
                    onChange={(e) => setThemeValue(e.target.value)}
                    onBlur={commitTheme}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitTheme();
                      if (e.key === "Escape") setEditTheme(false);
                    }}
                    maxLength={40}
                    autoFocus
                    className="w-full text-base font-semibold text-ink bg-transparent
                      border-b border-ink/25 pb-0.5 outline-none"
                  />
                ) : (
                  <button
                    onClick={openThemeEdit}
                    className="text-base font-semibold text-ink hover:text-ink/70
                      transition-colors text-left"
                    title="테마명 편집"
                  >
                    {selectedSprint.theme || "제목 없음"}
                  </button>
                )}
                <div className="text-[11px] text-ink-muted/50 mt-1">
                  {selectedSprint.startDate}
                  {selectedSprint.endDate
                    ? ` ~ ${selectedSprint.endDate}`
                    : " (진행 중)"}
                </div>
              </div>
              <button
                onClick={() => handleDeleteSprint(selectedSprint.id)}
                className="text-xs text-ink-muted/30 hover:text-red-400 transition-colors
                  border border-ink/10 rounded px-2 py-1 shrink-0"
                title="삭제"
              >
                삭제
              </button>
            </div>

            {/* 기간 편집 */}
            <div>
              <button
                onClick={() => setEditDates(!editDates)}
                className="text-[10px] text-ink-muted/50 hover:text-ink transition-colors"
              >
                {editDates ? "▾ 기간 닫기" : "▸ 기간 수정"}
              </button>
              {editDates && (
                <div className="flex gap-3 mt-2">
                  <div className="flex-1">
                    <div className="text-[9px] text-ink-muted/50 mb-1">시작일</div>
                    <input
                      type="date"
                      defaultValue={selectedSprint.startDate}
                      onBlur={(e) =>
                        handleUpdateSprintMeta(selectedSprint.id, {
                          startDate: e.target.value,
                        })
                      }
                      className="w-full text-xs text-ink bg-transparent border border-ink/15
                        rounded px-2 py-1 outline-none focus:border-ink/30"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] text-ink-muted/50 mb-1">종료일</div>
                    <input
                      type="date"
                      defaultValue={selectedSprint.endDate ?? ""}
                      onBlur={(e) =>
                        handleUpdateSprintMeta(selectedSprint.id, {
                          endDate: e.target.value || undefined,
                        })
                      }
                      className="w-full text-xs text-ink bg-transparent border border-ink/15
                        rounded px-2 py-1 outline-none focus:border-ink/30"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Period 목록 */}
            {selectedSprint.periods.length > 0 && (
              <div>
                <div className="text-[9px] text-ink-muted/50 font-medium mb-2">기간 스트립</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSprint.periods.map((period, idx) => {
                    const c = PERIOD_COLORS[period.type];
                    const isEditing = editingPeriodIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setEditingPeriodIdx(isEditing ? null : idx)}
                        title={`${c.label}${period.goal ? ` — ${period.goal}` : ""}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs
                          transition-all border"
                        style={{
                          background: isEditing
                            ? c.bg.replace(")", ", 0.9)").replace("rgb", "rgba") : c.bg,
                          color: c.text,
                          borderColor: isEditing ? c.text : "transparent",
                          fontWeight: isEditing ? 600 : 400,
                        }}
                      >
                        <span>{c.icon}</span>
                        <span>{c.label}</span>
                        {period.goal && (
                          <span className="opacity-60 text-[9px] max-w-[60px] truncate">
                            {period.goal}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Period 편집기 */}
                {editingPeriodIdx !== null &&
                  selectedSprint.periods[editingPeriodIdx] && (
                    <div className="mt-3">
                      <PeriodEditor
                        period={selectedSprint.periods[editingPeriodIdx]}
                        onChange={(patch) => handleUpdatePeriod(editingPeriodIdx, patch)}
                        onDelete={() => handleDeletePeriod(editingPeriodIdx)}
                        onClose={() => setEditingPeriodIdx(null)}
                      />
                    </div>
                  )}
              </div>
            )}

            {/* Period 추가 버튼 */}
            <div>
              <div className="text-[9px] text-ink-muted/50 font-medium mb-2">기간 추가</div>
              <div className="flex gap-2">
                {PERIOD_TYPES.map((t) => {
                  const c = PERIOD_COLORS[t];
                  return (
                    <button
                      key={t}
                      onClick={() => handleAddPeriod(t)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5
                        rounded-lg text-sm font-medium transition-all hover:brightness-95 border border-transparent hover:border-ink/10"
                      style={{ background: c.bg, color: c.text }}
                      title={`${c.label} 기간 추가`}
                    >
                      <span className="text-base">{c.icon}</span>
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
