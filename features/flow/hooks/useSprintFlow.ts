"use client";

/**
 * useSprintFlow — Sprint 생성/편집 폼 상태 + 저장 로직
 *
 * - Sprint 생성 폼 상태 관리
 * - Period 추가/편집/삭제
 * - sprintStore에 저장 위임
 */

import { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useSprintStore } from "@/store/sprintStore";
import type { Sprint, Period } from "@/types/models";

export type PeriodType = "run" | "stand" | "sit";

interface SprintFormState {
  theme: string;
  startDate: string;
  endDate: string;
}

/** 오늘 날짜 YYYY-MM-DD */
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useSprintFlow() {
  const { currentSprint, loadCurrentSprint, saveSprint, createNewSprint, deleteSprint } =
    useSprintStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingPeriodIdx, setEditingPeriodIdx] = useState<number | null>(null);
  const [form, setForm] = useState<SprintFormState>({
    theme: "",
    startDate: todayStr(),
    endDate: "",
  });

  // 초기 로딩
  useEffect(() => {
    loadCurrentSprint();
  }, [loadCurrentSprint]);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setForm({ theme: "", startDate: todayStr(), endDate: "" });
    setIsCreating(false);
    setEditingPeriodIdx(null);
  }, []);

  // Sprint 생성
  const handleCreateSprint = useCallback(async () => {
    const theme = form.theme.trim() || "새 몰입기간";
    await createNewSprint(theme, form.startDate, form.endDate || undefined);
    resetForm();
  }, [form, createNewSprint, resetForm]);

  // Sprint 삭제
  const handleDeleteSprint = useCallback(async () => {
    if (!currentSprint) return;
    await deleteSprint(currentSprint.id);
  }, [currentSprint, deleteSprint]);

  // Sprint theme/date 인라인 편집
  const handleUpdateSprint = useCallback(
    async (patch: Partial<Pick<Sprint, "theme" | "startDate" | "endDate">>) => {
      if (!currentSprint) return;
      const updated: Sprint = {
        ...currentSprint,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
    },
    [currentSprint, saveSprint]
  );

  // Period 추가
  const handleAddPeriod = useCallback(
    async (type: PeriodType) => {
      if (!currentSprint) return;
      const newPeriod: Period = {
        type,
        goal: "",
        startDate: todayStr(),
        endDate: undefined,
      };
      const updated: Sprint = {
        ...currentSprint,
        periods: [...currentSprint.periods, newPeriod],
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
      setEditingPeriodIdx(updated.periods.length - 1);
    },
    [currentSprint, saveSprint]
  );

  // Period 업데이트
  const handleUpdatePeriod = useCallback(
    async (idx: number, patch: Partial<Period>) => {
      if (!currentSprint) return;
      const periods = currentSprint.periods.map((p, i) =>
        i === idx ? { ...p, ...patch } : p
      );
      const updated: Sprint = {
        ...currentSprint,
        periods,
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
    },
    [currentSprint, saveSprint]
  );

  // Period 삭제
  const handleDeletePeriod = useCallback(
    async (idx: number) => {
      if (!currentSprint) return;
      const periods = currentSprint.periods.filter((_, i) => i !== idx);
      const updated: Sprint = {
        ...currentSprint,
        periods,
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
      setEditingPeriodIdx(null);
    },
    [currentSprint, saveSprint]
  );

  return {
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
  };
}
