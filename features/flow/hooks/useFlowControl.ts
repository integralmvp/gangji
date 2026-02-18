"use client";

/**
 * useFlowControl — FlowControlPanel용 Sprint/Period CRUD 훅
 *
 * - 전체 Sprint 목록 관리 (allSprints)
 * - 선택된 Sprint 기준 Period 편집
 * - Sprint 생성/수정/삭제
 * - Period 추가/수정/삭제
 */

import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { useSprintStore } from "@/store/sprintStore";
import type { Sprint, Period } from "@/types/models";

export type PeriodType = "run" | "stand" | "sit";

interface SprintFormState {
  theme: string;
  startDate: string;
  endDate: string;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useFlowControl() {
  const {
    allSprints,
    selectedSprintId,
    selectSprint,
    saveSprint,
    createNewSprint,
    deleteSprint,
  } = useSprintStore();

  const selectedSprint = allSprints.find((s) => s.id === selectedSprintId) ?? null;

  const [isCreating, setIsCreating] = useState(false);
  const [editingPeriodIdx, setEditingPeriodIdx] = useState<number | null>(null);
  const [editingSprintMeta, setEditingSprintMeta] = useState(false);

  const [form, setForm] = useState<SprintFormState>({
    theme: "",
    startDate: todayStr(),
    endDate: "",
  });

  const resetForm = useCallback(() => {
    setForm({ theme: "", startDate: todayStr(), endDate: "" });
    setIsCreating(false);
    setEditingPeriodIdx(null);
    setEditingSprintMeta(false);
  }, []);

  // Sprint 생성
  const handleCreateSprint = useCallback(async () => {
    const theme = form.theme.trim() || "새 몰입기간";
    await createNewSprint(theme, form.startDate, form.endDate || undefined);
    resetForm();
  }, [form, createNewSprint, resetForm]);

  // Sprint 삭제
  const handleDeleteSprint = useCallback(async (id: string) => {
    await deleteSprint(id);
    setEditingPeriodIdx(null);
  }, [deleteSprint]);

  // Sprint 메타(theme/startDate/endDate) 업데이트
  const handleUpdateSprintMeta = useCallback(
    async (id: string, patch: Partial<Pick<Sprint, "theme" | "startDate" | "endDate">>) => {
      const sprint = allSprints.find((s) => s.id === id);
      if (!sprint) return;
      const updated: Sprint = {
        ...sprint,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
    },
    [allSprints, saveSprint]
  );

  // Period 추가 (전체 Period 객체를 받아 저장)
  const handleAddPeriod = useCallback(
    async (newPeriod: Period) => {
      if (!selectedSprint) return;
      const updated: Sprint = {
        ...selectedSprint,
        periods: [...selectedSprint.periods, newPeriod],
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
    },
    [selectedSprint, saveSprint]
  );

  // Period 업데이트
  const handleUpdatePeriod = useCallback(
    async (idx: number, patch: Partial<Period>) => {
      if (!selectedSprint) return;
      const periods = selectedSprint.periods.map((p, i) =>
        i === idx ? { ...p, ...patch } : p
      );
      const updated: Sprint = {
        ...selectedSprint,
        periods,
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
    },
    [selectedSprint, saveSprint]
  );

  // Period 삭제
  const handleDeletePeriod = useCallback(
    async (idx: number) => {
      if (!selectedSprint) return;
      const periods = selectedSprint.periods.filter((_, i) => i !== idx);
      const updated: Sprint = {
        ...selectedSprint,
        periods,
        updatedAt: new Date().toISOString(),
      };
      await saveSprint(updated);
      setEditingPeriodIdx(null);
    },
    [selectedSprint, saveSprint]
  );

  return {
    allSprints,
    selectedSprint,
    selectedSprintId,
    selectSprint,
    isCreating,
    setIsCreating,
    editingPeriodIdx,
    setEditingPeriodIdx,
    editingSprintMeta,
    setEditingSprintMeta,
    form,
    setForm,
    handleCreateSprint,
    handleDeleteSprint,
    handleUpdateSprintMeta,
    handleAddPeriod,
    handleUpdatePeriod,
    handleDeletePeriod,
    resetForm,
  };
}
