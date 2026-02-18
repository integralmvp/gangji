"use client";

/**
 * FlowControlPanel — 우측 툴바 내 Flow 관리 패널 (달력 모드 전용)
 *
 * Editor 페이지에서는 절대 사용 금지.
 *
 * UX 플로우:
 * 1. 테마 목록 → 선택 → 편집/삭제
 * 2. 기간(Period) 목록 표시
 * 3. 기간 추가: 타입 클릭 → 설정 폼 → "설정 완료" → 저장
 */

import { useState } from "react";
import { useFlowControl } from "@/features/flow/hooks/useFlowControl";
import { PERIOD_COLORS, getSprintHighlightColor } from "@/features/calendar/utils/calendarUtils";
import { PeriodIcon } from "@/components/common/PeriodIcons";
import PeriodEditor from "./PeriodEditor";
import type { Period } from "@/types/models";

type PeriodType = "run" | "stand" | "sit";
const PERIOD_TYPES: PeriodType[] = ["run", "stand", "sit"];

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface PendingPeriod {
  type: PeriodType;
  goal: string;
  startDate: string;
  endDate: string;
}

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
  const [pendingPeriod, setPendingPeriod] = useState<PendingPeriod | null>(null);

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

  const openPendingPeriod = (type: PeriodType) => {
    setPendingPeriod({ type, goal: "", startDate: todayStr(), endDate: "" });
    setEditingPeriodIdx(null);
  };

  const confirmPendingPeriod = async () => {
    if (!pendingPeriod) return;
    const period: Period = {
      type: pendingPeriod.type,
      goal: pendingPeriod.goal.trim(),
      startDate: pendingPeriod.startDate,
      endDate: pendingPeriod.endDate || undefined,
    };
    await handleAddPeriod(period);
    setPendingPeriod(null);
  };

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── 헤더 ── */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{ background: "#F5F2E0" }}
      >
        <span className="text-[11px] font-semibold text-ink">몰입기간</span>
        <button
          onClick={() => { resetForm(); setIsCreating(true); setPendingPeriod(null); }}
          className="text-[9px] text-ink-muted/60 hover:text-ink border border-ink/15
            rounded px-1.5 py-0.5 transition-colors"
        >
          + 새 테마
        </button>
      </div>

      {/* ── 스크롤 가능한 본문 ── */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
        <div className="p-3 space-y-4">

          {/* Sprint 생성 폼 */}
          {isCreating && (
            <div className="border border-ink/10 rounded-lg p-3 space-y-2.5 bg-paper/40">
              <div className="text-[9px] font-medium text-ink-muted/60">새 몰입 테마</div>
              <input
                type="text"
                value={form.theme}
                onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
                placeholder="테마명"
                maxLength={40}
                autoFocus
                className="w-full text-sm text-ink bg-transparent border-b border-ink/20 pb-1
                  outline-none placeholder:text-ink-muted/40 focus:border-ink/40"
              />
              <div className="space-y-1.5">
                <div>
                  <div className="text-[9px] text-ink-muted/50 mb-1">시작일</div>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full text-xs text-ink bg-transparent border border-ink/15
                      rounded px-2 py-1 outline-none focus:border-ink/30"
                  />
                </div>
                <div>
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
              <div className="flex gap-1.5 pt-0.5">
                <button
                  onClick={handleCreateSprint}
                  className="flex-1 py-1.5 text-xs font-medium text-ink bg-ink/8
                    hover:bg-ink/14 rounded transition-colors"
                >
                  시작
                </button>
                <button
                  onClick={resetForm}
                  className="px-3 py-1.5 text-xs text-ink-muted/60 hover:text-ink
                    border border-ink/10 rounded transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {/* Sprint 목록 */}
          {allSprints.length > 0 && (
            <div>
              <div className="text-[9px] text-ink-muted/50 font-medium mb-1.5">테마 목록</div>
              <div className="space-y-1">
                {allSprints.map((sprint, idx) => {
                  const color = getSprintHighlightColor(idx);
                  const isSelected = sprint.id === selectedSprintId;
                  const isActive = !sprint.endDate;
                  return (
                    <button
                      key={sprint.id}
                      onClick={() => selectSprint(isSelected ? null : sprint.id)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs
                        transition-all border text-left"
                      style={{
                        background: isSelected
                          ? color.replace(/[\d.]+\)$/, "0.65)")
                          : color,
                        borderColor: isSelected
                          ? "rgba(44,44,42,0.22)"
                          : "rgba(44,44,42,0.08)",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-ink/50 shrink-0" />
                      )}
                      <span className="text-ink/80 truncate flex-1">
                        {sprint.theme || "제목 없음"}
                      </span>
                      <span className="text-ink-muted/40 text-[9px] shrink-0">
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
            <div className="text-center py-8 text-xs text-ink-muted/40">
              아직 몰입 테마가 없어요.
            </div>
          )}

          {/* 선택된 Sprint 편집 */}
          {selectedSprint && (
            <div className="border-t border-ink/8 pt-3 space-y-3">

              {/* 테마명 + 삭제 */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
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
                      className="w-full text-sm font-semibold text-ink bg-transparent
                        border-b border-ink/25 pb-0.5 outline-none"
                    />
                  ) : (
                    <button
                      onClick={openThemeEdit}
                      className="text-sm font-semibold text-ink hover:text-ink/70
                        transition-colors text-left truncate w-full"
                      title="테마명 편집"
                    >
                      {selectedSprint.theme || "제목 없음"}
                    </button>
                  )}
                  <div className="text-[10px] text-ink-muted/50 mt-0.5">
                    {selectedSprint.startDate}
                    {selectedSprint.endDate ? ` ~ ${selectedSprint.endDate}` : " (진행 중)"}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSprint(selectedSprint.id)}
                  className="text-[9px] text-ink-muted/30 hover:text-red-400 transition-colors
                    border border-ink/10 rounded px-1.5 py-0.5 shrink-0"
                >
                  삭제
                </button>
              </div>

              {/* 기간 편집 토글 */}
              <div>
                <button
                  onClick={() => setEditDates(!editDates)}
                  className="text-[10px] text-ink-muted/50 hover:text-ink transition-colors"
                >
                  {editDates ? "▾ 기간 닫기" : "▸ 기간 수정"}
                </button>
                {editDates && (
                  <div className="space-y-1.5 mt-2">
                    <div>
                      <div className="text-[9px] text-ink-muted/50 mb-1">시작일</div>
                      <input
                        type="date"
                        defaultValue={selectedSprint.startDate}
                        onBlur={(e) =>
                          handleUpdateSprintMeta(selectedSprint.id, { startDate: e.target.value })
                        }
                        className="w-full text-xs text-ink bg-transparent border border-ink/15
                          rounded px-2 py-1 outline-none focus:border-ink/30"
                      />
                    </div>
                    <div>
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
                  <div className="text-[9px] text-ink-muted/50 font-medium mb-1.5">기간 목록</div>
                  <div className="space-y-1">
                    {selectedSprint.periods.map((period, idx) => {
                      const c = PERIOD_COLORS[period.type];
                      const isEditing = editingPeriodIdx === idx;
                      return (
                        <div key={idx}>
                          <button
                            onClick={() => {
                              setEditingPeriodIdx(isEditing ? null : idx);
                              setPendingPeriod(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg
                              text-xs transition-all border text-left"
                            style={{
                              background: isEditing ? c.bg : "rgba(0,0,0,0.03)",
                              color: c.text,
                              borderColor: isEditing ? c.text + "44" : "rgba(44,44,42,0.08)",
                            }}
                          >
                            <PeriodIcon type={period.type} size={14} color={c.text} />
                            <span className="font-medium">{c.label}</span>
                            <span className="text-ink-muted/50 text-[9px] truncate flex-1">
                              {period.goal ? `— ${period.goal}` : ""}
                            </span>
                            <span className="text-ink-muted/40 text-[9px] shrink-0">
                              {period.startDate.slice(5)}
                              {period.endDate ? `~${period.endDate.slice(5)}` : ""}
                            </span>
                          </button>
                          {isEditing && (
                            <div className="mt-1">
                              <PeriodEditor
                                period={period}
                                onChange={(patch) => handleUpdatePeriod(idx, patch)}
                                onDelete={() => handleDeletePeriod(idx)}
                                onClose={() => setEditingPeriodIdx(null)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── 기간 추가 ── */}
              <div>
                <div className="text-[9px] text-ink-muted/50 font-medium mb-2">기간 추가</div>

                <div className="space-y-1.5">
                  {PERIOD_TYPES.map((t) => {
                    const c = PERIOD_COLORS[t];
                    const isPending = pendingPeriod?.type === t;
                    return (
                      <button
                        key={t}
                        onClick={() => isPending ? setPendingPeriod(null) : openPendingPeriod(t)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                          text-sm font-medium transition-all border"
                        style={{
                          background: isPending ? c.bg : "rgba(0,0,0,0.025)",
                          color: isPending ? c.text : "rgba(44,44,42,0.55)",
                          borderColor: isPending
                            ? c.text + "55"
                            : "rgba(44,44,42,0.10)",
                        }}
                      >
                        <PeriodIcon
                          type={t}
                          size={18}
                          color={isPending ? c.text : "rgba(44,44,42,0.4)"}
                        />
                        <span>{c.label}</span>
                        {isPending && (
                          <span className="ml-auto text-[9px] opacity-50">▾</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 설정 완료 폼 */}
                {pendingPeriod && (
                  <div className="mt-2 p-3 rounded-lg border border-ink/12 bg-paper/50 space-y-2.5">
                    <div
                      className="text-[10px] font-semibold"
                      style={{ color: PERIOD_COLORS[pendingPeriod.type].text }}
                    >
                      {PERIOD_COLORS[pendingPeriod.type].label} 기간 설정
                    </div>

                    <div>
                      <div className="text-[9px] text-ink-muted/50 mb-1">목표 (한 줄)</div>
                      <input
                        type="text"
                        value={pendingPeriod.goal}
                        onChange={(e) =>
                          setPendingPeriod((p) => p && { ...p, goal: e.target.value })
                        }
                        placeholder="이 기간의 목표"
                        maxLength={60}
                        autoFocus
                        className="w-full text-xs text-ink bg-transparent border-b border-ink/15
                          pb-0.5 outline-none placeholder:text-ink-muted/40 focus:border-ink/30"
                      />
                    </div>

                    <div>
                      <div className="text-[9px] text-ink-muted/50 mb-1">시작일</div>
                      <input
                        type="date"
                        value={pendingPeriod.startDate}
                        onChange={(e) =>
                          setPendingPeriod((p) => p && { ...p, startDate: e.target.value })
                        }
                        className="w-full text-xs text-ink bg-transparent border border-ink/15
                          rounded px-2 py-1 outline-none focus:border-ink/30"
                      />
                    </div>

                    <div>
                      <div className="text-[9px] text-ink-muted/50 mb-1">종료일 (선택)</div>
                      <input
                        type="date"
                        value={pendingPeriod.endDate}
                        onChange={(e) =>
                          setPendingPeriod((p) => p && { ...p, endDate: e.target.value })
                        }
                        className="w-full text-xs text-ink bg-transparent border border-ink/15
                          rounded px-2 py-1 outline-none focus:border-ink/30"
                      />
                    </div>

                    <div className="flex gap-1.5 pt-0.5">
                      <button
                        onClick={confirmPendingPeriod}
                        className="flex-1 py-2 text-xs font-semibold text-white rounded transition-colors"
                        style={{ background: PERIOD_COLORS[pendingPeriod.type].text }}
                      >
                        설정 완료
                      </button>
                      <button
                        onClick={() => setPendingPeriod(null)}
                        className="px-3 py-2 text-xs text-ink-muted/60 hover:text-ink
                          border border-ink/10 rounded transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
