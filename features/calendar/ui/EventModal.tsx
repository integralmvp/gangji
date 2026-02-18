"use client";

/**
 * EventModal — 날짜 클릭 시 열리는 일정 입력 모달
 *
 * - 기록형 일정 (완료/체크/알림 없음)
 * - 날짜 표시 + 텍스트 입력 + 저장/취소
 * - 기존 이벤트 목록 표시 + 삭제
 */

import { useState, useEffect, useRef } from "react";
import { useEventStore } from "@/store/eventStore";

interface EventModalProps {
  date: string; // YYYY-MM-DD
  onClose: () => void;
}

function formatDateKo(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default function EventModal({ date, onClose }: EventModalProps) {
  const { eventsByDate, saveEvent, deleteEvent } = useEventStore();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const events = eventsByDate[date] ?? [];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    if (!text.trim()) return;
    await saveEvent(date, text);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* 모달 */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-ink/10"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(420px, 90vw)",
          maxHeight: "70vh",
        }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-5 py-3.5 rounded-t-lg"
          style={{ background: "#F5F2E0" }}
        >
          <div>
            <div className="text-[10px] text-ink-muted/50 font-medium mb-0.5">일정</div>
            <div className="text-sm font-semibold text-ink">
              {formatDateKo(date)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted/40 hover:text-ink transition-colors text-lg leading-none"
            title="닫기"
          >
            ×
          </button>
        </div>

        {/* 기존 이벤트 목록 */}
        {events.length > 0 && (
          <div className="px-5 pt-3 pb-2 space-y-1.5 max-h-48 overflow-y-auto">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-2 group py-1"
              >
                <span className="text-[11px] text-ink/80 leading-relaxed flex-1">
                  {ev.text}
                </span>
                <button
                  onClick={() => deleteEvent(ev.id, date)}
                  className="text-[9px] text-ink-muted/30 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100 pt-0.5"
                  title="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {events.length > 0 && (
          <div className="mx-5 border-t border-ink/8" />
        )}

        {/* 입력 영역 */}
        <div className="px-5 py-4">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="일정을 입력하세요"
            maxLength={200}
            className="w-full text-sm text-ink bg-transparent outline-none
              placeholder:text-ink-muted/40 border-b border-ink/15
              focus:border-ink/35 pb-1.5 transition-colors"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-[9px] text-ink-muted/30">
              Enter로 저장 · Esc로 닫기
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-ink-muted/60 hover:text-ink
                  border border-ink/10 rounded transition-colors"
              >
                닫기
              </button>
              <button
                onClick={handleSave}
                disabled={!text.trim()}
                className="px-4 py-1.5 text-xs font-medium text-ink
                  bg-ink/8 hover:bg-ink/15 rounded transition-colors
                  disabled:opacity-30 disabled:cursor-not-allowed"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
